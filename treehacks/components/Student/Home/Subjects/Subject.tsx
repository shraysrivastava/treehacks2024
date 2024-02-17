import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

export type SubjectProps = {
  subjectName: string;
  gradeLevel: number;
  subjectColor: string;
  navigation?: any;
  icon: any;
};

const Subject = ({
  subjectName,
  gradeLevel,
  subjectColor,
  navigation,
  icon
}: SubjectProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: subjectColor }]}
      onPress={() => navigation.navigate(subjectName)}
    >
      <Text style={styles.text}>{subjectName}</Text>
      <Text style={styles.text}>Grade Level: {gradeLevel}</Text>
      <MaterialIcons name={icon} size={24} color="black" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 400,
    height: 100,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    opacity: 1,
    marginBottom:20
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Subject;
