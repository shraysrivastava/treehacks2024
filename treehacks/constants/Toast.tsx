import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "./Colors";

export interface ToastProps {
  message: string;
  color: string;
}

const CustomToast: React.FC<ToastProps> = ({ message, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message && message !== "") {
      // Check if message is not empty
      setIsVisible(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setIsVisible(false));
      }, 2500);

      return () => clearTimeout(timeout);
    } else {
      setIsVisible(true); // Hide the toast if message is empty
    }
  }, [message]);

  const closeToast = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setIsVisible(false));
  };

  if (!isVisible || message === "") return null; // Do not render if message is empty

  const iconName = color === Colors.toastSuccess ? 'check-circle' : 'error';
  const iconColor = color;

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <View style={styles.content}>
        <MaterialIcons name={iconName} size={32} color={iconColor} />
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 10, // Adjust based on your app's layout
    left: '50%',
    transform: [{ translateX: -150 }], // Adjust based on the toast width to center it
    width: 300, // Adjust as needed
    padding: 12,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 10,
    color: 'black', // For better contrast on a white background
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomToast;
