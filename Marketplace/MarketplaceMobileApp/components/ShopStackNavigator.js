import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import EmptyTemp from "./EmptyTemp";
import ShopHomeStackNavigator from "./ShopHomeStackNavigator";
import ChooseShopInfo from "../Pages/ChooseShopInfo";
import AddItem from "../Pages/AddItem";

const Tab = createBottomTabNavigator();

function ShopStackNavigator() {

  return (
      <Tab.Navigator options={{headerShown: false}} screenOptions={{
          gestureEnabled: false,
          showLabel: false,
          InactiveTintColor: '#e47911',
          activeTintColor: '#e47911',
      }}>
        <Tab.Screen component={ShopHomeStackNavigator}
                    name="Home" /* nome in alto della pagina */
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="home" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={AddItem}
                    name="Aggiungi"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="plus" color={color} size={30}/>
                        ),
                    }}
        />

        <Tab.Screen component={ChooseShopInfo}
                    name="Gestione negozio"
                    options={{
                        headerShown: false,
                        tabBarIcon: ({color}) => (
                            <Entypo name="user" color={color} size={25}/>
                        ),
                    }}
        />


      </Tab.Navigator>
  );
};

export default ShopStackNavigator;