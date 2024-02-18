import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  RefreshControl,
} from "react-native";
import { db } from "../../../firebase/firebase";
import {
  DocumentData,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { RouteProp } from "@react-navigation/native";
import CustomToast, { ToastProps } from "../../../constants/Toast";
import { Colors } from "../../../constants/Colors";

interface Question {
  question: string;
  answer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
}
interface CreateClassProps {
  route: RouteProp<{ params: { coursePath: string } }, "params">;
}

export const CreateCourse: React.FC<CreateClassProps> = ({ route }) => {
  const { coursePath } = route.params;
  const [courseName, setCourseName] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [wrongAnswer1, setWrongAnswer1] = useState<string>("");
  const [wrongAnswer2, setWrongAnswer2] = useState<string>("");
  const [wrongAnswer3, setWrongAnswer3] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question,
      answer,
      wrongAnswer1,
      wrongAnswer2,
      wrongAnswer3,
    };
    setQuestions([...questions, newQuestion]);
    // Clear fields after adding question
    setQuestion("");
    setAnswer("");
    setWrongAnswer1("");
    setWrongAnswer2("");
    setWrongAnswer3("");
  };

  const handleCreateCourse = async () => {
    try {
      const courseData = {
        courseName,
        coursePath,
        questions,
      };
      const docRef = doc(db, "courses", coursePath);
      console.log("Document written with ID: ", docRef.id);
      setToast({ message: courseName + " course created", color: Colors.toastSuccess });
      await setDoc(docRef, { courseData });
      // Clear fields after creating course
      setCourseName("");
      setQuestions([]);
    } catch (error) {
      setToast({ message: "Error creating course", color: Colors.toastError });
      console.error("Error adding document: ", error);
    }
  };

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

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView >
        {/* Course Name */}
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Course Name:</Text>
          <TextInput
            value={courseName}
            onChangeText={setCourseName}
            style={styles.input}
          />
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Question:</Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            style={styles.input}
          />
        </View>

        {/* Answer and Wrong Answers */}
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Answer:</Text>
          <TextInput
            value={answer}
            onChangeText={setAnswer}
            style={styles.input}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Wrong Answer 1:</Text>
          <TextInput
            value={wrongAnswer1}
            onChangeText={setWrongAnswer1}
            style={styles.input}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Wrong Answer 2:</Text>
          <TextInput
            value={wrongAnswer2}
            onChangeText={setWrongAnswer2}
            style={styles.input}
          />
        </View>
        <View style={styles.questionContainer}>
          <Text style={styles.label}>Wrong Answer 3:</Text>
          <TextInput
            value={wrongAnswer3}
            onChangeText={setWrongAnswer3}
            style={styles.input}
          />
        </View>

        {/* Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
          <Text style={styles.buttonText}>Add Question</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
          <Text style={styles.buttonText}>Create Course</Text>
        </TouchableOpacity>

        {/* Toast Message */}
        
      </ScrollView>
      <CustomToast message={toast.message} color={toast.color} />
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  questionContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.secondary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "white",
    color: Colors.secondary,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
});


export default CreateCourse;
