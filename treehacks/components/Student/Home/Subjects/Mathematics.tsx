import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { Colors } from "../../../../constants/Colors";
import CustomToast, { ToastProps } from "../../../../constants/Toast";
const { width } = Dimensions.get("window");

export const Mathematics = () => {
  const [studentData, setStudentData] = useState<DocumentData>();
  const [operand1, setOperand1] = useState(Math.floor(Math.random() * 5) + 1);
  const [operand2, setOperand2] = useState(Math.floor(Math.random() * 1) + 1);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser; // Assuming you're using Firebase Authentication

      if (user) {
        const docRef = doc(db, "users", user.uid); // Adjust "users" to your collection name
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchStudentData();
  }, [pointsUpdated]);

  useEffect(() => {
    if (toast.message !== "") {
      toastTimeoutRef.current = setTimeout(() => {
        setToast({ message: "", color: "" });
      }, 2000);
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast.message]);

  const updatePoints = async (newPoints: number, newMathPoints: number) => {
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const studentSubjectPoints = studentData?.subjectPoints;
      const updatedSubjectPoints = {
        ...studentSubjectPoints,
        mathPoints: newMathPoints,
      };

      try {
        await updateDoc(docRef, {
          points: newPoints,
          subjectPoints: updatedSubjectPoints,
        });
        setPointsUpdated(true); // Set pointsUpdated to true to trigger useEffect
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }
  };

  const generateQuestion = () => {
    let op1, op2;
    switch (studentData?.gradeLevel) {
      case "1":
        op1 = Math.floor(Math.random() * 5) + 1;
        op2 = Math.floor(Math.random() * 5) + 1;
        setOperator("+");
        break;
      case "2":
        op1 = Math.floor(Math.random() * 10) + 1;
        op2 = Math.floor(Math.random() * 10) + 1;
        setOperator(["+", "-"][Math.floor(Math.random() * 2)]);
        break;
      case "3":
        op1 = Math.floor(Math.random() * 10) + 1;
        op2 = Math.floor(Math.random() * 10) + 1;
        setOperator(["+", "-", "*"][Math.floor(Math.random() * 3)]);
        break;
      case "4":
        op1 = Math.floor(Math.random() * 20) + 1;
        op2 = Math.floor(Math.random() * 10) + 1;
        setOperator(["+", "-", "*", "/"][Math.floor(Math.random() * 4)]);
        break;
      case "5":
        op1 = Math.floor(Math.random() * 50) + 1;
        op2 = Math.floor(Math.random() * 20) + 1;
        setOperator(["+", "-", "*", "/"][Math.floor(Math.random() * 4)]);
        break;
      default:
        op1 = 0;
        op2 = 0;
        setOperator("");
    }
    if (op2 > op1) {
      let temp = op1;
      op1 = op2;
      op2 = op1;
    }
    setOperand1(op1);
    setOperand2(op2);
    setUserAnswer("");
    setCorrectAnswer("");
  };

  const checkAnswer = () => {
    const ans = eval(`${operand1} ${operator} ${operand2}`);
    if (parseFloat(userAnswer) === ans) {
      setCorrectAnswer("Correct!");
      const newPoints = studentData?.points + 1;
      const newMathPoints = studentData?.subjectPoints.mathPoints + 1;
      updatePoints(newPoints, newMathPoints);
      setToast({ message: "Correct!", color: Colors.toastSuccess });
      generateQuestion();
    } else {
      setCorrectAnswer("Incorrect. Try again.");
      setToast({ message: "Try Again.", color: Colors.toastError });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>What is...</Text>
        <Text style={styles.question}>
          {operand1} {operator} {operand2} =
        </Text>
        <TextInput
          value={userAnswer}
          onChangeText={(text) => setUserAnswer(text)}
          keyboardType="numeric"
          placeholder="Your Answer"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={checkAnswer}>
          <Text style={styles.buttonText}>Check Answer</Text>
        </TouchableOpacity>
        <Text style={styles.result}>{correctAnswer}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 50, // Increased font size
    marginBottom: 20, // Increased margin for better spacing
    color: Colors.secondary,
  },
  gradeLevel: {
    fontSize: 35, // Increased font size
    marginBottom: 20, // Increased margin for better spacing
    color: Colors.secondary,
  },
  question: {
    fontSize: 50, // Increased font size
    marginBottom: 20, // Increased margin for better spacing
    color: Colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    width: width * 0.8, // Adjusted width to take up most of the screen
    height: 60, // Increased height for better visibility
    marginBottom: 20,
    paddingHorizontal: 20, // Increased padding for better input experience
    backgroundColor: Colors.secondary,
    color: Colors.primary,
    fontSize: 24, // Increased font size
    borderRadius: 20, // Rounded corners
  },
  buttonContainer: {
    marginBottom: 20, // Increased margin for better spacing
  },
  button: {
    marginBottom: 200,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 35, // Increased font size
    fontWeight: "bold",
  },
  result: {
    fontSize: 24, // Increased font size
    fontWeight: "bold",
    color: Colors.primary,
  },
  dismissButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  dismissButtonText: {
    fontSize: 18,
    color: Colors.secondary
  }
});
