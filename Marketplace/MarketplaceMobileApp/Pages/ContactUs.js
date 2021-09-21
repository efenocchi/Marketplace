import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput } from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card'
// import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
// import { IconButton } from 'react-native-paper';


const {width, height} = Dimensions.get('window');

class ContactUs extends Component{

    constructor(props){
        super(props);
        this.state ={
            titolo: "",
            messaggio: "",
            error_message: ""
        }
    }



}