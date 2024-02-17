// StudentHome.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Subject from "./Subjects/Subject";
import { SubjectProps } from "./Subjects/Subject";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebase/firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { StudentData } from "../../../constants/types";

export const StudentHome: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>();
  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data() as StudentData);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchStudentData();
  }, []);

  const navigation = useNavigation();
  const subjects: SubjectProps[] = [
    {
      subjectName: "Mathematics",
      gradeLevel: studentData?.gradeLevel || "1",
      subjectColor: Colors.accent1,
      icon: "calculate",
    },
    {
      subjectName: "Science",
      gradeLevel: studentData?.gradeLevel || "1",
      subjectColor: Colors.accent2,
      icon: "science",
    },
    {
      subjectName: "History",
      gradeLevel: studentData?.gradeLevel || "1",
      subjectColor: Colors.primary,
      icon: "history",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.headerText}>Welcome, {studentData?.name}!</Text>
        {subjects.map((subject, index) => (
          <Subject
            key={index}
            subjectName={subject.subjectName}
            gradeLevel={subject.gradeLevel}
            subjectColor={subject.subjectColor}
            navigation={navigation}
            icon={subject.icon}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    alignItems: "center",
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default StudentHome;
