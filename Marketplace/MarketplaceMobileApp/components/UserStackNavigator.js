import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Cart from "../Pages/Cart";
import ChooseUserInfo from "../Pages/ChooseUserInfo";

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

        <Tab.Screen component={ChooseUserInfo}
                    name="UserInfo"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="user" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={Cart}
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

