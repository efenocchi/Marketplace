import React, { Component, useContext } from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import AddItem from "../Pages/AddItem"




const Stack = createStackNavigator();
export default class AddItemStack extends Component {

    render(){
        return(

            <Stack.Navigator initialRouteName="AddItem" screenOptions={{headerShown: false}}>

                <Stack.Screen name="AddItem" component={AddItem} screenOptions={{headerShown: false}}/>

            </Stack.Navigator>

        );
    }
}

