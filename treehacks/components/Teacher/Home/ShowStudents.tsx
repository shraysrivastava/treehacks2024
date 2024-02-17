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
    { params: { className: string; teacherData: TeacherData } },
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

  const fetchTeacherData = useCallback(async () => {
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Cast the document data to TeacherData
        // console.log("Document data:", docSnap.data());
        setTeacherData(docSnap.data() as TeacherData);
        
      } else {
        console.log("No such document!");
      }
    }
  }, [teacherData, className, studentData]);

  const fetchStudentData = useCallback(async () => {
    if (!teacherData) { return null;}
    const studentEmails = teacherData.classes[className];
    console.log(studentEmails);
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
        console.log("FS"+fetchedStudents.length);
        setStudentData(fetchedStudents);
      } catch (err) {
        console.error("Error fetching students: ", err);
      }
    }
  }, [className, studentData, teacherData]);
  
  


  useEffect(() => {
    const fetchData = async () => {
        await fetchTeacherData();
        await fetchStudentData();
    }
    fetchData()
    // console.log(studentData);
  }, []);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTeacherData();
    console.log("FTD: "+ teacherData?.classes["Grade 1"][0]);
    await fetchStudentData();
    console.log("FSD: "+ studentData.length);
    setRefreshing(false);
    
  }, [ refreshing, teacherData]);

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
  
      // Check if the document data has the classes map and the specific class
      const userData = docSnap.data();
      const classesMap = userData.classes || {};
      const studentsArray = classesMap[className] || [];
  
      // Check if the student is already in the class
      if (studentsArray.includes(email)) {
        console.log("Student already in class");
        setToast({ message: "Student already in class", color: Colors.toastError });
        return;
      }
  
      // Append the student's email to the array
      studentsArray.push(email);
  
      // Update the classes map with the new array of students
      await updateDoc(userDocRef, {
        [`classes.${className}`]: studentsArray // Use the dot notation to update a specific field within a map
      });
  
      console.log("Student added to class successfully");
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
          onChangeText={(text) => setEmail(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addStudentToClass}>
          <MaterialIcons name="add" size={24} color={Colors.background} />
        </TouchableOpacity>
      </View>

      {studentData.length > 0 ? (
        studentData.map((student, index) => (
            <StudentProgress student={student}/>
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