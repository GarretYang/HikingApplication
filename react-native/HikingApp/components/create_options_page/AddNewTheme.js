import React from 'react'
import { Text, View, Alert } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { GoogleSignin } from '@react-native-community/google-signin';

class AddNewTheme extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            thmeme: "",
            location: "",
            isSignedIn: false
        }

    }

    checkIsSignedIn = async () => {
        const isSignedIn = await GoogleSignin.isSignedIn();
        this.setState({ isSignedIn: isSignedIn });
        // console.log("Finish checking the user status");
        if (!this.state.isSignedIn) {
            alert('You must sign in before adding new report!');
        }
    };
    
    submitHandler = async() => {
        this.checkIsSignedIn();
        if (!this.state.isSignedIn)
            return;
        const theme = this.state.theme
        const location = this.state.location

        console.log(theme)  
        console.log(location)

        try {
            let response = await fetch(
                'http://aptproject-255903.appspot.com/newCreatedFeatureJson', 
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'feature_name': theme,
                        'feature_location': location
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

    render() {    
        return (
            <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', paddingLeft: '12.5%', paddingRight: '12.5%' }}>
                
                <View style={{paddingTop: '20%'}}/>
                <>
                    <Text>New Theme Name</Text>
                    <Input 
                        onChange={event => this.setState({theme: event.nativeEvent.text})} 
                        value={this.state.theme}
                    />
                </>
                
                <View style={{paddingTop: '20%'}}/>
                <>
                    <Text>Location</Text>
                    <Input
                        onChange={event => this.setState({location: event.nativeEvent.text})} 
                        value={this.state.location}
                    />
                </>

                <View style={{paddingTop: '20%'}}/>
                <Button
                    style={{backgroundColor: '#9E9E9E'}}
                    title="Submit"
                    onPress={e => this.submitHandler()}
                    // backgroundColor="#f194ff"
                />
            </View>
        )
    }
}

export default AddNewTheme