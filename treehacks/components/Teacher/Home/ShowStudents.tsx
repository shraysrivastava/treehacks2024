import React, { useCallback, useEffect, useRef, useState } from "react";
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
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase";
import { Colors } from "../../../constants/Colors";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomToast, { ToastProps } from "../../../constants/Toast";
import { StudentProgress } from "./StudentProgressModals";

interface ShowStudentsProps {
  route: RouteProp<
    { params: { className: string } },
    "params"
  >; 
}
export const ShowStudents: React.FC<ShowStudentsProps> = ({ route }) => {
  const { className } = route.params;
  const [teacherData, setTeacherData] = useState<TeacherData>();
  const user = auth.currentUser;
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null); 

  const fetchTeacherData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) throw new Error("No such document!");
      setTeacherData(docSnap.data() as TeacherData);
    } catch (error) {
      console.error("Fetch teacher data failed:", error);
      setToast({ message: "Failed to fetch teacher data", color: "red" });
    }
  };

  const fetchStudentData = useCallback(async () => {
    try {
      if (!teacherData) return;
      const studentEmails = teacherData.classes[className];
      if (!studentEmails || studentEmails.length === 0) return;
      const studentsQuery = query(collection(db, "users"), where("email", "in", studentEmails));
      const querySnapshot = await getDocs(studentsQuery);
      const fetchedStudents = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as StudentData[];
      setStudentData(fetchedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      setToast({ message: "Failed to fetch students", color: "red" });
    }
  }, [className, teacherData]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeacherData().then(fetchStudentData).finally(() => setRefreshing(false));
  }, [fetchStudentData]);

  useEffect(() => {
    if (toast.message !== "") {
      toastTimeoutRef.current = setTimeout(() => {
        setToast({ message: "", color: "" });
      }, 2000);
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast.message]);

  const isValidEmail = () => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Simple regex for email validation
    return regex.test(email);
  };

  const addStudentToClass = async () => {
    if (!isValidEmail()) {
      console.log("Invalid email format");
      setToast({ message: "Invalid email format", color: Colors.toastError });
      return;
    }
  
    if (!user) {
      console.log("User not authenticated");
      setToast({ message: "User not authenticated", color: Colors.toastError });
      return;
    }
  
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
  
      if (!docSnap.exists()) {
        console.log("Document does not exist");
        setToast({ message: "Document does not exist", color: Colors.toastError });
        return;
      }
  
      const userData = docSnap.data();
      const classesMap = userData.classes || {};
      const studentsArray = classesMap[className] || [];
  
      if (studentsArray.includes(email)) {
        console.log("Student already in class");
        setToast({ message: "Student already in class", color: Colors.toastError });
        return;
      }
  
      studentsArray.push(email);
  
      // Update the classes map with the new array of students
      await updateDoc(userDocRef, {
        [`classes.${className}`]: studentsArray
      });
  
      // Now, find and update the student's document with the new course
      const studentsQuery = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(studentsQuery);
  
      if (!querySnapshot.empty) {
        const studentDocRef = querySnapshot.docs[0].ref; // Assuming email is unique, there should only be one document
        const courseName = `${userData.name}-${className}`; // Format: teacherName-courseName
  
        await updateDoc(studentDocRef, {
          courses: arrayUnion(courseName)
        });
      } else {
        console.log("Student not found");
        setToast({ message: "Student not found", color: Colors.toastError });
        return;
      }
  
      console.log("Student added to class successfully");
      setEmail("");
      setToast({ message: "Student added to class successfully", color: Colors.toastSuccess });
      fetchStudentData(); // Refresh to reflect the update
    } catch (err) {
      console.error("Transaction failed: ", err);
      setToast({ message: "Transaction failed", color: Colors.toastError });
    }
  };
  
  console.log("SD: "+ studentData.length);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.container}
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
        <Text style={styles.headerText}>Class: {className}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => setEmail(text)}
            
          /> 
          <TouchableOpacity
            style={styles.addButton}
            onPress={addStudentToClass}
          >
            <MaterialIcons name="add" size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>
 
      {studentData.length > 0 ? (
        studentData.map((student, index) => (
            <StudentProgress student={student} studentKey={student.id + index.toString()}/>
        ))
      ) : (
        <Text style={styles.text}>
          There are no students in this class yet.
        </Text>
      )}
      <CustomToast message={toast.message} color={toast.color} />
    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: Colors.background,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 4,
    color: Colors.textPrimary,
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
    backgroundColor: Colors.accent1,
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