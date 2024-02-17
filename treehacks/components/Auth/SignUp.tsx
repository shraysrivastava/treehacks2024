<<<<<<< HEAD
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signUpUser } from "../../firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import DropDownPicker from "react-native-dropdown-picker";
import { Colors } from "../../constants/Colors";

type SignUpProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SignUp = (props: SignUpProps) => {
=======
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signUpUser } from '../../firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import {Colors} from '../../constants/Colors';

type SignUpProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>;
}


export const SignUp = (props: SignUpProps) => {


>>>>>>> b7b8011 (Cat generator)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userOpen, setuserOpen] = useState(false);
<<<<<<< HEAD
  const [accountType, setaccountType] = useState("");
=======
  const [userValue, setuserValue] = useState("");
>>>>>>> b7b8011 (Cat generator)
  const [user, setUser] = useState([
    { label: "Teacher", value: "Teacher" },
    { label: "Student", value: "Student" },
  ]);

<<<<<<< HEAD
  const [gradeOpen, setgradeOpen] = useState(false);
  const [gradeLevel, setgradeLevel] = useState("");
  const [userGrade, setUserGrade] = useState([
    { label: "First Grade", value: "1" },
    { label: "Second Grade", value: "2" },
    { label: "Third Grade", value: "3" },
    { label: "Fourth Grade", value: "4" },
    { label: "Fifth Grade", value: "5" },
  ]);
=======
>>>>>>> b7b8011 (Cat generator)

  const handleSignUp = () => {
    if (name === "") {
      setError("name cannot be empty");
    } else if (password !== confirmPassword) {
      setError("passwords do not match");
    } else if (username === "") {
      setError("username cannot be empty");
<<<<<<< HEAD
    } else if (accountType === "") {
      //error check that user type is not empty
      setError("Please select account type");
    } else if (gradeLevel === "") {
      setError("Please select a grade level");
    } else {
      signUpUser({
        name,
<<<<<<< HEAD
=======
        username,
>>>>>>> 5202e20 (Fix all rebase errors)
        email,
        password,
        accountType,
        gradeLevel,
        setError,
      });
    }
  };
=======
    } else if (userValue === "") {
      //error check that user type is not empty
      setError("Please select user type")
    }
    else {
      signUpUser(name, username, email, password, userValue, setError);
    }
  }

>>>>>>> b7b8011 (Cat generator)

  return (
    <SafeAreaView style={styles.parentContainer}>
      <Text style={styles.signUpText}>Welcome!</Text>
      <TextInput
        style={styles.TextInput}
        value={name}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.TextInput}
        value={username}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.TextInput}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
<<<<<<< HEAD
        keyboardType="email-address"
=======
        keyboardType='email-address'
>>>>>>> b7b8011 (Cat generator)
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.TextInput}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TextInput
        style={styles.TextInput}
        value={confirmPassword}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      {/* dropdown picker to select user type */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={userOpen}
<<<<<<< HEAD
          value={accountType} //userValue
          items={user}
          style={styles.dropdown}
          setOpen={setuserOpen}
          setValue={setaccountType}
=======
          value={userValue} //userValue
          items={user}
          style={styles.dropdown}
          setOpen={setuserOpen}
          setValue={setuserValue}
>>>>>>> b7b8011 (Cat generator)
          setItems={setUser}
          placeholder="Select User Type"
          activityIndicatorColor="#5188E3"
        />
      </View>
<<<<<<< HEAD
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={gradeOpen}
          value={gradeLevel} //userValue
          items={userGrade}
          style={styles.dropdown}
          setOpen={setgradeOpen}
          setValue={setgradeLevel}
          setItems={setUserGrade}
          placeholder="Select Grade Level"
          activityIndicatorColor="#5188E3"
        />
      </View>
      <TouchableOpacity style={styles.Button} onPress={handleSignUp}>
        <Text style={styles.ButtonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={{color: Colors.textPrimary}}> Have an account? </Text>
        <Text
          style={styles.changeText}
          onPress={(event) => {
            props.setHasAccount(true);
          }}
        >
=======
      <TouchableOpacity
        style={styles.Button}
        onPress={handleSignUp}>
        <Text
          style={styles.ButtonText}>
          Sign Up
        </Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text> Have an account? </Text>
        <Text
          style={styles.changeText}
          onPress={(event) => { props.setHasAccount(true); }}>
>>>>>>> b7b8011 (Cat generator)
          Sign In
        </Text>
      </View>
      <Text style={styles.ErrorText}>{error}</Text>
    </SafeAreaView>
  );
};

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
=======

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
>>>>>>> b7b8011 (Cat generator)
    // justifyContent: 'center',
    margin: 5,
  },
  logo: {
    width: 400,
    height: 150,
    marginLeft: 30,
  },
  dropdownContainer: {
    // flexDirection: '',
<<<<<<< HEAD
    justifyContent: "center",
=======
    justifyContent: 'center',
>>>>>>> b7b8011 (Cat generator)
    marginBottom: 30,
    marginRight: 75,
    marginLeft: 75,
    // rightMargin: 7,
    // endWidth: 1000,
  },
  parentContainer: {
    flex: 1,
<<<<<<< HEAD
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
=======
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
>>>>>>> b7b8011 (Cat generator)
    backgroundColor: Colors.background,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 27,
<<<<<<< HEAD
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  changeText: {
    color: Colors.accent1,
=======
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  changeText: {
    color: "blue",
>>>>>>> b7b8011 (Cat generator)
    // marginLeft: 70,
  },
  TextInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: "lightgray",
    backgroundColor: "white",
=======
    borderColor: 'lightgray',
    backgroundColor: 'white',
>>>>>>> b7b8011 (Cat generator)
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  Button: {
    width: 250,
    margin: 5,
    marginTop: 10,
    padding: 10,
<<<<<<< HEAD
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  ButtonText: {
    color: "white",
  },
  ErrorText: {
    textAlign: "center",
    color: "red",
=======
    alignItems: 'center',
    backgroundColor: "purple",
    borderRadius: 10,
  },
  ButtonText: {
    color: 'white',
  },
  ErrorText: {
    textAlign: 'center',
    color: 'red',
>>>>>>> b7b8011 (Cat generator)
  },
  dropdown: {
    width: 250,
    height: 40,
    margin: 5,
    marginBottom: 100,
    borderRadius: 5,
    borderWidth: 1,
<<<<<<< HEAD
    borderColor: "lightgray",
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> 5202e20 (Fix all rebase errors)
=======
    borderColor: 'lightgray',
    
  },
});

>>>>>>> b7b8011 (Cat generator)
