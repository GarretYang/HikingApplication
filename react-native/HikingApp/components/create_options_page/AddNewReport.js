//This is an example code for Bottom Navigation//
import React, { Component } from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput, Image, ScrollView, Alert } from 'react-native';
//import all the basic component we have used
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
//import ImgToBase64 from 'react-native-image-base64';
import { GoogleSignin } from '@react-native-community/google-signin';
import RNFS from 'react-native-fs';
import GetLocation from 'react-native-get-location';
import { TagSelect } from 'react-native-tag-select';

export default class AddNewReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            isLoading: true,
            isSignedIn: false
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

    state = {
        photo: null,
    }

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            console.log("response", response);
            console.log(response.fileName);
            console.log(response.data);
            if (response.uri) {
                this.setState({ photo: response })
                
                RNFS.readFile(response.path, 'base64')
                    .then(res =>{
                    //console.log('base64 is: ', res);
                    this.setState({ photo_base64: res });
                });
            };
            
        });     
    }

    handleTakePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchCamera(options, (response) => {
            console.log("response", response);
            console.log(response.fileSize);
            if (response.uri) {
                this.setState({ photo: response })

                RNFS.readFile(response.path, 'base64')
                    .then(res =>{
                    //console.log('base64 is: ', res);
                    this.setState({ photo_base64: res });
                });
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

    getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        this.setState({ 
            user_name: currentUser.user.name, 
            user_email: currentUser.user.email,
        });
        //console.log(currentUser.user.email);
        //console.log(currentUser.user.name);
    };
    
    getLocationData() {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
        .then(location => {
            //console.log(location);
            this.setState({ geo_location: location });
            //console.log(this.state.geo_location.latitude);
            //console.log(this.state.geo_location.longitude);
            let locationData = [];
            locationData.push({ 
                name: this.state.location, 
                latitude: this.state.geo_location.latitude, 
                longitude: this.state.geo_location.longitude 
            });
            this.setState({ locationData: locationData }, this.submitHandler);
            //console.log(locationData);
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    }

    getTagsData()  {
        var num = this.tag.itemsSelected.length;
        let tagsData = [];
        for (var i=0; i<num; i++) {
            tagsData.push(this.tag.itemsSelected[i].label)
        };
        this.setState({tags: tagsData});
        //console.log(tagsData);
        //console.log(this.state.user_name);
    }

    submitHandler = async () => {
        await this.getTagsData();
        console.log(this.state.feature_name);
        console.log(this.state.date);
        console.log(this.state.description);
        console.log(this.state.locationData);
        console.log(this.state.photo_base64);
        console.log(this.state.tags);
        console.log(this.state.user_name);
        console.log(this.state.user_email);
        
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
                        //'feature_name': this.state.feature_name,
                        'feature': this.state.feature_name,
                        'tags': this.state.tags,
                        'location': this.state.locationData[0],
                        'description': this.state.description,
                        //'date_in': this.state.date,
                        'date': this.state.date,
                        //'photos': '001test',
                        'photos': [this.state.photo_base64],
                        'name': this.state.user_name,
                        'email': this.state.user_email,
                    })
                }
            )
            let responseJson = await response.text();
            Alert.alert(
                'Submission Status',
                responseJson.substring(responseJson.indexOf(':')+1, responseJson.length-1)
            )
        } catch(error) {
            Alert.alert(
                'Submission Status',
                error
            )
        }
    }

    //Detail Screen to show from any Open detail button
    render() {
        const tags = [
            { id: 1, label: 'Dry' },
            { id: 2, label: 'Wet' },
            { id: 3, label: 'Crowded' },
            { id: 4, label: 'Not Busy' },
            { id: 5, label: 'Hot' },
            { id: 6, label: 'Cold' },
        ];
        const { photo } = this.state
        return (
            <ScrollView>
            <View style={ styles.container }>
                <Text>Add New Report</Text>
                
                <Dropdown
                    label='Theme'
                    data={this.state.drop_down_data}
                    onChangeText={(value) => this.setState({ feature_name: value })}
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

                <View style={styles.tagsContainer}>
                    <Text>Tags:</Text>
                    <TagSelect
                        data={tags}
                        max={6}
                        ref={(tag) => {
                            this.tag = tag;
                        }}
                        onMaxError={() => {
                            Alert.alert('Ops', 'Max reached');
                        }}
                    />
                </View>

                <View style={styles.alternativeLayoutButtonContainer}>
                    <Button
                        onPress={this.handleChoosePhoto}
                        title="GALLERY"
                    />
                    <Button
                        onPress={this.handleTakePhoto}
                        title="CAMERA"
                    />
                </View>

                {photo && (
                    <Image
                        source={{ uri: photo.uri }}
                        style={{ width: 300, height: 300 }}
                    />
                )}

                <View style={styles.submitButtonContainer}>
                    <Button
                        title="Submit"
                        onPress={() =>
                            {
                                this.checkIsSignedIn();
                                this.getCurrentUser();
                                this.getTagsData();
                                this.getLocationData();
                                //this.submitHandler();
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
    tagsContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop: 50,
        marginLeft: 15,
      }
});