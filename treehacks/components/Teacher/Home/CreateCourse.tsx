import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "../../../firebase/firebase";

export const CreateCourse = () => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer3, setWrongAnswer3] = useState("");

  const handleSubmit = async () => {
    try {
      const db = getFirestore();
      const coursesRef = collection(db, "courses");
      await addDoc(coursesRef, {
        question,
        correctAnswer,
        wrongAnswers: [wrongAnswer1, wrongAnswer2, wrongAnswer3],
      });
      // Clear form fields after submission
      setQuestion("");
      setCorrectAnswer("");
      setWrongAnswer1("");
      setWrongAnswer2("");
      setWrongAnswer3("");
      alert("Course created successfully!");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Question</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Enter your question"
      />
      <Text style={styles.label}>Correct Answer</Text>
      <TextInput
        style={styles.input}
        value={correctAnswer}
        onChangeText={setCorrectAnswer}
        placeholder="Enter the correct answer"
      />
      <Text style={styles.label}>Wrong Answer 1</Text>
      <TextInput
        style={styles.input}
        value={wrongAnswer1}
        onChangeText={setWrongAnswer1}
        placeholder="Enter a wrong answer"
      />
      <Text style={styles.label}>Wrong Answer 2</Text>
      <TextInput
        style={styles.input}
        value={wrongAnswer2}
        onChangeText={setWrongAnswer2}
        placeholder="Enter another wrong answer"
      />
      <Text style={styles.label}>Wrong Answer 3</Text>
      <TextInput
        style={styles.input}
        value={wrongAnswer3}
        onChangeText={setWrongAnswer3}
        placeholder="Enter another wrong answer"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Course</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
