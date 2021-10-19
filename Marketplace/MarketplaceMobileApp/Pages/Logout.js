import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');

class Logout extends Component {

    componentDidMount() {
        this.logoutExecute();
        this.focusListener = this.props.navigation.addListener('focus',
          () => {
            this.logoutExecute();
          }
        );
    }

    logoutExecute() {
        global.logged_in = false;
        global.login_negozio = false;
        global.user_key = '-1';
        global.username = '';
        global.user_id = -1;
        global.provincia = "MO";
        global.regione = "Emilia-Romagna";
        global.uri = false;
        global.stack_refreshed_home = true;
        global.state = {
          fontLoaded: false,
        };
        this.props.navigation.reset({
            routes: [{ name: "HomeScreen" }]
        });
    }

    render() {
        return null;
    }
}

export default Logout;