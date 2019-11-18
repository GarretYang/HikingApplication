//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
//import all the basic component we have used
import { TabView, SceneMap } from 'react-native-tab-view';


import AddNewReport from './AddNewReport'
import AddNewTheme from './AddNewTheme'
 
export default class CreateOptionPage extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'first', title: 'CREATE REPORT' },
      { key: 'second', title: 'CREATE FEATURE' },
    ],
  };

  render() {
    return (
      <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: AddNewReport,
            second: AddNewTheme,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{ width: Dimensions.get('window').width }}
      />
      /*
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>Create Themes/Reports</Text>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('AddTheme')}
            >
            <Text>Create Themes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('AddReport')}
            >
            <Text>Create Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
      */
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
  scene: {
    flex: 1,
  },
});