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
import Skip from "../../../Skip";

export const History = () => {
  const [questionData, setQuestionData] = useState<DocumentData>();
  const [studentData, setStudentData] = useState<DocumentData>();
  const [pointsUpdated, setPointsUpdated] = useState(false);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const [showFeedback, setShowFeedback] = useState(false); // State for showing/hiding feedback
  const [hint, setHint] = useState<string | null>(null); // State to store the hint
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
      }, 3000);
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast.message]);

  useEffect(() => {
    // Fetch hint when showFeedback is true
    if (showFeedback) {
      getHint().then((hint) => {
        setHint(hint);
      });
    }
  }, [showFeedback]);

  const url: string = 'https://api.together.xyz/v1/chat/completions';
  const apiKey: string = '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6';
  const getHint = async () => {
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
          content: 'You are an AI assistant who does not start with greetings, just gets to the point'
        },
        {
          role: 'user',
          content: `Give a hint for this question ${questionData?.question} as if you are talking to a student of ${studentData?.gradeLevel} grade level.`
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
      return result.choices[0].message.content;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchRandomQuestion = async () => {
    setShowFeedback(false); 
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

  const handleAnswerSelect = async (selectedAnswer: string) => {
    if (selectedAnswer === questionData?.answer) {
      setToast({ message: "Correct!", color: Colors.toastSuccess})
      const newPoints = studentData?.points + 1;
      const newleaderBoardPoints = studentData?.leaderBoardPoints + 1;
      const newSciencePoints = studentData?.subjectPoints.sciencePoints + 1;
      updatePoints(newPoints, newleaderBoardPoints, newSciencePoints);
    } else {
      setToast({ message: "Try Again.", color: Colors.toastError });
      setShowFeedback(true);
      if (!hint) {
        try {
          const hintFromAPI = await getHint();
          setHint(hintFromAPI);
        } catch (error) {
          console.error('Error fetching hint:', error);
        }
      }
      return; 
    }
  

    fetchRandomQuestion();
  };

  const updatePoints = async (newPoints: number, newleaderBoardPoints: number, newHistoryPoints: number) => {
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
          leaderBoardPoints: newleaderBoardPoints,
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
          {showFeedback && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>Oops! That's not correct!</Text>
              <Text style={styles.AItext}>
                Here's an AI hint: {hint}
              </Text>
            </View>
          )}
          <Skip onPress={fetchRandomQuestion}></Skip>
        </View>
      )}
      <CustomToast message={toast.message} color={toast.color}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  questionContainer: {
    width: width * 0.9,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.lightgray,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 24,
    marginBottom: 20,
    color: Colors.secondary,
    textAlign: "center",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.accent2,
    borderRadius: 10,
    alignItems: "center",
  },
  feedbackText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  AItext: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
});
