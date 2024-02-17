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


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userOpen, setuserOpen] = useState(false);
  const [userValue, setuserValue] = useState("");
  const [user, setUser] = useState([
    { label: "Teacher", value: "Teacher" },
    { label: "Student", value: "Student" },
  ]);


  const handleSignUp = () => {
    if (name === "") {
      setError("name cannot be empty");
    } else if (password !== confirmPassword) {
      setError("passwords do not match");
    } else if (username === "") {
      setError("username cannot be empty");
    } else if (userValue === "") {
      //error check that user type is not empty
      setError("Please select user type")
    }
    else {
      signUpUser(name, username, email, password, userValue, setError);
    }
  }


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
        keyboardType='email-address'
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
          value={userValue} //userValue
          items={user}
          style={styles.dropdown}
          setOpen={setuserOpen}
          setValue={setuserValue}
          setItems={setUser}
          placeholder="Select User Type"
          activityIndicatorColor="#5188E3"
        />
      </View>
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
          Sign In
        </Text>
      </View>
      <Text style={styles.ErrorText}>{error}</Text>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
    justifyContent: 'center',
    marginBottom: 30,
    marginRight: 75,
    marginLeft: 75,
    // rightMargin: 7,
    // endWidth: 1000,
  },
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.background,
  },
  signUpText: {
    marginTop: 20,
    fontSize: 27,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  changeText: {
    color: "blue",
    // marginLeft: 70,
  },
  TextInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
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
});
=======
    borderColor: 'lightgray',
    
  },
});

>>>>>>> b7b8011 (Cat generator)
