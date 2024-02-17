import React from "react";
import { View, Text, StyleSheet } from "react-native";
<<<<<<< HEAD
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { TeacherHome } from "./TeacherHome";
import { Colors } from "../../../constants/Colors";
import { ShowStudents } from "./ShowStudents";
import { CreateCourse } from "./CreateCourse";

// Define types for navigation parameters
type TeacherHomeStackParamsList = {
  Home: undefined;
  "Manage Students": undefined;
  CreateCourse: { coursePath: string };
};

// Define props type for navigation
export type TeacherHomeNavigationProps =
  StackNavigationProp<TeacherHomeStackParamsList>;

const Stack = createStackNavigator<TeacherHomeStackParamsList>();

export const TeacherHomeStack: React.FC = () => {
=======
import { createStackNavigator } from "@react-navigation/stack";
import { TeacherHome } from "./TeacherHome";
import { Colors } from "../../../constants/Colors";

const Stack = createStackNavigator();

export const TeacherHomeStack = () => {
  
>>>>>>> b7b8011 (Cat generator)
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
<<<<<<< HEAD
<<<<<<< HEAD
      <Stack.Screen name="Home" component={TeacherHome} />
      <Stack.Screen name="Manage Students" component={ShowStudents} />
      <Stack.Screen name="CreateCourse" component={CreateCourse} />
=======
      <Stack.Screen name="TeacherHome" component={TeacherHome} />
>>>>>>> 2142e63 (Cat generator)
=======
      <Stack.Screen name="TeacherHome" component={TeacherHome} />
>>>>>>> b7b8011 (Cat generator)
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
