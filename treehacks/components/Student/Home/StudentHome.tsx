// StudentHome.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from "react-native";
import Subject from "./Subjects/Subject";
import { SubjectProps } from "./Subjects/Subject";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../firebase/firebase";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { StudentData } from "../../../constants/types";

export const StudentHome: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData>();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [courses, setCourses] = useState<DocumentData>([]);

  const subjects = [
    {
      subjectName: "Mathematics",
      gradeLevel: studentData?.gradeLevel || "",
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
  const fetchCourses = async (classes: string[]) => {
<<<<<<< HEAD
    // Ensure there are classes to process
=======
  
>>>>>>> b603ffaa3d9a2a321c9199c2fc81da2ceb9f37cd
    if (!classes || classes.length === 0) {
      console.log("No classes found for the student.");
      return;
    }

    const coursesRef = collection(db, "courses");
<<<<<<< HEAD

    // Process each class UID to fetch course details
=======
  
>>>>>>> b603ffaa3d9a2a321c9199c2fc81da2ceb9f37cd
    for (const classUID of classes) {
      try {
        const docRef = doc(coursesRef, classUID); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
<<<<<<< HEAD
          setCourses([
            {
              subjectName: docSnap.data().courseData.courseName,
              gradeLevel: docSnap.data().gradeLevel,
              subjectColor: determineSubjectColor(
                docSnap.data().courseData.courseName
              ),
              icon: "book",
            },
          ]);
=======
          setCourses([{
            subjectName: docSnap.data().courseData.courseName,
            gradeLevel: "Teacher Assigned Work",
            subjectColor: determineSubjectColor(docSnap.data().courseData.courseName),
            icon: "book",
          }]);
          
          
>>>>>>> b603ffaa3d9a2a321c9199c2fc81da2ceb9f37cd
        } else {
          console.log(`No course found for UID: ${classUID}`);
        }
      } catch (error) {
        console.error(`Error fetching course for UID: ${classUID}`, error);
      }
    }
    console.log("Fetched courses:", courses);
  };
<<<<<<< HEAD

  // Example function to determine subject color dynamically
=======
  
>>>>>>> b603ffaa3d9a2a321c9199c2fc81da2ceb9f37cd
  const determineSubjectColor = (subjectName: string) => {
    switch (subjectName?.toLowerCase()) {
      case "mathematics":
        return Colors.accent1;
      case "science":
        return Colors.accent2;
      case "history":
        return Colors.primary;
      default:
        return Colors.secondary; // Default color
    }
  };

  const determineDisplayName = (grade: string) => {
    switch (grade) {
      case "1":
        return "1st Grade";
      case "2":
        return "2nd Grade";
      case "3":
        return "3rd Grade";
      default:
        return `${grade}th Grade`;
    }
  };

  useEffect(() => {
    fetchStudentData();
    fetchCourses(studentData?.classes || []);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses(studentData?.classes || [])
      .then(fetchStudentData)
      .finally(() => setRefreshing(false));
  }, [fetchStudentData]);

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.secondary]}
            tintColor={Colors.secondary}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <>
<<<<<<< HEAD
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
=======
        <Text style={styles.headerText}>Welcome, {studentData?.name}!</Text>
        {subjects.map((subject, index) => (
          <Subject
            key={index}
            subjectName={subject.subjectName}
            gradeLevel={determineDisplayName(subject.gradeLevel)}
            subjectColor={subject.subjectColor}
            navigation={navigation}
            icon={subject.icon}
          />
        ))}
>>>>>>> b603ffaa3d9a2a321c9199c2fc81da2ceb9f37cd
          {courses.map((subject: DocumentData, index: number) => (
            <Subject
              key={index}
              subjectName={subject.subjectName}
              gradeLevel={subject.gradeLevel}
              subjectColor={subject.subjectColor}
              navigation={navigation}
              icon={subject.icon}
            />
          ))}
        </>
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
