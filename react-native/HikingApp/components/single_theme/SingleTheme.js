

import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, SafeAreaView, SectionList, } from 'react-native';

export default class SingleTheme extends React.Component {

  constructor(props){
    super(props);
    const {navigation} = this.props
    this.state ={
        isLoading: true,
        feature: this.props.navigation.getParam('feature')
    }
  }

  componentDidMount(){
    console.log(this.state.feature)
    console.log(fetch('https://aptproject-255903.appspot.com/json/reports?theme='+this.state.feature))
    const feature = this.state.feature
    return fetch('https://aptproject-255903.appspot.com/json/reports?theme='+ feature)
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.reports,
        }, function(){
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
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) =>
             <View style={{flex:1, flexDirection: 'column'}}>

               <Text>User Name: {item.user_name} </Text>
               <Text>Date: {item.date_in} </Text>
               <Text>Description: {item.description} </Text>
               <Text>Tags: {item.tags} </Text>
               <Text>  </Text>

               <Image source = {{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.photos[0].$oid}} style={styles.imageView} />

             </View>}
          keyExtractor={({id}, index) => id}
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
