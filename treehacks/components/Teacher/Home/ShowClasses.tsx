import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { TeacherData } from "../../../constants/types";
import { Colors } from "../../../constants/Colors";
import { NavigationProp } from '@react-navigation/native';
import { MaterialIcons } from "@expo/vector-icons";

interface ShowClassesProps {
  teacherData: TeacherData;
  navigation: NavigationProp<any>;
}

export const ShowClasses: React.FC<ShowClassesProps> = ({ teacherData, navigation }) => {
  const classesArray = Object.entries(teacherData.classes);

  if (classesArray.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>You don't have any classes yet. Would you like to create one?</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Your Classes</Text>
      {classesArray.map(([className], index) => (
        <TouchableOpacity
          key={index}
          style={styles.classContainer}
          onPress={() => navigation.navigate("Manage Students", { className, teacherData })}
        >
          <Text style={styles.classText}>{className}</Text>
          <MaterialIcons name="navigate-next" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  classContainer: {
    backgroundColor: Colors.primary, // Consider using a lighter shade for better readability
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  classText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

