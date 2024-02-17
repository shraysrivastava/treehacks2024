import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Subject from "./Subjects/Subject";
import { SubjectProps } from "./Subjects/Subject";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { auth } from "../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

export const StudentHome: React.FC = () => {
  
  const [studentData, setStudentData] = useState<DocumentData>();
  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser; 

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
  }, []);
  
  // hardcoded for now
  const navigation = useNavigation();
  const subjects: SubjectProps[] = [
    {
      subjectName: "Mathematics",
      gradeLevel: studentData?.gradeLevel,
      subjectColor: Colors.primary,
      icon: "add"
    },
    {
      subjectName: "Science",
      gradeLevel: studentData?.gradeLevel,
      subjectColor: Colors.primary,
      icon: "science"
    },
    {
      subjectName: "History",
      gradeLevel: studentData?.gradeLevel,
      subjectColor: Colors.primary,
      icon:"history-edu"
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Student Home </Text>
      {subjects.map((subject, index) => (
        <Subject
          key={index}
          subjectName={subject.subjectName}
          gradeLevel={studentData?.gradeLevel}
          subjectColor={subject.subjectColor}
          navigation={navigation}
          icon={subject.icon}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems:"center",
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom:30
  },
});
