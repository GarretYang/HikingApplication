//This is an example code for Bottom Navigation//
import React, { Component } from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
//import all the basic component we have used
import { Dropdown } from 'react-native-material-dropdown';
 
export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    };

    //Detail Screen to show from any Open detail button
    render() {
        let data = [{
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
                    label='THEME'
                    data={data}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="01/01/2019"
                    onChangeText={(text) => this.setState({text})}
                    value={this.state.text}
                />
                <Text style={{padding: 10, fontSize: 42}}>
                    {this.state.text.split(' ').map((word) => word && '🍕').join(' ')}
                </Text>

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
    },
    buttonContainer: {
      margin: 20
    },
    alternativeLayoutButtonContainer: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
});