//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import firebase from 'react-native-firebase';

export default class LogInPage extends React.Component {
  //Home Screen to show in Home Option
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', errorMessage: null};
    this.onLoginOrRegister = this.onLoginOrRegister.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", (e) => console.log(e));
  }

  onLoginOrRegister() {
    // GoogleSignin.signIn()
    //   .then((data) => {
    //     // Create a new Firebase credential with the token
    //     const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
    //     return firebase.auth().signInWithCredential(credential);
    //   })
    //   .then((user) => {
    //     // Do something with the signin user info
    //     alert(user.user.displayName);
    //   })
    //   .catch((error) => {
    //     const { code, message } = error;
    //   });
    // alert(this.state.email);
    // alert(this.state.email);
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        console.log('Successfully log in!');
        this.props.navigation.navigate('Welcome', {
          user: user
        })
      })
      .catch((error) => {
        alert(error);
      });
  }


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>Log In</Text>
        {this.state.errorMessage &&
          <Text style={{ color: 'red' }}>
            {this.state.errorMessage}
          </Text>}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={email => this.setState({ email: email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          style={styles.textInput}
          onChangeText={password => this.setState({ password: password })}
          value={this.state.password}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={this.onLoginOrRegister}
            title="Press me for Login"
          />
        </View>
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