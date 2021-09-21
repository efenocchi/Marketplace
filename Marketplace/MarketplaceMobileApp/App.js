import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Text, View,TouchableNativeFeedback} from 'react-native';
import { createAppContainer } from 'react-navigation';
import Drawer from './components/DrawerNavigator';


const AppContainer = createAppContainer(Drawer);

export default class App extends React.Component {

  constructor() {
    super();
/*  IMPORTANTE:
    per mostrare le variabili locali anche nei prossimi file:
    1) cliccare con ctrl + tasto sinistro del mouse su global
    2) passare da: "declare var global: typeof globalThis;" --> "declare const global: any;"
*/
    global.logged_in = false;
    global.login_negozio = false;
    global.user_key = "-1";
    global.username = "";
    global.user_id = -1;
    global.provincia = "AG";
    global.regione = "Abruzzo";
  }

  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    await Font.loadAsync({
      'satisfy': require('./assets/fonts/satisfy.ttf'),
      'typold-medium': require('./assets/fonts/typold-medium.otf')
    });

    this.setState({ fontLoaded: true });
  }

  render () {
    if (!this.state.fontLoaded) {
      return (
        <View></View>
      );
    }

    return (
      <AppContainer navigation={this.props.navigation}/>
    );
  }
}
