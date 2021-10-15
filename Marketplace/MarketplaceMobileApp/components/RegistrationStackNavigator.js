import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Registration from '../Pages/Registration';
import NormalUserRegistration from '../Pages/NormalUserRegistration';
import ShopRegistration from '../Pages/ShopRegistration';
import Login from "../Pages/Login";
import HomeScreen2 from "../Pages/HomeScreen2";
import ProvaStampa from "../Pages/ProvaStampa";
import React from "react";


const Stack = createStackNavigator();

export default function RegistrationStackNavigator() {

        return (

            <Stack.Navigator initialRouteName="Registration" options={{headerShown: false}}>
                <Stack.Screen name="Registration" component={Registration} options={{headerShown: false}}/>
                <Stack.Screen name="NormalUserRegistration" component={NormalUserRegistration} options={{headerShown: false}}/>
                <Stack.Screen name="Home2" component={HomeScreen2} options={{headerShown: false}}/>
                <Stack.Screen name="ShopRegistration" component={ShopRegistration} options={{headerShown: false}}/>
            </Stack.Navigator>

        );
}
