import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { StudentHome } from './StudentHome';
import { Colors } from '../../../constants/Colors';

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
            headerStyle: { backgroundColor: Colors.secondary },
          }}>
      <Stack.Screen name="StudentHome" component={StudentHome} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

