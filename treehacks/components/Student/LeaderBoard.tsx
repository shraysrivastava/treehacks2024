import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { db } from '../../firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { StudentData } from '../../constants/types';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-svg-charts';

export const LeaderBoard = () => {
  const [students, setStudents] = useState<StudentData[]>();

  useEffect(() => {
    const fetchStudents = async () => {
      const q = query(collection(db, 'users'), where('accountType', '==', 'Student'), orderBy('points', 'desc'));
      const querySnapshot = await getDocs(q);
      const studentsData = querySnapshot.docs.map(doc => doc.data());
      setStudents(studentsData as StudentData[]);
    };

    fetchStudents();
  }, []);

  if (!students) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const pointsData = students.map(student => student.points);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Leaderboard 🏆</Text>
      <ScrollView style={styles.listContainer}>
        {students.map((student: StudentData, index) => (
          <Animated.View key={index} style={[styles.listItem, { opacity: 1 - index * 0.1 }]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.points}>{student.points} points</Text>
          </Animated.View>
        ))}
      </ScrollView>
      <Text style={styles.graphTitle}>Points Distribution 📊</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
  },
  listContainer: {
    width: '100%',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginRight: 10,
    color: Colors.secondary,
  },
  name: {
    flex: 1,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: Colors.primary,
  },
  chart: {
    height: 200,
    width: '100%',
    marginTop: 10,
  },
});
