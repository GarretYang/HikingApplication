import React from 'react';
import Share from 'react-native-share';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FlatList, ActivityIndicator, Text, View, Image, StyleSheet, SafeAreaView, SectionList } from 'react-native';
import { Button, Card } from 'react-native-elements';

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
      let url = "https://aptproject-255903.appspot.com/photo?photoId="+item.photos[0].$oid
      if (item.user_name !== undefined) {
        return (
          <View style={{flex:1, flexDirection: "row", justifyContent: 'space-between'}}>
            <View style={{flex:1, flexDirection: "row"}}>
              <Text style={styles.textViewtitle}>  {item.user_name} </Text>
            </View>
            <View>
              <Button
                buttonStyle={{backgroundColor:'#EAECEE'}}
                // title="Share"
                icon={
                  <MaterialCommunityIcons name="share" size={15} />
                }
                onPress={() => this.shareHandler(url, item)}
              />
            </View>
          </View>
        )
      } else {
        return (
          <View style={{flex:1, flexDirection: "row", justifyContent: 'space-between'}}>
            <View>
              <Button
                buttonStyle={{backgroundColor:'#009577'}}
                // title="Share"
                icon={
                  <MaterialCommunityIcons name="share" size={15} />
                }
                onPress={() => this.shareHandler(url, item)}
              />
            </View>
          </View>
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
          } else {
              return (
                  <Text style={styles.textView}>Location: {item.location } </Text>
              )
          }

      }
  }

  tagsHandler(data) {
      if (data.tags != undefined){
          // console.log(data.tags)
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
                          <Text style={styles.textView, {backgroundColor: "#EAECEE", marginRight: 10, marginTop:5,}}>{item} </Text>}
                    listKey = {(item, index) => 'D' + index.toString()}
                  />
              </View>
          )

      }
  }

  shareHandler(url, item) {
    console.log("You clikced share")
    let messageToShare = 'Check out this awesome hiking photo posted on '+item.date_in+'! \n\n'+item.user_name+' said: '+item.description+' \n\n'
    const shareOption = {
      title: 'Sharing Hiking Photo',
      message: messageToShare,
      url: url,
      social: [
        Share.Social.FACEBOOK,
      ]
    }
    Share.open(shareOption)
    .then((res) => { console.log(res) })
    .catch((err) => { err && console.log(err); });
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
         <View style={styles.buttonContainer}>
             <Button
               onPress={() => this.props.navigation.navigate('Search')}
               title="Search by Tag Name"
               type="outline"
             />
         </View>
        <FlatList
          data={this.state.reportsData}
          renderItem={({item}) =>

             <View style={{flex:1, flexDirection: 'column'}}>
                <Card title={this.userNameHandler(item)}
                    image={{ uri: "https://aptproject-255903.appspot.com/photo?photoId="+item.photos[0].$oid}} style={styles.imageView}
                    >
                    {this.dateHandler(item)}
                    {this.descriptionHandler(item)}
                    {this.tagsHandler(item)}
                </Card>
             </View>

         }
          keyExtractor={(item, index) => item._id.$oid}
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

    },

    textViewtitle: {

        width:'95%',
        textAlignVertical:'center',
        fontSize: 20,
        fontWeight: 'bold',
        padding:5,
        color: '#626567'

    }
});
