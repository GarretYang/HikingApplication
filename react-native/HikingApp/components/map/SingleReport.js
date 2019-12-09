import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, SafeAreaView, SectionList } from 'react-native';
import { Button } from 'react-native-elements';


export default class SingleReport extends React.Component {

  constructor(props){
    super(props);
    const {navigation} = this.props
    this.state ={
        isLoading: true,
        feature: this.props.navigation.getParam('feature'),
        report: this.props.navigation.getParam('report'),
        description: this.props.navigation.getParam('description'),
        date: this.props.navigation.getParam('date'),
        photos: this.props.navigation.getParam('photos'),
        marker: this.props.navigation.getParam('marker')
    }
  }

  componentDidMount(){
    this.setState({
      isLoading: false,
      reportsData: this.state.marker,
    })
  }

  async imageHandler(item) {
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
          <Text style={styles.textView}>User Name: {item.user_name} </Text>
        )
      } else {
        return (
          <Text style={styles.textView}>no user name</Text>
        )
      }
  }

  dateHandler(item){
      if (item.date_in != undefined) {
          return (
            <Text style={styles.textView}>Date: {item.date_in} </Text>
          )
      }
  }

  descriptionHandler(item) {
      if (item.description != undefined) {
          return (
              <Text style={styles.textView}>Description: {item.description} </Text>
          )
      }
  }

  locationHandler(item) {
      if (item.location != undefined) {
          if (item.location.name != undefined){
              return (
                  <Text style={styles.textView}>Location: {item.location.name} </Text>
              )
          }else {
              return (
                  <Text style={styles.textView}>Location: {item.location } </Text>
              )
          }

      }
  }

  tagsHandler(item) {
      if (item.tags != undefined){
          <Text style={styles.textView}>Tags: {item.tags} </Text>
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
        <Text>{}</Text>
        {this.imageHandler(this.state.reportsData)}
        {this.dateHandler(this.state.reportsData)}
        {this.descriptionHandler(this.state.reportsData)}
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

        width: '95%',
        height: 170 ,
        margin: 7,
        borderRadius : 7

    },

    textView: {

        width:'95%',
        textAlignVertical:'center',
        fontSize: 14,
        fontWeight: 'bold',
        padding:5,
        color: '#273746'

    }
});
