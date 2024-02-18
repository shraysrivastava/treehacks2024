import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from "react-native";
import React from "react";

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
    fontSize:20,
    marginTop:40
  },

});

export default Skip;
