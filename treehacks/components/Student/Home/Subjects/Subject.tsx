import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export type SubjectProps = {
  subjectName: string;
  gradeLevel: string;
  subjectColor: string;
  navigation?: any;
  icon: any;
};

const Subject = ({
  subjectName,
  gradeLevel,
  subjectColor,
  navigation,
  icon
}: SubjectProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: subjectColor }]}
      onPress={() => navigation.navigate(subjectName)}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={40} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.subjectText}>{subjectName}</Text>
        <Text style={styles.gradeText}>Grade: {gradeLevel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: '95%',
    alignSelf: 'center',
    height: 120,
    borderRadius: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  iconContainer: {
    marginLeft: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  subjectText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  gradeText: {
    color: "white",
    fontSize: 18,
    marginTop: 5,
  },
});

export default Subject;
