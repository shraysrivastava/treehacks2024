import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { ProgressBar } from "../../../constants/ProgressBar"; // Add ProgressBar component
import {Colors } from "../../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { StudentData } from "../../../constants/types";

interface StudentProgressProps {
    student: StudentData;
  }
  
export const StudentProgress: React.FC<StudentProgressProps> = ({ student }) => {
    return (
      <View style={styles.studentContainer}>
        <Text style={styles.studentName}>{student.name}</Text>
        {Object.entries(student.subjectPoints).map(([subject, points]) => (
          <View key={subject} style={styles.subjectProgressContainer}>
            <Text style={styles.subjectName}>{subject}</Text>
            <ProgressBar count={points} capacity={10}/>
          </View>
        ))}
      </View>
    );
  };
  

const styles = StyleSheet.create({
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    height: "80%", // Adjust based on content size
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  studentProgressContainer: {
    marginBottom: 15,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
  },
  subjectProgressContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  subjectName: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  studentContainer: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  // Add ProgressBar and other styles as needed
});