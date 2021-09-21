import React, { Component } from 'react';
import { Text, View, SafeAreaView, ScrollView, Image, Button } from 'react-native';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { Icon } from 'native-base';
import { Dimensions } from 'react-native';
import ObjectList from '../Pages/ObjectList';
import InsertItem from '../Pages/InsertItem';

import ContactUs from '../Pages/ContactUs';
import Login from '../Pages/Login';
import Logout from '../Pages/Logout';
import logo from '../assets/favicon.png';

import RegistrationStackNavigator from './RegistrationStackNavigator';
import ItemStackNavigator from './ItemStackNavigator';
import PersonalProfileStackNavigator from './PersonalProfileStackNavigator';
import UserProfileStackNavigator from './UserProfileStackNavigator';



const {width, height} = Dimensions.get('window');

// const hiddenDrawerItems = ['NestedDrawerNavigator'];

// navigation drawer che può essere aperto o chiuso con un gesto
const CustomDrawerNavigation = (props) => {

    var label_utente = "";
    if (!global.logged_in) {
      label_utente = "Utente anonimo";
    } else {
      label_utente = global.username;
    }

    return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ height: 250, backgroundColor: '#cfe3f3', opacity: 0.9 }}>
        <View style={{ height: 200, backgroundColor: 'Green', alignItems: 'center', justifyContent: 'center' }}>
          <Image source={require('../assets/imageMarketplace.jpg')} style={{ height: 150, width: 150, borderRadius: 60 }} />
        </View>
        <View style={{ height: 50, backgroundColor: 'Green', alignItems: 'center', justifyContent: 'center' }}>
        <Text>{label_utente}</Text>
        </View>
      </View>
      <ScrollView>
        <DrawerItems {...props}/>
      </ScrollView>
      <View style={{ alignItems: "center", backgroundColor: '#e7e7e7' }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={logo} style={{ width: 25, height: 25 }}  />
          <Text style={{paddingTop: 2, fontFamily: 'typold-medium', color: '#7e7777'}}> Fenocchi, Neri</Text>
          <Text style={{paddingTop: 3, color: '#7e7777'}}> - 2020</Text>
        </View>
      </View>
    </SafeAreaView>
    );
  }

const Drawer = createDrawerNavigator({
    // ObjectList: {
    //     screen: ObjectList,
    //     navigationOptions: {
    //     title: 'Oggetti',
    //     drawerIcon: ({ tintColor }) => (
    //         <Icon name = "md-clipboard" />
    //       )
    //     }
    //
    // },
    // InsertItem: {
    //     screen: InsertItem,
    //     navigationOptions: ({navigation}) => {
    //       if(!global.logged_in) {
    //         return {
    //           drawerLabel: () => null
    //         }
    //       } else {
    //         return {
    //           title: 'Inserisci oggetto',
    //           drawerIcon: ({ tintColor }) => (
    //             <Icon name = "md-add" />
    //           )
    //         }
    //       }
    //     }
    // },


    // PersonalProfile: {
    //   screen: PersonalProfileStackNavigator,
    //   navigationOptions: ({navigation}) => {
    //     if(!global.logged_in) {
    //       return {
    //         drawerLabel: () => null
    //       }
    //     } else {
    //       return {
    //         title: 'Profilo',
    //         drawerIcon: ({ tintColor }) => (
    //           <Icon name = "md-person" />
    //         )
    //       }
    //     }
    //   }
    // },

    // Cassa: {
    //     screen: Cassa,
    //     navigationOptions: ({navigation}) => {
    //       if(!global.logged_in) {
    //         return {
    //           drawerLabel: () => null
    //         }
    //       } else {
    //         return {
    //           title: 'Cassa',
    //           drawerIcon: ({ tintColor }) => (
    //             <Icon name = "md-cart" />
    //           )
    //         }
    //       }
    //     }
    // },
    //     ContactUs: {
    //         screen: ContactUs,
    //         navigationOptions: ({navigation}) => {
    //             if(!global.logged_in) {
    //                 return {
    //                     drawerLabel: () => null
    //                 }
    //             } else {
    //                 return {
    //                     title: 'Contattaci',
    //                     drawerIcon: ({ tintColor }) => (
    //                         <Icon name = "md-mail" />
    //                     )
    //                 }
    //             }
    //         }
    //     },

    //     RegistrationStackNavigator: {
    //   screen: RegistrationStackNavigator,
    //     navigationOptions: ({navigation}) => {
    //       if(global.logged_in) {
    //         return {
    //           drawerLabel: () => null
    //         }
    //       } else {
    //         return {
    //           title: 'Registrazione',
    //           drawerIcon: ({ tintColor }) => (
    //             <Icon name = "md-person-add" />
    //           )
    //         }
    //       }
    //     }
    // },
        Login: {
        screen: Login,
        navigationOptions: ({navigation}) => {
          if(global.logged_in) {
            return {
              drawerLabel: () => null
            }
          } else {
            return {
              title: 'Login',
              drawerIcon: ({ tintColor }) => (
                <Icon name = "md-power" />
              )
            }
          }
        }
    },
//     Logout: {
//       screen: Logout,
//       navigationOptions: ({navigation}) => {
//         if(!global.logged_in) {
//           return {
//             drawerLabel: () => null
//           }
//         } else {
//           return {
//             title: 'Logout',
//             drawerIcon: ({ tintColor }) => (
//               <Icon name = "md-power" />
//             )
//           }
//         }
//       }
//     },
//     ItemStackNavigator: {
//       screen: ItemStackNavigator,
//       navigationOptions: ({navigation}) => {
//             return {
//               drawerLabel: () => null,
//           }
//       }
//     },
//     UserProfileStackNavigator: {
//       screen: UserProfileStackNavigator,
//       navigationOptions: ({navigation}) => {
//             return {
//               drawerLabel: () => null,
//           }
//       }
//     }
},
{
    drawerPosition: 'left',
    contentComponent: CustomDrawerNavigation,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    drawerWidth: (width / 3) * 2,
});

export default Drawer;