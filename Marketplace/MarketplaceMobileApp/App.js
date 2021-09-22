import { StatusBar } from 'expo-status-bar';
import React, { useState } from "react";
import { StyleSheet, Button, Text, View,TouchableNativeFeedback} from 'react-native';
import { createAppContainer } from 'react-navigation';
import Drawer from './components/DrawerNavigator';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItems, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Login from './Pages/Login';
// import NormalUserRegistration from './Pages/NormalUserRegistration';
// import RegistrationStackNavigator from './components/RegistrationStackNavigator';
import 'react-native-gesture-handler';
// import Registration from "./Pages/Registration";
import HomeScreen2 from "./Pages/HomeScreen2";
import Registration from "./Pages/Registration";
import RegistrationStackNavigator from "./components/RegistrationStackNavigator";

// const AppContainer = createAppContainer(Drawer);

const Stack = createDrawerNavigator();



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




function NotCharged() {
  const bodyText = "Non è stato caricato il Font";
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <Text numberOfLines={5}>{bodyText}</Text>
    </View>
  );
}

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
    global.state = {
      fontLoaded: false,
    };

    Font.loadAsync({
      'satisfy': require('./assets/fonts/satisfy.ttf'),
      'typold-medium': require('./assets/fonts/typold-medium.otf')
    }).then( global.state.fontLoaded = true)
  } ;



  render () {
    if (!global.state.fontLoaded) {
      return (
        NotCharged()
      );
    }
    return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Home2" component={HomeScreen2} />
        <Stack.Screen name="Login" component={Login} />
        {/*<Stack.Screen name="Registration" component={Registration}/>*/}
        <Stack.Screen
          name="Registration"
          component={RegistrationStackNavigator}

        />
        {/*<Stack.Screen name="NormalUserRegistration" component={NormalUserRegistration}/>*/}
      </Stack.Navigator>
    </NavigationContainer>
    );
  }

}
