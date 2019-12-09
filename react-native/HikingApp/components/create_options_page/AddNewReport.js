//This is an example code for Bottom Navigation//
import React, { Component } from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet, Button, TextInput, ImageBackground, ScrollView, Alert } from 'react-native';
//import all the basic component we have used
import { Dropdown } from 'react-native-material-dropdown';
import ImagePicker from 'react-native-image-picker';
//import ImgToBase64 from 'react-native-image-base64';
import { GoogleSignin } from '@react-native-community/google-signin';
import RNFS from 'react-native-fs';
import GetLocation from 'react-native-get-location';
import { TagSelect } from 'react-native-tag-select';
import ImageView from 'react-native-image-view'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default class AddNewReport extends React.Component {
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
        this.handleDeletePhoto = this.handleDeletePhoto.bind(this)
    };

    componentDidMount(){
        return fetch('http://aptproject-255903.appspot.com/json')
          .then((response) => response.json())
          .then((responseJson) => {
                var count = Object.keys(responseJson).length;
                let drop_down_data = [];
                for (var i=0; i<count; i++) {
                    drop_down_data.push({ value: responseJson[i].feature_name });
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

    handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.uri) {
                this.setState({ photos: [...this.state.photos, response] })
                
                RNFS.readFile(response.path, 'base64')
                    .then(res =>{
                        this.setState({ photosBase64: [...this.state.photosBase64, res] });
                });
            };
            
        });     
    }

    handleTakePhoto = async() => {
        const options = {
            // noData: true,
            base64: true
        };
        await ImagePicker.launchCamera(options, (response) => {
            if (response.uri) {
                this.setState({ photos: [...this.state.photos, response] })
                
                RNFS.readFile(response.path, 'base64')
                    .then(res => {
                    this.setState({ photosBase64: [...this.state.photosBase64, res] });
                });
                console.log(this.state.photo)
                console.log(this.state.photosBase64)
            };
        });  
    }

    handleDeletePhoto = async(photo) => {
        this.setState({photos: this.state.photos.filter((img) => {
                return img.uri !== photo.uri
            }) 
        })
        this.setState({photosBase64: this.state.photosBase64.filter((img) => {
                return img.data != photo.data
            })
        })
    }

    checkIsSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ isSignedIn: isSignedIn });
        if (!this.state.isSignedIn) {
            alert('You must sign in before adding new report!');
        } 
    };

    sentenceGeneratorTrigger = async(photo_id) => {
        let image_url = "https://aptproject-255903.appspot.com/photo?photoId=" + photo_id;
        console.log("You pressed! " + image_url);
        //TODO: get results from api!
    }

    getCurrentUser = async () => {
        const currentUser = await GoogleSignin.getCurrentUser();
        this.setState({ 
            user_name: currentUser.user.name, 
            user_email: currentUser.user.email,
        });

    };
    
    getLocationData = async() =>  {
        try {
            let location = await GetLocation.getCurrentPosition({
                enableHighAccuracy: true,
                // timeout: 15000,
            })
            this.setState( { geo_location: location } )
            let locationData = [];
            locationData.push({ 
                name: this.state.location, 
                latitude: location.latitude, 
                longitude: location.longitude 
            });        
            this.setState({ locationData: locationData });
        } catch(error) {
            const { code, message } = error;
            // console.warn(code, message);
        }
    }

    getTagsData = async() => {
        var num = this.tag.itemsSelected.length;
        let tagsData = [];
        for (var i=0; i<num; i++) {
            tagsData.push(this.tag.itemsSelected[i].label)
        };
        this.setState({tags: tagsData});
    }

    submitHandler = async () => {
        await this.checkIsSignedIn();
        if (!this.state.isSignedIn) return
        await this.getCurrentUser();
        await this.getTagsData();
        await this.getLocationData();
        
        try {
            let response = await fetch(
                'http://10.0.2.2:5000/newcreatereportjson',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'feature': this.state.feature_name,
                        'tags': this.state.tags,
                        'location': this.state.locationData[0],
                        'description': this.state.description,
                        'date': this.state.date,
                        'photos': this.state.photosBase64,
                        'name': this.state.user_name,
                        'email': this.state.user_email,
                    })
                }
            )
            let responseJson = await response.json();
            console.log(responseJson);
            console.log(responseJson['status']);
            console.log(responseJson['photo_id']);
            Alert.alert(
                'Submission Status',
                responseJson['status'],
                [{
                    text: 'Ok',
                    onPress: () => 
                        Alert.alert(
                            'Surprise!',
                            'See what AI tells about your photo!',
                            [
                                { text: 'Yes!!!',
                                    onPress: () => { this.sentenceGeneratorTrigger(responseJson['photo_id']) },
                                },
                                { text: 'Nope',
                                }
                            ]
                        )                  
                }],
            )          
            this.setState({feature: ""})
            this.setState({date: ""})
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
        const { photos } = this.state
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

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center' }}>
                        { photos.map((photo) => 
                            photo && (
                                <ImageBackground
                                    source={{ uri: photo.uri }}
                                    style={{ width: 150, height: 150, flex: 1, borderRadius: 15 }}
                                >
                                    <MaterialCommunityIcons 
                                        style={styles.close} 
                                        name="delete-circle"
                                        size={25}
                                        onPress={() => this.handleDeletePhoto(photo)}>
                                    </MaterialCommunityIcons>
                                </ImageBackground>
                            )
                        )}
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

                <View style={styles.submitButtonContainer}>
                    <Button
                        title="Submit"
                        onPress={() =>
                            {
                                this.submitHandler();
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
     },
    close: {
        margin: 5,
        position: "absolute",
        top: 0,
        left: 0,
        width: 25,
        height: 25,
        color: "tomato"
    }
});