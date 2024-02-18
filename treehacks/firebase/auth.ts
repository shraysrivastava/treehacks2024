import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { FirebaseError } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import queryString from 'query-string';
import { crossmintAPIKey } from "./api";
import { createWallet } from "../crossmint/crossmint";

export type SignUpProps = {
  name: string;
  email: string;
  password: string;
  accountType: string;
  gradeLevel: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export const signUpUser = ({
  name,
  email,
  password,
  accountType,
  gradeLevel,
  setError,
}: SignUpProps) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      updateProfile(user, {
        displayName: name,
      }).catch((error: FirebaseError) => authError(error, setError));

      createWallet(email);
      if (accountType === "Teacher") {
        setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          accountType: accountType,
          classes: [],
          crossmint: true,
        }).catch((error: FirebaseError) => authError(error, setError));
      } else if (accountType === "Student") {
        setDoc(doc(db, "users", userCredential.user.uid), {
          id: userCredential.user.uid,
          name: name,
          email: email,
          accountType: accountType,
          classes: [],
          points: 0,
          subjectPoints: {
            mathPoints: 0,
            sciencePoints: 0,
            historyPoints: 0,
          },
          gradeLevel: gradeLevel,
          crossmint: true,
        }).catch((error: FirebaseError) => authError(error, setError));
        
      }
    })
    .catch((error: FirebaseError) => authError(error, setError));
};

export const signInUser = (
  email: string,
  password: string,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  signInWithEmailAndPassword(auth, email, password).catch(
    (error: FirebaseError) => authError(error, setError)
  );
};

export const signOutUser = (
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  AsyncStorage.removeItem("user");
  signOut(auth).catch((error: FirebaseError) => authError(error, setError));
};

const authError = (
  error: FirebaseError,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const errorCode: string = error.code;
  setError(errorCode.split("/")[1].replace(/-/g, " "));

};



