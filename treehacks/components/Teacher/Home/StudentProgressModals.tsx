import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ProgressBar } from "../../../constants/ProgressBar"; // Add ProgressBar component
import { Colors } from "../../../constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { StudentData } from "../../../constants/types";

interface StudentProgressProps {
  student: StudentData;
  studentKey: string;
}
interface Subjects {
  mathPoints: string;
  sciencePoints: string;
  englishPoints: string;
  historyPoints: string;
  [key: string]: string;
}

const convertSubject: Subjects = {
  mathPoints: "Math",
  sciencePoints: "Science",
  englishPoints: "English",
  historyPoints: "History",
};

export const StudentProgress: React.FC<StudentProgressProps> = ({ student, studentKey }) => {
  return (
    <View style={styles.studentContainer} key={studentKey}>
      <Text style={styles.studentName}>{student.name}</Text>
      {Object.entries(student.subjectPoints).map(([subject, points], index) => (
        <View key={subject + student.email + index.toString()} style={styles.subjectProgressContainer}>
          <Text style={styles.subjectName}>{convertSubject[subject]}</Text>
          <ProgressBar count={points} capacity={10} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  studentContainer: {
    backgroundColor: "white", // White background
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.lightgray, // Light grey border
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary, // Blue color for the student name
    marginBottom: 10,
  },
  subjectProgressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    
  },
  subjectName: {
    fontSize: 16,
    color: Colors.accent1, // Green color for the subject name
  },
  // Add ProgressBar and other styles as needed
});
