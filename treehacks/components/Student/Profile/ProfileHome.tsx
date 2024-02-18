import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { signOutUser } from "../../../firebase/auth";
import { auth } from "../../../firebase/firebase";
import {
  DocumentData,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";

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
      <Text style={styles.text}>Profile Home</Text>
      {studentData && (
        <View style={styles.userInfoContainer}>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{studentData.name}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{studentData.email}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Account Type:</Text>
            <Text style={styles.value}>{studentData.accountType}</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.label}>Points:</Text>
            <Text style={styles.value}>
              {studentData?.points ? studentData.points : 0}
            </Text>
          </View>
          {studentData.wallet && (
            <Image
              source={{ uri: studentData.wallet[0].imageUrl}}
              style={styles.walletImage}
            />
          )}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light grey background
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Darker text color for better readability
    marginBottom: 20, // Adds some space before the logout button
  },
  userInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
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
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ff4757", // A red color for the logout button
    borderRadius: 20, // Rounded corners for the button
    borderWidth: 1,
    borderColor: "#ff6b81", // Slightly lighter red for the border
    elevation: 2, // Adds a slight shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutButtonText: {
    color: "#fff", // White text color
    fontSize: 16,
    fontWeight: "bold",
  },
  walletImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    resizeMode: "contain",
  },
});
