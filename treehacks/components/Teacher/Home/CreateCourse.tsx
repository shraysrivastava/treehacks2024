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
      await setDoc(docRef, { courseData });
      // Clear fields after creating course
      setCourseName("");
      setQuestions([]);
    } catch (error) {
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
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //     colors={[Colors.secondary]}
        //     tintColor={Colors.secondary}
        //     progressBackgroundColor="#ffffff"
        //   />
        // }
      >
        
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Course Name:</Text>
        <TextInput
          value={courseName}
          onChangeText={setCourseName}
          style={styles.input}
        />
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.label}>Question:</Text>
        <TextInput
          value={question}
          onChangeText={setQuestion}
          style={styles.input}
        />
      </View>
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
      <TouchableOpacity style={styles.button} onPress={handleAddQuestion}>
        <Text style={styles.buttonText}>Add Question</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
        <Text style={styles.buttonText}>Create Course</Text>
      </TouchableOpacity>
      <CustomToast message={toast.message} color={toast.message} />
      </ScrollView>
      </KeyboardAvoidingView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default CreateCourse;
