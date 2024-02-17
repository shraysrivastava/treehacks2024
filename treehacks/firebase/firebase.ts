// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initializeAuth} from 'firebase/auth';
// import {getReactNativePersistence} from 'firebase/auth/react-native';
import { getFirestore } from "firebase/firestore";

// , { persistence: getReactNativePersistence(AsyncStorage)
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);
export const db = getFirestore(app);