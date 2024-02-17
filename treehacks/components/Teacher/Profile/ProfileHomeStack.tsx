import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from '../../../constants/Colors';
import { ProfileHome } from './ProfileHome';

const Stack = createStackNavigator();

export const ProfileHomeStack = () => {
  return (
    <Stack.Navigator
        initialRouteName="ProfileHome"
        screenOptions={{
            gestureEnabled: true,
            gestureDirection: "horizontal",
            headerShown: true,
            headerTintColor: "#fff",
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: Colors.primary },
          }}>
      <Stack.Screen name="ProfileHome" component={ProfileHome} />
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

