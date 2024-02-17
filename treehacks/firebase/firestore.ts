import { User } from "firebase/auth";
import { doc, getDoc, DocumentData} from "firebase/firestore";
import { db } from "./firebase";
import { FirebaseError } from "firebase/app";
import { SetStateAction } from "react";

/**
 * Gets the data associated with the user
 * @param user user to get data from
 * @returns user's document data (or null if doesn't exist)
 */
export const fetchUserData = (user: User, setUserData: {(value: SetStateAction<DocumentData | undefined>): void}) : void => {
    const userRef = doc(db, 'users', user.uid);
    getDoc(userRef).then((userData: DocumentData) => {
        setUserData(userData.data());
        console.log(userData.data());
    }).catch((error: FirebaseError) => {
        handleError(error);
    });
};

const handleError = (error: FirebaseError) => {
  const errorCode: string = error.code;
  const errorMessage = error.message;
  console.log(errorCode, errorMessage);
}