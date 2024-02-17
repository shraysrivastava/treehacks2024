import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { 
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../../../../firebase/firebase";
import { Colors } from "../../../../constants/Colors";
import CustomToast, { ToastProps } from "../../../../constants/Toast";

const { width } = Dimensions.get("window");

export const Science = () => {
  const [questionData, setQuestionData] = useState<DocumentData>();
  const [studentData, setStudentData] = useState<DocumentData>();
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
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
    if (studentData) {
      fetchRandomQuestion();
    }
  }, [studentData]);

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

  const fetchRandomQuestion = async () => {
    const db = getFirestore();
    const collectionRef = collection(
      db,
      `grade-${studentData?.gradeLevel}Science`
    );
    const querySnapshot = await getDocs(collectionRef);
    const questions: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });

    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];
    setQuestionData(randomQuestion);
  };

  const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswerSelect = (selectedAnswer: string) => {
    if (selectedAnswer === questionData?.answer) {
      setToast({ message: "Correct!", color: Colors.toastSuccess})
      const newPoints = studentData?.points + 1;
      const newSciencePoints = studentData?.subjectPoints.sciencePoints + 1;
      updatePoints(newPoints, newSciencePoints);
      console.log(studentData);
    } else {
      setToast({ message: "Try Again.", color: Colors.toastError });
    }

    fetchRandomQuestion();
  };

  const updatePoints = async (newPoints: number, newSciencePoints: number) => {
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const studentSubjectPoints = studentData?.subjectPoints;
      const updatedSubjectPoints = {
        ...studentSubjectPoints,
        sciencePoints: newSciencePoints,
      };

      try {
        await updateDoc(docRef, {
          points: newPoints,
          subjectPoints: updatedSubjectPoints,
        });
        setPointsUpdated(true);
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.background }]}>
      {questionData && (
        <View style={styles.questionContainer}>
          <Text style={[styles.questionText, { color: Colors.secondary }]}>
            {questionData.question}
          </Text>
          {shuffleArray([
            questionData.answer,
            questionData.wrongAnswer1,
            questionData.wrongAnswer2,
            questionData.wrongAnswer3,
          ]).map((answer: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleAnswerSelect(answer)}
            >
              <Text style={styles.buttonText}>{answer}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <CustomToast message={toast.message} color={toast.color}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  questionContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  questionText: {
    fontSize: 50,
    marginBottom: 20,
    color: Colors.secondary,
  },
  button: {
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 35,
    color: Colors.secondary,
  },
});
