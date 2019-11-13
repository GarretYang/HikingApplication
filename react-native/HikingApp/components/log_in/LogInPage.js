//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import firebase from 'react-native-firebase';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';

export default class LogInPage extends React.Component {
  //Home Screen to show in Home Option
  constructor(props) {
    super(props);
    GoogleSignin.configure();
    this.state = { email: '', password: '', userInfo: null, errorMessage: null};
    this.onLoginOrRegister = this.onLoginOrRegister.bind(this);
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
  }

  componentDidMount() {
    this.props.navigation.addListener("willFocus", (e) => console.log(e));
  }

  onGoogleSignIn = async () => {
    console.log("Start Google account signing in");
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo });
      console.log('Successfully log in');
      console.log(this.state.userInfo);
      this.props.navigation.navigate('Welcome', {
        user: this.state.userInfo
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('Error: SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('Error: IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('Error: PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        console.log('Error');
      }
    }
  };

  onLoginOrRegister() {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 50, fontSize: 25 }}>Log In with Email</Text>
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
              title="Press me for Login with Email"
            />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ marginTop: 50, fontSize: 25 }}>Log In with Google Account</Text>
          <View style={styles.buttonContainer}>
            {/* <Button
              onPress={this.onGoogleSignIn}
              title="Press me for Login with Google Account"
            /> */}
            <GoogleSigninButton
              style={{ width: 192, height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={this.onGoogleSignIn}/>
          </View>
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