import {createDrawerNavigator} from "@react-navigation/drawer";
import HomeScreen2 from "../Pages/HomeScreen2";
import Registration from "../Pages/Registration";
import RegistrationStackNavigator from "../components/RegistrationStackNavigator";
import { NavigationContainer } from '@react-navigation/native';

import Login from "../Pages/Login";
import React, { useState } from "react";
import {Button, Text, View} from "react-native";



export function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Login"
        // onPress={() => navigation.navigate('Home2')}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const Stack = createDrawerNavigator();

function MyDrawer() {
    return (

<NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Home2" component={HomeScreen2} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="RegistrationStackNavigator" component={RegistrationStackNavigator} options={{headerShown: false}}/>


      </Stack.Navigator>
</NavigationContainer>
    );

};

export default MyDrawer;


