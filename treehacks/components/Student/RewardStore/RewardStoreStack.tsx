import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { Colors } from '../../../constants/Colors';
import { RewardStoreHome } from './RewardStore';

const Stack = createStackNavigator();

export const RewardStoreStack = () => {
    return (
        <Stack.Navigator
                initialRouteName="RewardStoreHome"
                screenOptions={{
                        gestureEnabled: true,
                        gestureDirection: "horizontal",
                        headerShown: true,
                        headerTintColor: "#fff",
                        headerBackTitleVisible: false,
                        headerStyle: { backgroundColor: Colors.primary },
                    }}>
            <Stack.Screen name="RewardStoreHome" component={RewardStoreHome} />
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
