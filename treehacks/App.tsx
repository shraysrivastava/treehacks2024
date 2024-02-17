import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { StudentNav } from './components/Student/StudentNav';
import { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from "firebase/auth";
import { DocumentData } from 'firebase/firestore';
import { auth } from './firebase/firebase';
import { Auth } from './components/Auth/Auth';
import { fetchUserData } from './firebase/firestore';
import { TeacherNav } from './components/Teacher/TeacherNav';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [user, setUser] = useState<User>();
  const [userData, setUserData] = useState<DocumentData>();

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        // Optionally, fetch user data here if needed
      }
    };
  
    checkUser();
  }, []);
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } else {
      await AsyncStorage.removeItem('user');
      setUser(undefined);
    }
  });
  if (user === undefined) {
    return (
      <View style={styles.container}>
        <Auth />
      </View>
    );
  } else {
    if (userData === undefined) {
      fetchUserData(user, setUserData);
      console.log(userData);
      return (
        <View style={styles.container}>
          <Text>Loading</Text>
        </View>
      )
    } else if (userData.accountType == undefined) {
      return (
        <View style={styles.container}>
          <Text>User has no type.</Text>
        </View>
      );
      
    } 
    else if (userData.accountType == "Teacher") {
      return <TeacherNav/>
    }else if (userData.accountType == "Student") {
      return <StudentNav />
    } 
    else {
      return (
        <View style={styles.container}>
          <Text>Navigation not setup yet for {userData.type}</Text>
        </View>
      );
    }
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
