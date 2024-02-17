import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Subject from "./Subjects/Subject";
import { SubjectProps } from "./Subjects/Subject";
import { Colors } from "../../../constants/Colors";
import { useNavigation } from "@react-navigation/native";

export const StudentHome: React.FC = () => {
  // hardcoded for now
  const navigation = useNavigation();
  const subjects: SubjectProps[] = [
    {
      subjectName: "Mathematics",
      gradeLevel: 2,
      subjectColor: Colors.blue,
    },
    {
      subjectName: "Science",
      gradeLevel: 4,
      subjectColor: Colors.green,
    },
    {
      subjectName: "History",
      gradeLevel: 1,
      subjectColor: Colors.red,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Student Home </Text>
      {subjects.map((subject, index) => (
        <Subject
          key={index}
          subjectName={subject.subjectName}
          gradeLevel={subject.gradeLevel}
          subjectColor={subject.subjectColor}
          navigation={navigation}
        />
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});
