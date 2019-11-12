//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class MapPage extends React.Component {
  //Home Screen to show in Home Option
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.container}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    region={{
                      latitude: 30.288459,
                      longitude: -97.735134,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                    >
                  </MapView>
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
   container: {
     ...StyleSheet.absoluteFillObject,
     height: 600,
     width: 400,
     justifyContent: 'flex-end',
     alignItems: 'center',
   },
   map: {
     ...StyleSheet.absoluteFillObject,
   },
});