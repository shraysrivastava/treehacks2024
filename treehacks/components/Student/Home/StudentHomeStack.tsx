import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { StudentHome } from "./StudentHome";
import { Colors } from "../../../constants/Colors";
import { Mathematics } from "./Subjects/Mathematics";
import { Science } from "./Subjects/Science";
import { History } from "./Subjects/History";
import { Physics } from "./Subjects/Physics";

const Stack = createStackNavigator();

export const StudentHomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="StudentHome"
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        headerShown: true,
        headerTintColor: "#fff",
        headerBackTitleVisible: false,
        headerStyle: { backgroundColor: Colors.primary },
        headerTitleStyle: { fontWeight: "bold", color: Colors.background },
      }}
    >
      <Stack.Screen name="Dashboard " component={StudentHome} />
      <Stack.Screen name="Mathematics" component={Mathematics} />
      <Stack.Screen name="Science" component={Science} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Physics" component={Physics} />
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
