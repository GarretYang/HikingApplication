//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used

import { FlatList, ActivityIndicator, Image, Button } from 'react-native';

export default class ThemePage extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
    this.imageHandler = this.imageHandler.bind(this)
  }

  componentDidMount(){
    return fetch('http://aptproject-255903.appspot.com/json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
          console.log(this.state.responseJson)
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  imageHandler(item) {
    if (item.feature_img_id !== undefined && item.feature_img_id.$oid !== undefined) {
      return (
        <Image source = {{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.feature_img_id.$oid }} style={styles.imageView} />
      )
    } else {
      return (
        <Image source = {{ uri: "http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png"}} style={styles.imageView} />
      )
    }
  }


  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
     <View style={styles.MainContainer}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ marginTop: 50, fontSize: 25 }}>Themes</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => this.props.navigation.navigate('Search')}
          title="Search by Tag Name"
        />
      </View>
       <FlatList

        data={ this.state.dataSource }

        ItemSeparatorComponent = {this.FlatListItemSeparator}

        renderItem={({item}) =>

            <TouchableOpacity
                style={{flex:1, flexDirection: 'column'}}
                onPress={() => this.props.navigation.navigate('ThemeReports', {
                    feature: item.feature_name
                })}
            >
              {this.imageHandler(item)}
              <Text> {item.feature_name} </Text>
            </TouchableOpacity>
          }
        keyExtractor={item => item.feature_id.$oid}

        />

     </View>
    );
  }
}

const styles = StyleSheet.create({

    MainContainer :{

        justifyContent: 'center',
        flex:1,
        margin: 5,
        marginTop: (Platform.OS === 'ios') ? 20 : 0,

    },

    imageView: {

        width: '100%',
        height: 100 ,
        margin: 7,
        borderRadius : 7

    },

    textView: {

        width:'50%',
        textAlignVertical:'center',
        padding:10,
        color: '#000'

    }

});
