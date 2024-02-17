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

const url: string = 'https://api.together.xyz/v1/chat/completions';
const apiKey: string = '77712fb6e31d5284a3c4015b53a49f6c4a9d093e29232cef4ff609c5c935a7d6';

export const History = () => {
  const [studentData, setStudentData] = useState<DocumentData>();
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
              content: `Generate a history question for ${studentData?.gradeLevel} 
                grade level. Give one correct answer, and three wrong answers in JSON`
          }
      ]
    };
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
  };
  
  let generatedQuestion: string = '';
  fetch(url, options)
      .then(response => response.json())
      .then(result => {
        generatedQuestion = result.choices[0].message.content;
      console.log(generatedQuestion);
      })
      .catch(error => {
      console.error('Error:', error);
      });
    
    return (
      <View style={styles.container}>
      <Text style={styles.header}>History Quiz</Text>
      <Text style={styles.gradeLevel}>
        Grade Level: {studentData?.gradeLevel}
      </Text>
      <Text style={styles.question}>
        {generatedQuestion}
      </Text>
      <TextInput
        value={userAnswer}
        onChangeText={(text) => setUserAnswer(text)}
        keyboardType="numeric"
        placeholder="Your Answer"
        style={styles.input}
      />
      <Button title="Check Answer" /*onPress={null} *//>
      <Text style={styles.result}>{correctAnswer}</Text>
      <Button title="Next Question" /*onPress={null} */ />
    </View>
  )
}

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
