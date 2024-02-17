import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { FirebaseError } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const signUpUser = (name: string, username:string, email: string, password: string, accountType:string,  setError: React.Dispatch<React.SetStateAction<string>>) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: name,
            })
            .catch((error: FirebaseError) => authError(error, setError));

            //sets new user document in firestore
            const db = getFirestore();
            if (accountType === "Teacher") {
              setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                username: username,
                accountType: accountType,
                students: [],
                school: "",
              }).catch((error: FirebaseError) => authError(error, setError));
            } else if (accountType === "Student") {
            setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                username: username,
                accountType: accountType,
                class: "",
                points: 0,
              }).catch((error: FirebaseError) => authError(error, setError));
            }
        })
        .catch((error: FirebaseError) => authError(error, setError));
};


export const signInUser = (email: string, password: string, setError: React.Dispatch<React.SetStateAction<string>>) => {
    signInWithEmailAndPassword(auth, email, password).catch((error: FirebaseError) => authError(error, setError));
};

export const signOutUser = (setError: React.Dispatch<React.SetStateAction<string>>) => {
    AsyncStorage.removeItem('user');
    signOut(auth).catch((error: FirebaseError) => authError(error, setError));
};

const authError = (error: FirebaseError, setError: React.Dispatch<React.SetStateAction<string>>) => {
    const errorCode: string = error.code;
    setError(errorCode.split('/')[1].replace(/-/g, ' '));
};