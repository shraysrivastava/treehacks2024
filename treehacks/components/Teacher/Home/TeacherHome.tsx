import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView, RefreshControl } from "react-native";
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, db } from "../../../firebase/firebase";
import { CreateClass } from "./CreateClass";
import { ShowClasses } from "./ShowClasses";
import { TeacherData } from "../../../constants/types";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/Colors";
import CustomToast, { ToastProps } from "../../../constants/Toast";

export const TeacherHome: React.FC = () => {
  const navigation = useNavigation();
  const [teacherData, setTeacherData] = useState<TeacherData | undefined>(undefined);
  const [createClassPopup, setCreateClassPopup] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [classesArray, setClassesArray] = useState<[string, string[]][]>([]);
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
  }, []);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeacherData().then(() => setRefreshing(false));
  }, [fetchTeacherData]);
  
  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]); // Fetch teacher data
  
  useEffect(() => {
    if (teacherData) {
      setClassesArray(Object.entries(teacherData.classes));
    }
  }, [teacherData]); // Update classesArray when teacherData changes
  

  const updateClass = async (className: string) => { 
    const user = auth.currentUser;
  
    if (!user) {
      setToast({ message: "No user logged in", color: "red" });
      console.log("No user logged in");
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid);
  
    try {
      const docSnap = await getDoc(userDocRef);
  
      if (!docSnap.exists()) {
        setToast({ message: "Document does not exist", color: "red" });
        console.log("Document does not exist");
        return;
      }
  
      const userData = docSnap.data();
      const updatedClasses = {
        ...userData.classes,
        [className]: [] 
      };
  
      await updateDoc(userDocRef, {
        classes: updatedClasses
      });

      setToast({ message: "Class created successfully", color: "green" });
  
    } catch (error) {
      setToast({ message: "Error adding class", color: "red" });
      console.error("Error adding class: ", error);
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
      <CustomToast message={toast.message} color={toast.color}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightblue",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
 },
});
