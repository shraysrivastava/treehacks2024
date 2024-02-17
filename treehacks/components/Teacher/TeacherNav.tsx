import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { TeacherHome } from "./Home/TeacherHome";
import { Colors } from "../../constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";

import React from "react";
import { TeacherHomeStack } from "./Home/TeacherHomeStack";
import { ProfileHomeStack } from "./Profile/ProfileHomeStack";

const Tab = createBottomTabNavigator();

export const TeacherNav = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: Colors.secondary,
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          tabBarStyle: {
            backgroundColor: Colors.background,
            borderTopColor: Colors.secondary,
            borderTopWidth: 2,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen
          name="Teacher"
          component={TeacherHomeStack}
          options={({}) => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star" color={color} size={size} />
            ),
          })}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileHomeStack}
          options={() => ({
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="star" color={color} size={size} />
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
