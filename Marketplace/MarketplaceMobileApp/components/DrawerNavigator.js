import {createDrawerNavigator} from "@react-navigation/drawer";

import HomeScreen2 from "../Pages/HomeScreen2";
import Registration from "../Pages/Registration";
import RegistrationStackNavigator from "../components/RegistrationStackNavigator";
import { NavigationContainer } from '@react-navigation/native';

import Login from "../Pages/Login";
import React, { useState } from "react";
import {Dimensions, ImageBackground, StyleSheet, Text, View} from "react-native";
import NormalUserRegistration from "../Pages/NormalUserRegistration";
import ShopRegistration from "../Pages/ShopRegistration";
import {createStackNavigator} from "@react-navigation/stack";
import UserStackNavigator from "./UserStackNavigator";
import ShopStackNavigator from "./ShopStackNavigator";
import ItemList from "../Pages/ItemList";
import provaFetch from "../Pages/provaFetch";
import OrdersPlaced from "../Pages/OrdersPlaced";
import AddItem from "../Pages/AddItem";
import TakeAPicture from "../Pages/TakeAPictureOrVideo";
import UploadPhoto2 from "../Pages/UploadPhoto2";
import Button from "./Button";
import Card from "./Card";


const {width, height} = Dimensions.get('window');
export function HomeScreen({ navigation, route }) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground style={ styles.imgBackground }
                 resizeMode='cover'
                 source={require('./prova.jpg')}>
                <Card style={styles.inputContainer}>
                            <View style={styles.data}>
                                <View style={{flexDirection: 'column'}}>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18, textAlign: 'center'}} numberOfLines={1}>Benvenuto!</Text>
                                        </View>
                                </View>
                                <View style={{flexDirection: 'row'}}>

                                        <View style={styles.bottomButton}>
                                        <Button
                                            text="Accedi / Registrati"
                                            // onPress={() => navigation.navigate('Login', {user_id: "3"})}
                                            onPress={() => navigation.navigate('Login')}
                                        />
                                        </View>
                                </View>
                            </View>
                        </Card>
        </ImageBackground>
    </View>
  );

}


class Hidden extends React.Component {
  render() {
    return null;
  }
}


const Drawer = createDrawerNavigator();
function DrawerNavigator() {
    return (

<NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}}>
        {/*Usati solo per prove*/}
          <Drawer.Screen name="Login" component={Login} screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}}/>
          {/*<Drawer.Screen name="UploadPhoto2" component={UploadPhoto2} />*/}
          {/*<Drawer.Screen name="TakeAPicture" component={TakeAPicture} />*/}
          {/*<Drawer.Screen name="provaFetch" component={provaFetch} />*/}

          {/*<Drawer.Screen name="AddItem" component={AddItem} />*/}
          <Drawer.Screen name="Home2" component={HomeScreen2} />


          <Drawer.Screen name="Home" component={HomeScreen} screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}} />
          <Drawer.Screen name="OrdersPlaced" component={OrdersPlaced} />
          <Drawer.Screen name="RegistrationStackNavigator" component={RegistrationStackNavigator} screenOptions={{ gestureEnabled: false }} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="UserStackNavigator" screenOptions={{ gestureEnabled: false }} component={UserStackNavigator} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="ShopStackNavigator" screenOptions={{ gestureEnabled: false }} component={ShopStackNavigator} options={{headerShown: false, swipeEnabled: false}}/>
          <Drawer.Screen name="ItemList" component={ItemList} />
      </Drawer.Navigator>
</NavigationContainer>

    );

};
const styles = StyleSheet.create({
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center'
    },
    buttonView: {
        width: 100,
        paddingRight: 5,
        paddingLeft: 5,
        marginLeft: 25,
        marginTop: 0,
        marginBottom: -2
  },
    inputContainer: {
        width: '100%',
        paddingBottom: 20,
        paddingTop: 50,
        marginTop: 20,
        marginLeft: 10,
        justifyContent: 'center',
        borderRadius: 50,
        // borderWidth: 2,
        // borderColor: 'black',
    },
    bottomButton: {
        width: 150,
        paddingRight: -5,
        paddingLeft: -5,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: -2,
        textAlign: 'center'
    },
    textTitle: {
        fontWeight: 'bold',
        marginLeft: 50
    },
    data: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 60,
    },
  })

export default DrawerNavigator;


