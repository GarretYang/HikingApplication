import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import { IonButton, IonIcon, IonContent } from '@ionic/react';

//import Ionicons to show the icon for bottom options

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import ThemePage from './components/theme_page/ThemePage'
import SingleTheme from './components/single_theme/SingleTheme'

import MapPage from './components/map/MapPage'
import CreateOptionPage from './components/create_options_page/CreateOptionPage'
import LogInPage from './components/log_in/LogInPage'

import AddNewReport from './components/create_options_page/AddNewReport'
import AddNewTheme from './components/create_options_page/AddNewTheme'

const HomeStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Home: { screen: ThemePage },
    ThemeReports: {
        screen: SingleTheme,
        navigationOptions: {
            title: 'Reports'
        }
    }
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#009577',
      },
      headerTintColor: '#FFFFFF',
      title: 'Home',
      //Header title
    },
  }
);

const AddStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Add: { screen: CreateOptionPage },
    AddTheme: {
      screen: AddNewTheme,
      navigationOptions: {
        headerTitle: 'Add Theme',
      },
    },
    AddReport: {
      screen: AddNewReport,
      navigationOptions: {
        headerTitle: 'Add Report',
      },
     },
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#009577',
      },
      headerTintColor: '#FFFFFF',
      title: 'Add',
      //Header title
    },
  }
);

const MapStack = createStackNavigator(
  {
    //Defination of Navigaton from setting screen
    Map: { screen: MapPage },
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#009577',
      },
      headerTintColor: '#FFFFFF',
      title: 'Map',
      //Header title
    },
  }
);

const LoginStack = createStackNavigator(
  {
    //Defination of Navigaton from setting screen
    Login: { screen: LogInPage },
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#009577',
      },
      headerTintColor: '#FFFFFF',
      title: 'Login',
      //Header title
    },
  }
);

const App = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Map: { screen: MapStack },
    Add: { screen: AddStack },
    Login: { screen: LoginStack },
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = MaterialCommunityIcons;
        let iconName;
        if (routeName === 'Home') {
          //<IonButton color="primary">Primary</IonButton>
          iconName = `home${focused ? '' : '-outline'}`;
        } else if (routeName === 'Map') {
          iconName = `map-marker${focused ? '' : '-outline'}`;
        } else if (routeName === 'Add') {
          //<ion-icon name="add-circle-outline"></ion-icon>
          iconName = `plus-box${focused ? '' : '-outline'}`;
        } else if (routeName === 'Login') {
          iconName = `account${focused ? '' : '-outline'}`;
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#009577',
      inactiveTintColor: 'gray',
    },
  }
);
export default createAppContainer(App);
