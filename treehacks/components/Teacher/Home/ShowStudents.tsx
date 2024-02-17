import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Classes, StudentData, TeacherData } from "../../../constants/types";
import {
  doc,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase";
import { Colors } from "../../../constants/Colors";
import { RouteProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

interface ShowStudentsProps {
  route: RouteProp<
    { params: { className: string; teacherData: TeacherData } },
    "params"
  >;
}
export const ShowStudents: React.FC<ShowStudentsProps> = ({ route }) => {
  const { className, teacherData } = route.params;
  const user = auth.currentUser;
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState("");

  const fetchStudentData = useCallback(async () => {
    // Assuming classItem.students is an array of emails for the class
    const studentEmails = teacherData.classes[className];
  
    if (studentEmails && studentEmails.length > 0) {
      const studentsQuery = query(
        collection(db, "users"),
        where("email", "in", studentEmails)
      );
  
      try {
        const querySnapshot = await getDocs(studentsQuery);
        const fetchedStudents = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as StudentData[];
  
        setStudentData(fetchedStudents);
      } catch (err) {
        console.error("Error fetching students: ", err);
      }
    }
  }, [className, teacherData]);
  

  useEffect(() => {
    fetchStudentData();
    console.log(studentData);
  }, [fetchStudentData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData().finally(() => setRefreshing(false));
    
  }, [fetchStudentData]);

  // Helper function to validate email format
  const isValidEmail = () => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Simple regex for email validation
    return regex.test(email);
  };

  const addStudentToClass = async () => {
    if (!isValidEmail()) {
      console.log("Invalid email format");
      return;
    }
  
    // Check if the student is already in the class
    if (teacherData.classes[className]?.includes(email)) {
      console.log("Student already in class");
      return;
    }
    if (!user) {
      console.log("No user logged in");
      return;
    }

    try {
      // Update the teacher's class with the new student email
      await runTransaction(db, async (transaction) => {
        const teacherDocRef = doc(db, "users", user.uid); // Assuming the teacher's document ID is the user's UID
        const teacherDoc = await transaction.get(teacherDocRef);
  
        if (!teacherDoc.exists()) {
          throw new Error("Teacher document does not exist!");
        }
  
        // Add the student's email to the class
        const updatedClassStudents = arrayUnion(email);
        const updatedClasses = {
          ...teacherData.classes,
          [className]: updatedClassStudents,
        };
  
        // Update the teacher document with the modified classes object
        transaction.update(teacherDocRef, { classes: updatedClasses });
      });
  
      console.log("Student added to class successfully");
      fetchStudentData(); // Refresh student data to reflect the update
    } catch (err) {
      console.error("Transaction failed: ", err);
    }
  };
  

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
          tintColor={Colors.primary}
          progressBackgroundColor="#ffffff"
        />
      }
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(text) => setEmail(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addStudentToClass}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Class: {className}</Text>
      {studentData.length > 0 ? (
        studentData.map((student, index) => (
          <Text key={index} style={styles.text}>
            {student.name} ({student.email})
          </Text>
        ))
      ) : (
        <Text style={styles.text}>
          There are no students in this class yet.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  TextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    margin: 5,
    padding: 10,
    alignItems: "center",
    backgroundColor: Colors.green,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
