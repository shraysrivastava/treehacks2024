import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, SafeAreaView } from "react-native";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase";
import { CreateClass } from "./CreateClass";
import { ShowClasses } from "./ShowClasses";
import { TeacherData } from "../../../constants/types";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../../constants/Colors";
import CustomToast, { ToastProps } from "../../../constants/Toast";

export const TeacherHome: React.FC = () => {
  const navigation = useNavigation();
  const [teacherData, setTeacherData] = useState<TeacherData | undefined>(undefined);
  const [createClassPopup, setCreateClassPopup] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>({ message: "", color: "" });

  const fetchTeacherData = useCallback(async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTeacherData(docSnap.data() as TeacherData);
      } else {
        console.log("No such document!");
      }
    }
  }, []);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTeacherData().then(() => setRefreshing(false));
  }, [fetchTeacherData]);

  const updateClass = async (className: string) => { 
    const user = auth.currentUser;
    if (!user) {
      setToast({ message: "No user logged in", color: "red" });
      return;
    }
  
    const userDocRef = doc(db, "users", user.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        setToast({ message: "Document does not exist", color: "red" });
        return;
      }
  
      const userData = docSnap.data();
      const updatedClasses = { ...userData.classes, [className]: [] };
      await updateDoc(userDocRef, { classes: updatedClasses });
      setToast({ message: "Class created successfully", color: "green" });
      fetchTeacherData();
    } catch (error) {
      setToast({ message: "Error adding class", color: "red" });
      console.error("Error adding class: ", error);
    }
    setCreateClassPopup(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            progressBackgroundColor={Colors.background}  
          />
        }
      >
        {teacherData && teacherData.classes && Object.keys(teacherData.classes).length > 0 ? (
          <ShowClasses teacherData={teacherData} navigation={navigation} />
        ) : (
          <Text style={styles.noClassesText}>
            You don't have any classes yet. Would you like to create one?
          </Text> 
        )}
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => setCreateClassPopup(true)}>
        <Text style={styles.buttonText}>Create Class</Text>
      </TouchableOpacity>
       <CreateClass isVisible={createClassPopup} onCancel={() => setCreateClassPopup(false)} onConfirm={updateClass} />
      <CustomToast message={toast.message} color={toast.color}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  noClassesText: {
    color: Colors.textPrimary,
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignSelf: 'center',
    marginVertical: 10,
    width: '90%', // Ensure the button stretches to fit the container width
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TeacherHome;
