import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { StudentHome } from "./Home/StudentHome";
import { Colors } from "../../constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import React from "react";
import { StudentHomeStack } from "./Home/StudentHomeStack";
import { ProfileHomeStack } from "./Profile/ProfileHomeStack";
import { RewardStoreStack } from "./RewardStore/RewardStoreStack";

const Tab = createBottomTabNavigator();

export const StudentNav = () => {
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
            name="Student"
            component={StudentHomeStack}
            options={({}) => ({
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="home" color={color} size={size} />
              ),
            })}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileHomeStack}
            options={() => ({
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="account-circle" color={color} size={size} />
              ),
            })}
          />
          <Tab.Screen
            name="MyPrize"
            component={RewardStoreStack}
            options={() => ({
                tabBarIcon: ({ color, size }) => (
                    <MaterialIcons name="savings" color={color} size={size} />
              ),
            })}
          />

        </Tab.Navigator>
      </NavigationContainer>
    );
};