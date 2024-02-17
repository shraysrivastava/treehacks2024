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
      'Authorization': 'Bearer ${apiKey}',
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
              content: 'Generate a history question for ${studentData?.gradeLevel} grade level.'
          }
      ]
    };
    const options: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    };
    
    fetch(url, options)
      .then((response: Response) => response.json())
      .then((result: any) => {
          console.log(result);
      })
      .catch((error: any) => {
          console.error('Error:', error);
    });
    
    return (
    <View>
      <Text>History</Text>
    </View>
  )
}
