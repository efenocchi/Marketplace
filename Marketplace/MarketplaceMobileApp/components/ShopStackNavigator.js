import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Entypo from 'react-native-vector-icons/Entypo';
import EmptyTemp from "./EmptyTemp";
import ShopHomeStackNavigator from "./ShopHomeStackNavigator";
import ChooseShopInfo from "../Pages/ChooseShopInfo";

const Tab = createBottomTabNavigator();

function ShopStackNavigator() {

  return (
      <Tab.Navigator screenOptions={{ gestureEnabled: false }} options={{headerShown: false}} tabBarOptions={{
          showLabel: false,
          InactiveTintColor: '#e47911',
          activeTintColor: '#e47911',
      }}>
        <Tab.Screen component={ShopHomeStackNavigator}
                    name="Shop" /* nome in alto della pagina */
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="home" color={color} size={25}/>
                        ),
                    }}
        />

        <Tab.Screen component={ChooseShopInfo}
                    name="ShopInfo"
                    options={{
                        tabBarIcon: ({color}) => (
                            <Entypo name="user" color={color} size={25}/>
                        ),
                    }}
        />

        {/*<Tab.Screen component={EmptyTemp}*/}
        {/*            name="Cart"*/}
        {/*            options={{*/}
        {/*                tabBarIcon: ({color}) => (*/}
        {/*                    <Entypo name="shopping-cart" color={color} size={25}/>*/}
        {/*                ),*/}
        {/*            }}*/}
        {/*/>*/}
      </Tab.Navigator>
  );
};

export default ShopStackNavigator;