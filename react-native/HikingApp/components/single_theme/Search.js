import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, SafeAreaView, SectionList, TextInput } from 'react-native';

export default class Search extends React.Component {

  constructor(props){
    super(props);
    const {navigation} = this.props
    this.state ={
        isLoading: true,
        tag_name: '',
    }
  }

  findReportsByTagName(){
    return fetch('https://aptproject-255903.appspot.com/search?tag='+ this.state.tag_name)
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

  tagsHandler(data) {
      if (data.tags != undefined){
          console.log(data.tags)
          return(
              <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap'}}>
                <Text style={{
                    textAlignVertical:'center',
                    fontSize: 14,
                    fontWeight: 'bold',
                    padding:5,
                    color: '#273746'
                }}>Tags: </Text>
                  <FlatList
                  style={{flex:1, flexDirection: 'row', flexWrap:'wrap'}}
                    data={data.tags}
                    renderItem={({item}) =>
                          <Text style={styles.textView, {backgroundColor: "#009577", marginRight: 10, marginTop:5, color: "white"}}>{item} </Text>}
                    listKey = {(item, index) => 'D' + index.toString()}
                  />
              </View>
          )

      }
  }

  render(){
    if(this.state.tag_name != 'hot' && this.state.tag_name != 'cold' && this.state.tag_name != 'Cold' &&  this.state.tag_name != 'crowded' && this.state.tag_name != 'Crowded' && this.state.tag_name != 'not busy' && this.state.tag_name != 'Not Busy' && this.state.tag_name != 'wet' && this.state.tag_name != 'Wet' && this.state.tag_name != 'dry' && this.state.tag_name != 'Dry' && !this.state.isLoading){
        return(
          <View style={{flex: 1, padding: 20}}>
              <TextInput
                placeholder="Search by Tag Name"
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={tag_name => this.setState({ tag_name: tag_name })}
                value={this.state.tag_name}
              />
            <ActivityIndicator/>
          </View>
      )
  }else {
        this.findReportsByTagName()
        return(
         <View style={styles.MainContainer}>
             <TextInput
               placeholder="Search by Tag Name"
               autoCapitalize="none"
               style={styles.textInput}
               onChangeText={text => this.setState({ tag_name: text })}
               value={this.state.tag_name}
             />
            <FlatList
              data={this.state.dataSource}
              renderItem={({item}) =>
                 <View style={{flex:1, flexDirection: 'column'}}>
                    {this.imageHandler(item)}
                    {this.userNameHandler(item)}
                    {this.dateHandler(item)}
                    {this.descriptionHandler(item)}
                    {this.tagsHandler(item)}
                    <Text>  </Text>
                 </View>}
              keyExtractor={({id}, index) => id}
            />
         </View>
        );
    }
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
