//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import firebase from 'react-native-firebase';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

export default class WelcomePage extends React.Component {
  //Home Screen to show in Home Option
  signOut = async () => {
    console.log("Start signing out!");
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('Successfully sign out!');
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>
        Welcome {navigation.getParam('user', '').user.name}!</Text>
        <Button
          title="Sign out"
          onPress={() => {
            // firebase.auth().signOut();
            this.signOut();
            this.props.navigation.navigate('Login');
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
});