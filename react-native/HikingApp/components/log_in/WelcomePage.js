//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import firebase from 'react-native-firebase';

export default class WelcomePage extends React.Component {
  //Home Screen to show in Home Option
  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>
        Welcome {navigation.getParam('user', '').user.displayName}!</Text>
        <Button
          title="Sign out"
          onPress={() => {
            firebase.auth().signOut();
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