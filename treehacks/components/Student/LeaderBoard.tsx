import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { db } from "../../firebase/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { StudentData } from "../../constants/types";
import { Colors } from "../../constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { RefreshControl } from "react-native";

export const LeaderBoard = () => {
  const [students, setStudents] = useState<StudentData[]>();
  const [refreshing, setRefreshing] = useState(false);

  const fetchStudents = async () => {
    const q = query(
      collection(db, "users"),
      where("accountType", "==", "Student"),
      orderBy("points", "desc")
    );
    const querySnapshot = await getDocs(q);
    const studentsData = querySnapshot.docs.map((doc) => doc.data());
    setStudents(studentsData as StudentData[]);
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents().finally(() => setRefreshing(false));
  }, [fetchStudents]);

  if (!students) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const pointsData = students.map((student) => student.points);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard 🏆</Text>
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            progressBackgroundColor={Colors.primary}
          />
        }
      >
        {students.map((student: StudentData, index) => (
          <Animated.View key={index} style={[styles.listItem]}>
            <Text style={styles.rank}>{index + 1}.</Text>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.points}>{student.points} points</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.primary,
  },
  listContainer: {
    width: "100%",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    color: Colors.textPrimary,
  },
  name: {
    flex: 1,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: Colors.primary,
  },
  chart: {
    height: 200,
    width: "100%",
    marginTop: 10,
  },
});
