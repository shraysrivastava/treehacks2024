import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView, RefreshControl } from "react-native";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { CreateClass } from "./CreateClass";
import { ShowClasses } from "./ShowClasses";
import { TeacherData } from "../../../constants/types";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/Colors";

export const TeacherHome: React.FC = () => {
  const navigation = useNavigation();
  const [teacherData, setTeacherData] = useState<TeacherData | undefined>(undefined);
  const [createClassPopup, setCreateClassPopup] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [classesArray, setClassesArray] = useState<[string, string[]][]>([]);
  
  

  const fetchTeacherData = async () => {
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Cast the document data to TeacherData
        setTeacherData(docSnap.data() as TeacherData);
      } else {
        console.log("No such document!");
      }
    }
  };
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeacherData().then(() => setRefreshing(false));
  }, [fetchTeacherData]);
  
  useEffect(() => {
    

    fetchTeacherData();
    if (teacherData) {
    setClassesArray(Object.entries(teacherData.classes));
    }
  }, []);

const updateClass = async (className: string) => {
  const db = getFirestore();
  const user = auth.currentUser;

  if (user) {
    const userDocRef = doc(db, "users", user.uid);

    try {
      // First, get the current document to update the classes object correctly
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const updatedClasses = {
          ...userData.classes,
          [className]: [] // Assuming you want to initialize an empty array of students for the new class
        };

        await updateDoc(userDocRef, {
          classes: updatedClasses
        });

        console.log("Class added successfully");
        // Fetch updated data after adding the class
        // Make sure you have a function fetchTeacherData() that updates your component's state
        // fetchTeacherData(); Uncomment or modify this line according to your actual implementation
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error adding class: ", error);
    }
  } else {
    console.log("No user logged in");
  }
};

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]} // for Android
          tintColor={Colors.primary} // Color for the spinner (iOS)
          progressBackgroundColor="#ffffff"
        />
      }
    >
      {
  teacherData && classesArray.length > 0 ? (
    <ShowClasses teacherData={teacherData} navigation={navigation} />
  ) : (
    <Text>You don't have any classes yet. Would you like to create one?</Text>
  )
}

      <Button title="Create Class" onPress={() => setCreateClassPopup(true)} />
      <CreateClass isVisible={createClassPopup} onCancel={() => setCreateClassPopup(false)} onConfirm={updateClass} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
});
