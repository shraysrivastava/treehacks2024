import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, db } from '../../../firebase/firebase';
import { Colors } from '../../../constants/Colors';
import CustomToast, { ToastProps } from '../../../constants/Toast';
import { StudentProgress } from './StudentProgressModals';
import { useNavigation } from '@react-navigation/native';
import { TeacherData, StudentData } from '../../../constants/types';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';

interface ShowStudentsProps {
  route: {
    params: {
      className: string;
    };
  };
}

export const ShowStudents: React.FC<ShowStudentsProps> = ({ route }) => {
  const { className } = route.params;
  const [teacherData, setTeacherData] = useState<TeacherData>();
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState<ToastProps>({ message: '', color: '' });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();
  const [coursePath, setCoursePath] = useState<String>('');

  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (!user) {
        setToast({ message: 'Authentication required', color: Colors.toastError });
        return;
      }
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        setToast({ message: 'Teacher data not found', color: Colors.toastError });
        return;
      }
      setTeacherData(docSnap.data() as TeacherData);
    };

    fetchTeacherData();
    if (teacherData) setCoursePath(`${teacherData?.name}=${className}`);
  }, []);

  const fetchStudentData = useCallback(async () => {
    if (!teacherData) return;
    const studentEmails = teacherData.classes[className];
    if (!studentEmails || studentEmails.length === 0) return;
    const studentsQuery = query(collection(db, 'users'), where('email', 'in', studentEmails));
    const querySnapshot = await getDocs(studentsQuery);
    
    const fetchedStudents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as StudentData[];
    setStudentData(fetchedStudents);
  }, [className, teacherData]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudentData().finally(() => setRefreshing(false));
  }, [fetchStudentData]);

  useEffect(() => {
    if (toast.message !== '') {
      toastTimeoutRef.current = setTimeout(() => {
        setToast({ message: '', color: '' });
      }, 3000);
    }
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [toast.message]);

  const addStudentToClass = async () => {
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setToast({ message: 'Invalid email format', color: Colors.toastError });
      return;
    }
    if (!teacherData) {
      setToast({ message: 'Teacher data not found', color: Colors.toastError });
      return;
    }
    const studentsArray = teacherData.classes[className] || [];
    if (studentsArray.includes(email)) {
      setToast({ message: 'Student already in class', color: Colors.toastError });
      return;
    }
    studentsArray.push(email);
    const userDocRef = doc(db, 'users', auth.currentUser!.uid);
    await updateDoc(userDocRef, {
      [`classes.${className}`]: studentsArray,
    });
    const studentsQuery = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(studentsQuery);
    if (!querySnapshot.empty) {
      const studentDocRef = querySnapshot.docs[0].ref;
      const courseName = `${teacherData.name}=${className}`;
      await updateDoc(studentDocRef, {
        classes: arrayUnion(courseName),
      });
      setToast({ message: 'Student added to class successfully', color: Colors.toastSuccess });
      fetchStudentData();
    } else {
      setToast({ message: 'Student not found', color: Colors.toastError });
    }
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
            progressBackgroundColor="#fff"
          />
        }
      >
        <Text style={styles.headerText}>Class: {className}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="Student Email"
            placeholderTextColor={Colors.lightgray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.addButton} onPress={addStudentToClass}>
            <MaterialIcons name="add" size={24} color={Colors.background} />
          </TouchableOpacity>
        </View>
        {studentData.length > 0 ? (
          studentData.map((student, index) => (
            <StudentProgress
              key={student.id + index.toString()}
              student={student}
              studentKey={student.id}
            />
          ))
        ) : (
          <Text style={styles.text}>There are no students in this class yet.</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.createCourseButton}
        onPress={() => navigation.navigate('CreateCourse', { coursePath })}
      >
        <Text style={styles.createCourseButtonText}>Create Course</Text>
      </TouchableOpacity>
      <CustomToast message={toast.message} color={toast.color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  TextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightgray,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    backgroundColor: 'white',
    color: Colors.textPrimary,
  },
  addButton: {
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  createCourseButton: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: Platform.OS === 'ios' ? 20 : 15,
    alignItems: 'center',
  },
  createCourseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
