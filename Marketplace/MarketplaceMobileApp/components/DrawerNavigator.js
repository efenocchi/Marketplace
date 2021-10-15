import {createDrawerNavigator} from "@react-navigation/drawer";

import HomeScreen2 from "../Pages/HomeScreen2";
import Registration from "../Pages/Registration";
import RegistrationStackNavigator from "../components/RegistrationStackNavigator";
import { NavigationContainer } from '@react-navigation/native';

import Login from "../Pages/Login";
import React, { useState } from "react";
import {Button, Text, View} from "react-native";
import NormalUserRegistration from "../Pages/NormalUserRegistration";
import ShopRegistration from "../Pages/ShopRegistration";
import {createStackNavigator} from "@react-navigation/stack";
import UserStackNavigator from "./UserStackNavigator";
import ShopStackNavigator from "./ShopStackNavigator";
import ItemList from "../Pages/ItemList";
import provaFetch from "../Pages/provaFetch";
import OrdersPlaced from "../Pages/OrdersPlaced";
import AddItem from "../Pages/AddItem";
import TakeAPicture from "../Pages/TakeAPictureOrVideo";
import UploadPhoto2 from "../Pages/UploadPhoto2";



export function HomeScreen({ navigation, route }) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Login"
        // onPress={() => navigation.navigate('Login', {user_id: "3"})}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );

}


class Hidden extends React.Component {
  render() {
    return null;
  }
}


const Drawer = createDrawerNavigator();
function DrawerNavigator() {
    return (

<NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        {/*Usati solo per prove*/}
          <Drawer.Screen name="Login" component={Login} screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}}/>
          {/*<Drawer.Screen name="UploadPhoto2" component={UploadPhoto2} />*/}
          {/*<Drawer.Screen name="TakeAPicture" component={TakeAPicture} />*/}
          {/*<Drawer.Screen name="provaFetch" component={provaFetch} />*/}

          {/*<Drawer.Screen name="AddItem" component={AddItem} />*/}
          <Drawer.Screen name="Home2" component={HomeScreen2} />


          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="OrdersPlaced" component={OrdersPlaced} />
          <Drawer.Screen name="RegistrationStackNavigator" component={RegistrationStackNavigator} screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="UserStackNavigator" screenOptions={{ gestureEnabled: false }} component={UserStackNavigator} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="ShopStackNavigator" screenOptions={{ gestureEnabled: false }} component={ShopStackNavigator} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="ItemList" component={ItemList} />
      </Drawer.Navigator>
</NavigationContainer>

    );

};

export default DrawerNavigator;


