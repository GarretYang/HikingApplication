import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used
import Ionicons from 'react-native-vector-icons/Ionicons';
//import Ionicons to show the icon for bottom options

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
 
import ThemePage from './components/theme_page/ThemePage'
import MapPage from './components/map/MapPage'
import CreateOptionPage from './components/create_options_page/CreateOptionPage'
import CreateThemesPage from './components/create_themes/createThemesPage'
import LogInPage from './components/log_in/LogInPage'
import createThemesPage from './components/create_themes/createThemesPage';

const HomeStack = createStackNavigator(
  {
    //Defination of Navigaton from home screen
    Home: { screen: ThemePage },
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#42f44b',
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
    AddThemes: { 
      screen: CreateThemesPage,
      navigationOptions: {
        headerTitle: 'Add Themes',
      },    
    }
  },
  {
    defaultNavigationOptions: {
      //Header customization of the perticular Screen
      headerStyle: {
        backgroundColor: '#42f44b',
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
        backgroundColor: '#42f44b',
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
        backgroundColor: '#42f44b',
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
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Settings') {
          iconName = `ios-checkmark-circle${focused ? '' : '-outline'}`;
        }
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#42f44b',
      inactiveTintColor: 'gray',
    },
  }
);
export default createAppContainer(App);