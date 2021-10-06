import { StatusBar } from 'expo-status-bar';
import React, {Component, useState} from "react";
import { StyleSheet, Button, Text, View,TouchableNativeFeedback} from 'react-native';
import { createAppContainer } from 'react-navigation';
import Drawer from './components/DrawerNavigator';
import * as Font from 'expo-font';
import HomeScreen2 from "./Pages/HomeScreen2";
import {NavigationActions as navigation} from "react-navigation";
import RegistrationStackNavigator from "./components/RegistrationStackNavigator";
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItems, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Login from './Pages/Login';
// import NormalUserRegistration from './Pages/NormalUserRegistration';
// import RegistrationStackNavigator from './components/RegistrationStackNavigator';
import 'react-native-gesture-handler';
// import Registration from "./Pages/Registration";

import {RootSiblingParent} from 'react-native-root-siblings'
import {NavigationContainer} from "@react-navigation/native";


// const AppContainer = createAppContainer(Drawer);


// export function HomeScreen({ navigation }) {
//
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Login"
//         onPress={() => navigation.navigate('Home2', {user_id: 'parametro passato2'})}
//         // onPress={() => navigation.navigate('Home2')}
//       />
//     </View>
//   );
// }



export class HomeScreen extends Component {

    username = null;
   constructor(props){
        super(props);
        this.state ={
            username: "",
            password: "",
            error_message: ""
        }
    }



   render(){
    //  const { params } = this.props.navigation.state;
    // const user_id = params ? params.user_id: null;

     return(


         <Button
        title="Go to Home2"
        onPress={() => this.props.navigation.navigate('Home2', {user_id: 'parametro passato1'})}
        // onPress={() => navigation.navigate('Home2')}
      />

     );

   }
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
    global.ip = "192.168.43.99:80"; // Inserire il proprio ip e la porta in ascolto
    global.uri = false;
    global.state = {
      fontLoaded: false,
    };

    Font.loadAsync({
      'satisfy': require('./assets/fonts/satisfy.ttf'),
      'typold-medium': require('./assets/fonts/typold-medium.otf')
    }).then(global.state.fontLoaded = true)
  } ;



  render () {
    const Stack = createDrawerNavigator();
            //
            // <RootSiblingParent>
            //     <App />
            // </RootSiblingParent>


    if (!global.state.fontLoaded) {
      return (
        NotCharged()
      );
    }
      return (

          <Drawer/>
      //     <NavigationContainer>
      //         <Stack.Navigator initialRouteName="Home">
      //             <Stack.Screen name="Home" component={HomeScreen} />
      //             <Stack.Screen name="Home2" component={HomeScreen2} />
      //             <Stack.Screen name="Login" component={Login} />
      //             <Stack.Screen name="RegistrationStackNavigator" component={RegistrationStackNavigator} />
      //         </Stack.Navigator>
      //     </NavigationContainer>
      );
  }

}
