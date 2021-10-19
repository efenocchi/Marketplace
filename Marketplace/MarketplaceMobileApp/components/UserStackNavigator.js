import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import Cart from "../Pages/Cart";
import ChooseUserInfo from "../Pages/ChooseUserInfo";

import HomeStackNavigator from "./HomeStackNavigator";
import {useRoute} from '@react-navigation/native';
const Tab = createBottomTabNavigator();

export default function UserStackNavigator() {
const route = useRoute();
console.log("Stampo il Route");
console.log(route.name);

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
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="home" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={ChooseUserInfo}
                    name="Gestione utente"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="user" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={Cart}
                    name="Carrello"
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="shopping-cart" color={color} size={25}/>
                        ),
                    }}
        />
      </Tab.Navigator>
  );
};

