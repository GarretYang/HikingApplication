

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
          dataSourceUserName: responseJson.user_name,
        }, function(){
          var count = this.state.dataSource.length;
          for (var i=0; i<count; i++) {
            this.state.dataSource[i].user_name = this.state.dataSourceUserName[i];
            //console.log('I am debugging 1', this.state.dataSource[i].user_name);
            //console.log('I am debugging 1', this.state.dataSource[i].description);
          }
          this.setState({reportsData: this.state.dataSource})
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  imageHandler(item) {
    if (item.photos !== undefined && item.photos[0].$oid !== undefined) {
      return (
        <Image source = {{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.photos[0].$oid}} style={styles.imageView} />
      )
    } else {
      return (
        <Image source = {{ uri: "http://denrakaev.com/wp-content/uploads/2015/03/no-image-800x511.png"}} style={styles.imageView} />
      )
    }
  }

  userNameHandler(item){
      if (item.user_name !== undefined) {
        return (
          <Text>User Name: {item.user_name} </Text>
        )
      } else {
        return (
          <Text>no user name</Text>
        )
      }
  }

  dateHandler(item){
      if (item.date_in != undefined) {
          return (
            <Text>Date: {item.date_in} </Text>
          )
      }
  }

  descriptionHandler(item) {
      if (item.description != undefined) {
          return (
              <Text>Description: {item.description} </Text>
          )
      }
  }

  locationHandler(item) {
      if (item.location != undefined) {
          if (item.location.name != undefined){
              return (
                  <Text>Location: {item.location.name} </Text>
              )
          }else {
              return (
                  <Text>Location: {item.location } </Text>
              )
          }

      }
  }

  tagsHandler(item) {
      if (item.tags != undefined){
          <Text>Tags: {item.tags} </Text>
      }
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
          data={this.state.reportsData}
          renderItem={({item}) =>
             <View style={{flex:1, flexDirection: 'column'}}>
                <Text>{}</Text>
                {this.userNameHandler(item)}
                {this.dateHandler(item)}
                {this.descriptionHandler(item)}
                {this.tagsHandler(item)}
                {this.imageHandler(item)}
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
