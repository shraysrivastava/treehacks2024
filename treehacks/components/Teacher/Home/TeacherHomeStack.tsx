import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { TeacherHome } from "./TeacherHome";
import { Colors } from "../../../constants/Colors";
import { ShowStudents } from "./ShowStudents";

const Stack = createStackNavigator();

export const TeacherHomeStack = () => {
  
  return (
    <Stack.Navigator
      initialRouteName="TeacherHome"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: true,
        headerTintColor: "#fff",
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: Colors.secondary },
      }}
    >
      <Stack.Screen name="TeacherHome" component={TeacherHome} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
