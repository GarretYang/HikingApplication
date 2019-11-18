//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

export default class MapPage extends React.Component {
  //Home Screen to show in Home Option
  constructor(props) {
    super(props);

    this.state = {
      markers: [{
        coordinates: {
          latitude: 30.28,
          longitude: -97.74
        },
        title: "TITLE!!",
        description: "DESC!!"
      }],
      markers2: getReports()
    }
  }

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
            {this.state.markers.map(marker => (
              console.log("MARKER!!"),
              <MapView.Marker
                coordinate={marker.coordinates}
                title={marker.title}
                description={marker.description}
              />
            ))}
          </MapView>
        </View>
      </View>
    );
  }
}

function getReports() {
  return fetch('http://aptproject-255903.appspot.com/locations')
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      console.log("inside responsejson");
      return responseJson;
    })
    .catch((error) => {
      console.log(error)
      console.error(error);
    });
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