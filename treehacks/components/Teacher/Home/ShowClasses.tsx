import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TeacherData } from "../../../constants/types";
import { Colors } from "../../../constants/Colors";
import { NavigationProp } from '@react-navigation/native';

interface ShowClassesProps {
  teacherData: TeacherData;
  navigation: NavigationProp<any>; // Consider using a more specific type for better type safety
}

export const ShowClasses: React.FC<ShowClassesProps> = ({ teacherData, navigation }) => {
  // Convert classes object into an array of [className, students] tuples
  const classesArray = Object.entries(teacherData.classes);
  // console.log("here" + classesArray);

  if (classesArray.length === 0) {
    return <Text>You don't have any classes yet. Would you like to create one?</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Your Classes</Text>
      {classesArray.map(([className, students], index) => (
        <TouchableOpacity
          key={index}
          style={styles.classContainer}
          onPress={() => navigation.navigate("Manage Students", { className, students, teacherData })}
        >
          <Text style={styles.classText}>{className}</Text>
        </TouchableOpacity>
      ))} 
    </ScrollView> 
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
  borderRadius: 8,
  padding: 15,
  marginVertical: 8,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  classContainer: {
    width: "100%",
    padding: 20,
    marginVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    alignItems: "center",
  },
  classText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
});
