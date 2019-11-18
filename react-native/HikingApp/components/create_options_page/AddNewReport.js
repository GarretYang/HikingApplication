//This is an example code for Bottom Navigation//
import React, { Component } from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput, Image, ScrollView, Alert } from 'react-native';
//import all the basic component we have used
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import { GoogleSignin } from '@react-native-community/google-signin';

export default class DetailsScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            photos: [],
            photosBase64: [],
            feature: "",
            date: "",
            location: "",
            description: "",
            isLoading: true,
            isSignedIn: false
        };
        this.handleChoosePhoto = this.handleChoosePhoto.bind(this)
        this.handleTakePhoto = this.handleTakePhoto.bind(this)
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

    handleSubmit = async() => {
        try {
            let response = await fetch(
                'http://aptproject-255903.appspot.com/newcreatereportjson',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'photos': this.state.photosBase64,
                        'feature': this.state.feature,
                        'location': this.state.location,
                        "tags": ["DRY"],
                        "description": this.state.description,
                        "name": "Garret",
                        "email": "qihuay@utexas.edu"
                    })    
                }
            )
            let responseJson = await response.text();
            Alert.alert(
                'Submission Status',
                responseJson
            )
        } catch(error) {
            Alert.alert(error)
        }

    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response", response);
            console.log(response.fileName);
            if (response.uri) {
                // this.setState({ photo: response })
            };
        });
        /*I I 
        ImgToBase64.getBase64String(this.state.photo.path)
        .then(base64String => doSomethingWith(base64String))
        .catch(err => doSomethingWith(err));*/
    }

    handleTakePhoto = async() => {
        const options = {
            // noData: true,
            base64: true
        };
        await ImagePicker.launchCamera(options, (response) => {
            // "data" field has the base 64 data
            let selectedPhotoBase64 = response.data;
            if (response.uri) {
                this.setState({ photosBase64: [...this.state.photosBase64, selectedPhotoBase64] })
                this.setState({ photos: [...this.state.photos, response]})
            };
        });  
    }

    checkIsSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ isSignedIn: isSignedIn });
        // console.log("Finish checking the user status");
        if (!this.state.isSignedIn) {
            alert('You must sign in before adding new report!');
        }
    };

    //Detail Screen to show from any Open detail button
    render() {
        const { photos } = this.state
        return (
            <ScrollView>
            <View style={ styles.container }>
                <Text>Add New Report</Text>
                
                <Dropdown
                    label='Theme'
                    data={this.state.drop_down_data}
                    onChangeText={(value) => this.setState({feature: value})}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="01/01/2019"
                    onChangeText={(value) => this.setState({date: value})}
                    value={this.state.date}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="Description"
                    onChangeText={(value) => this.setState({description: value})}
                    value={this.state.description}
                />

                <TextInput
                    style={{height: 40}}
                    placeholder="Location"
                    onChangeText={(value) => this.setState({location: value})}
                    value={this.state.location}
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
                        onPress={() => { this.handleChoosePhoto() }}
                        title="GALLERY"
                    />
                    <Button
                        onPress={() => { this.handleTakePhoto() }}
                        title="CAMERA"
                    />
                </View>

                { photos.map((photo) => 
                    photo && (
                        <Image
                            source={{ uri: photo.uri }}
                            style={{ width: 300, height: 300 }}
                        />
                    )
                )}

                <View style={styles.submitButtonContainer}>
                    <Button
                        title="Submit"
                        onPress={() =>
                            {
                                this.checkIsSignedIn();
                                console.log(this.state.date);
                                console.log(this.state.description);
                                console.log(this.state.location);
                                console.log(this.state.photo.fileName)
                            }
                        }
                    />
                </View>
                
            </View>
            </ScrollView>
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
    },
    submitButtonContainer: {
        //margin: 20,
        marginTop: 20,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        justifyContent: 'center',
        alignContent: 'center', 
    },
});