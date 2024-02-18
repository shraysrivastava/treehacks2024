import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { db } from '../../firebase/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { StudentData } from '../../constants/types';
import { Colors } from '../../constants/Colors';

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
    )
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <ScrollView style={styles.listContainer}>
        {students.map((student:StudentData, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.name}>{student.name}</Text>
            <Text style={styles.points}>{student.points} points</Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
  },
  name: {
    flex: 1,
    fontSize: 18,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
