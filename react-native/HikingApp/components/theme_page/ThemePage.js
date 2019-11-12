//This is an example code for Bottom Navigation//
import React from 'react';
//import react in our code.
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used

//export default class ThemePage extends React.Component {
//  //Home Screen to show in Home Option
//  render() {
//    return (
//      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//        <Text style={{ marginTop: 50, fontSize: 25 }}>Themes</Text>
//      </View>
//    );
//  }
//}
import { FlatList, ActivityIndicator, Image } from 'react-native';

export default class ThemePage extends React.Component {

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
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


  render(){

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
       <FlatList

        data={ this.state.dataSource }

        ItemSeparatorComponent = {this.FlatListItemSeparator}

        renderItem={({item}) =>

            <TouchableOpacity
                style={{flex:1, flexDirection: 'row'}}
                onPress={() => this.props.navigation.navigate('ThemeReports', {
                    feature: item.feature_name
                })}
            >

              <Image source = {{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.feature_img_id.$oid }} style={styles.imageView} />
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

        width: '70%',
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
