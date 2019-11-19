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
    const {navigation} = this.props
    this.state ={
      reports: [],
      isLoading: true
    }
  }

  async componentDidMount(){
    return fetch('http://aptproject-255903.appspot.com/locations')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          reports: responseJson,
        });
      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    return (
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
          latitude: 30.288459,
          longitude: -97.735134,
          latitudeDelta: 0.075,
          longitudeDelta: 0.0484,
        }}
        >
        {this.state.reports.map((marker) =>
          <MapView.Marker
            coordinate={{latitude: marker.location.latitude,
            longitude: marker.location.longitude}}
            title={marker.location.name}
            description={marker.description}
          />
        )}
      </MapView>
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