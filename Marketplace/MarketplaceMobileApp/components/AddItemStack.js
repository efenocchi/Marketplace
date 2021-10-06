import React, { Component, useContext } from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import AddItem from "../Pages/AddItem"
import ProvaUploadImmagini from "../Pages/ProvaUploadImmagini"




const Stack = createStackNavigator();
export default class AddItemStack extends Component {

    render(){
        return(

            <Stack.Navigator initialRouteName="AddItem">

                <Stack.Screen name="AddItem" component={AddItem}/>

                <Stack.Screen name="ProvaUploadImmagini" component={ProvaUploadImmagini}/>

            </Stack.Navigator>

        );
    }
}

