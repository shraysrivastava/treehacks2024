import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  DocumentData,
  addDoc,
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

export const History = () => {
  const [questionData, setQuestionData] = useState<DocumentData>();
  const [studentData, setStudentData] = useState<DocumentData>();
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [incorrectAnswers, setIncorrectAnswers] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [topics, setTopics] = useState<string[]>([]);

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
      fetchGeneratedQuestion();
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

  const url: string = 'https://api.together.xyz/v1/chat/completions';
  const apiKey: string = '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6';
  const fetchGeneratedQuestion = async () => {
    const headers: HeadersInit = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    });

    const data: { model: string, max_tokens: number, messages: { role: string, content: string }[] } = {
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant'
        },
        {
          role: 'user',
          content: `Create a new US history question for a student of ${studentData?.gradeLevel} grade level. The question should not be in ${topics} Give one correct answer, and three wrong answers.
          make sure the first line of your response is the question. the first line is the correct answer. and the 6th line onwards are incorrect answers`
        }
      ]
    };

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const generatedQuestion = result.choices[0].message.content;
      // Split the string into lines
      const lines = generatedQuestion.split('\n');

      // Extract question
      setQuestion(lines[0].replace('Question: ', ''))

      setCorrectAnswer(lines[2].replace('Correct answer: ', ''))

      setIncorrectAnswers(lines.slice(6).map((line: string) => line.replace(/^\d+\. /, '')))

      setTopics(prevTopics => [...prevTopics, question])

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const postGeneratedQuestion = async () => {
    const db = getFirestore();
    await addDoc(collection(db, `grade-${studentData?.gradeLevel}History`), {
      question: question,
      answer: correctAnswer,
      wrongAnswer1: incorrectAnswers[0],
      wrongAnswer2: incorrectAnswers[1],
      wrongAnswer3: incorrectAnswers[2],
    });
  };

  postGeneratedQuestion();
  const fetchRandomQuestion = async () => {
    const db = getFirestore();
    const collectionRef = collection(
      db,
      `grade-${studentData?.gradeLevel}History`
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
      setToast({ message: "Correct!", color: Colors.toastSuccess });
      const newPoints = studentData?.points + 1;
      const newHistoryPoints = studentData?.subjectPoints.historyPoints + 1;
      updatePoints(newPoints, newHistoryPoints);
      console.log(studentData);
    } else {
      setToast({ message: "Try Again.", color: Colors.toastError });
    }
    fetchRandomQuestion();
  };

  const updatePoints = async (newPoints: number, newHistoryPoints: number) => {
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const studentSubjectPoints = studentData?.subjectPoints;
      const updatedSubjectPoints = {
        ...studentSubjectPoints,
        historyPoints: newHistoryPoints,
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors.background }]}>
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
      <CustomToast message={toast.message} color={toast.color} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
