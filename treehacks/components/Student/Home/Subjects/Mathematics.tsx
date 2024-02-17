import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

export const Mathematics = () => {
  const [studentData, setStudentData] = useState<DocumentData>();
  const [operand1, setOperand1] = useState(Math.floor(Math.random() * 5) + 1);
  const [operand2, setOperand2] = useState(Math.floor(Math.random() * 1) + 1);
  const [operator, setOperator] = useState("+");
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [pointsUpdated, setPointsUpdated] = useState(false);

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
    } else {
      setCorrectAnswer("Incorrect. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Math Quiz</Text>
      <Text style={styles.gradeLevel}>
        Grade Level: {studentData?.gradeLevel}
      </Text>
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
      <Button title="Check Answer" onPress={checkAnswer} />
      <Text style={styles.result}>{correctAnswer}</Text>
      <Button title="Next Question" onPress={generateQuestion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
  },
  gradeLevel: {
    fontSize: 20,
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    width: 200,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});
