import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';


export interface ToastProps {
    message: string;
    color: string;
};

const CustomToast: React.FC<ToastProps> = ({ message, color }) => {
  const [isVisible, setIsVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message && message !== "") {  // Check if message is not empty
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
      setIsVisible(false);  // Hide the toast if message is empty
    }
  }, [message]);

  const closeToast = () => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setIsVisible(false));
  };

  if (!isVisible || message === "") return null;  // Do not render if message is empty

  return (
      <Animated.View style={[styles.toast, { opacity, backgroundColor: color }]}>
        <TouchableOpacity onPress={closeToast} style={{width: '100%'}}>
          <Text style={[styles.text, { color: 'white' }]}>{message}</Text>
        </TouchableOpacity>
      </Animated.View>
  );
};

  

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontSize: 12, 
    fontWeight: 'bold', 
  },
  
});


export default CustomToast;
