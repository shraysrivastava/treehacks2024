import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

export const ProfileHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Profile Home </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
 },
});
