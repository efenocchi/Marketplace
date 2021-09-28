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
    // this.name = this.props.route.params.user_id


        console.log( this.props.route.params.user_id)
        return (

            <Stack.Navigator initialRouteName="Registration">
                <Stack.Screen name="Registration" component={Registration}/>
                <Stack.Screen name="NormalUserRegistration" component={NormalUserRegistration}/>
                <Stack.Screen name="Home2" component={HomeScreen2}/>
                <Stack.Screen name="ShopRegistration" component={ShopRegistration}/>
                {/*<Stack.Screen name="ProvaStampa" component={ProvaStampa}/>*/}
            </Stack.Navigator>

        );
}
