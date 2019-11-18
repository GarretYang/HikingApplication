//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Image, FlatList, Text, View, List, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import firebase from 'react-native-firebase';
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';

export default class WelcomePage extends React.Component {
  constructor(props){
    super(props);
    this.state ={
        reports: null
    }
    this.signOut = this.signOut.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
  }

  componentDidMount(){
    // console.log(this.state.feature)
    return fetch(encodeURI('https://aptproject-255903.appspot.com/personalReports?name=' + this.props.navigation.getParam('user', '').user.name
    + '\&email=' + this.props.navigation.getParam('user', '').user.email))
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({ reports: responseJson})
      })
      .catch((error) =>{
        console.error(error);
      });
  }
  
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

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          paddingVertical: 2
        }}
      />
    );
  };

  render() {
    const { navigation } = this.props;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>
        Welcome {navigation.getParam('user', '').user.name}!</Text>
        <Text style={{ marginTop: 10, fontSize: 20 }}>Your reports:</Text>
        <FlatList
          data={this.state.reports}
          renderItem={({item}) =>
             <View style={{flex:1, flexDirection: 'column'}}>
               <Text>Theme: {item.feature_name} </Text>
               <Text>Date: {item.date_in} </Text>
               <Text>Description: {item.description} </Text>
               {/* <Text>Location: {item.location} </Text> */}

               <Image source = {{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.photos[0].$oid}} style={{width: 150, height: 100}} />
               <Text>  </Text>

             </View>}
          keyExtractor={({id}, index) => id}
          ItemSeparatorComponent={this.renderSeparator}
        />
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