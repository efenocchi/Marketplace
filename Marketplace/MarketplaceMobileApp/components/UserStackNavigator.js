import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import EmptyTemp from "./EmptyTemp";
import UserInfoModify from "../Pages/UserInfoModify";

import HomeStackNavigator from "./HomeStackNavigator";

const Tab = createBottomTabNavigator();

export default function UserStackNavigator() {
  return (
      <Tab.Navigator options={{headerShown: false}} screenOptions={{

          showLabel: false,
          InactiveTintColor: '#e47911',
          activeTintColor: '#e47911',
          gestureEnabled: false,
      }}>

        <Tab.Screen component={HomeStackNavigator}
                    name="Home" // nome in alto della pagina
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="home" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={UserInfoModify}
                    name="UserInfo"
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="user" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={EmptyTemp}
                    name="Cart"
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="shopping-cart" color={color} size={25}/>
                        ),
                    }}
        />
      </Tab.Navigator>
  );
};

