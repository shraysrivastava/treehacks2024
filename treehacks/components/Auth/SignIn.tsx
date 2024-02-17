import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { signInUser } from '../../firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

type SignInProps = {
  setHasAccount: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SignIn = (props: SignInProps) => {  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <SafeAreaView style={styles.parentContainer}>

      <Text style={styles.signInText}>Welcome!</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType='email-address'
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity
        style={styles.Button}
        onPress={() => signInUser(email, password, setError)}>
          <Text
            style={styles.ButtonText}>
            Sign In
          </Text>
      </TouchableOpacity>
      <View style={styles.container}>
<<<<<<< HEAD
        <Text style={{color: Colors.textPrimary}}>Don't have an account? </Text>
=======
        <Text>Don't have an account? </Text>
>>>>>>> b7b8011 (Cat generator)
        <Text
            style={styles.changeText} 
            onPress={(event) => {props.setHasAccount(false);}}>
            Sign Up
        </Text>
      </View>
      <Text style={styles.ErrorText}>{error}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 5,
  },
  parentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.background,
  },
  signInText: {
    fontSize: 27,
    fontWeight: 'bold',
<<<<<<< HEAD
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  changeText: {
    color: Colors.accent1,
=======
    color: 'black',
    marginBottom: 10,
  },
  changeText: {
    color: "blue",
>>>>>>> b7b8011 (Cat generator)
  },
  TextInput: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgray',
<<<<<<< HEAD
    backgroundColor: "white",
=======
    backgroundColor: 'white',
>>>>>>> b7b8011 (Cat generator)
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  Button: {
    width: 250,
    margin: 5,
    padding: 10,
    alignItems: 'center',
<<<<<<< HEAD
    backgroundColor: Colors.primary,
=======
    backgroundColor: "purple",
>>>>>>> b7b8011 (Cat generator)
    borderRadius: 10,
  },
  ButtonText: {
    color: 'white',
  },
  ErrorText: {
    textAlign: 'center',
    color: 'red',
  },
  // Add your image style here
  logo: {
    width: 400,
    height: 150,
    marginBottom: 20,
    marginLeft: 30,
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> b7b8011 (Cat generator)
