import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { signOutUser } from "../../../firebase/auth";

export const ProfileHome = () => {
  const [error, setError] = useState('');
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Profile Home</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={() => signOutUser(setError)}>
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
});
