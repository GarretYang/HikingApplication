//This is an example code for Bottom Navigation//
import React, { Component } from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput, FlatList } from 'react-native';
//import all the basic component we have used
import { Dropdown } from 'react-native-material-dropdown';
//import ImagePicker from 'react-native-image-picker';

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isLoading: true
        };
    };

    componentDidMount(){
        return fetch('http://aptproject-255903.appspot.com/json')
          .then((response) => response.json())
          .then((responseJson) => {
                var count = Object.keys(responseJson).length;
                //console.log(count);
                let drop_down_data = [];
                for (var i=0; i<count; i++) {
                    //console.log(responseJson[i].feature_name);
                    drop_down_data.push({ value: responseJson[i].feature_name });
                    //console.log(drop_down_data)
                }

                this.setState({
                    isLoading: false,
                    drop_down_data
                }, function(){
                    
                });
    
          })
          .catch((error) =>{
            console.error(error);
          });
      }

    //Detail Screen to show from any Open detail button
    render() {
        let themeName = [{
        value: 'Picnic',
        }, {
        value: 'Kayaking',
        }, {
        value: 'Waterfall',
        }];
        
        return (
            <View style={ styles.container }>
                <Text>Add New Report</Text>
                
                <Dropdown
                    label='Theme'
                    data={this.state.drop_down_data}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="01/01/2019"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="Description"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="Location"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />

                <View style={styles.alternativeLayoutButtonContainer}>
                    <Button
                        //onPress={this._onPressButton}
                        title="Dry"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="Wet"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="Crowded"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="Not Busy"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="Hot"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="Cold"
                    />
                </View>

                <View style={styles.alternativeLayoutButtonContainer}>
                    <Button
                        //onPress={this._onPressButton}
                        title="GALLERY"
                    />
                    <Button
                        //onPress={this._onPressButton}
                        title="CAMERA"
                    />
                </View>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center', 
        //alignItems: 'center', 
        paddingLeft: '10%', 
        paddingRight: '10%',
    },
    buttonContainer: {
        margin: 20
    },
    alternativeLayoutButtonContainer: {
        //margin: 20,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});