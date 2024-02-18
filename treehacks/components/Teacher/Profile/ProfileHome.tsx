import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image
} from "react-native";
import { signOutUser } from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { Colors } from "../../../constants/Colors";

export const ProfileHome = () => {
  const [error, setError] = useState("");
  const [studentData, setStudentData] = useState<DocumentData>();

  useEffect(() => {
    const fetchStudentData = async () => {
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchStudentData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom: 10}}>
      <Image 
          source={require('../../../assets/logo.png')} 
          style={styles.logo} 
        />
    </View>
      {studentData && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{studentData.name}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{studentData.email}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Account Type:</Text>
            <Text style={styles.value}>{studentData.accountType}</Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => signOutUser(setError)}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
    paddingVertical: 20,
  },
  logo: {
    width: 200, 
    height: 200, 
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 30,
  },
  userInfoContainer: {
    width: "90%",
    backgroundColor: Colors.lightgray,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    color: Colors.textPrimary,
  },
  value: {
    fontSize: 16,
    color: Colors.primary,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.accent2,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
