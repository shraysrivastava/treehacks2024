import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import React from "react";
import { Colors } from "../constants/Colors";

interface SkipProps {
  onPress: () => void;
}

const Skip: React.FC<SkipProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.text}>Skip Question</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    marginRight: 5,
    fontSize: 18,
    marginTop: 40,
    color: Colors.accent2, 
    textDecorationLine: 'underline', 
  },
});


export default Skip;
