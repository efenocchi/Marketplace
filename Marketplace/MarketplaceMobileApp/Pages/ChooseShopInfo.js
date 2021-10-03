import React, { Component, useContext } from 'react';
import {Button, SafeAreaView, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import UserInfoModify from "./UserInfoModify"
import OrdersReceived from "./OrdersReceived"
import CheckReservationMade from "./CheckReservationMade"


// Serve solo per visualizzare i bottoni con i quali si andrà nelle varie schermate
export class ChooseShopInfoList extends Component{
    render(){
        return(

            <SafeAreaView style={styles.container}>
            <View>
                <Button
                title="Ordini ricevuti"
                onPress={() => this.props.navigation.navigate('OrdersReceived')}
                />
            </View>
            <View>
                <Button
                title="Valutazione negozio" //posso visualizzare le recensioni che mi hanno lasciato
                // onPress={() => this.props.navigation.navigate('FeedbackShop')}
                />
            </View>
            <View>
                <Button
                title="Modifica informazioni profilo"
                onPress={() => this.props.navigation.navigate('UserInfoModify')}
                />
            </View>
            </SafeAreaView>

        );

    }
}

const Stack = createStackNavigator();
export default class ChooseUserInfo extends Component {

    render(){
        return(

            <Stack.Navigator initialRouteName="ChooseShopInfoList">
                <Stack.Screen name="ChooseShopInfoList" component={ChooseShopInfoList}/>
                <Stack.Screen name="UserInfoModify" component={UserInfoModify}/>
                <Stack.Screen name="OrdersReceived" component={OrdersReceived}/>
                <Stack.Screen name="CheckReservationMade" component={CheckReservationMade}/>

                {/*<Stack.Screen name="FeedbackShop" component={FeedbackShop}/>*/}

                {/*<Stack.Screen name="CheckItemsBought" component={CheckItemsBought}/>*/}

                {/*<Stack.Screen name="ReadOrLeaveFeedBackToCustomer" component={ReadOrLeaveFeedbackItem}/>*/}

            </Stack.Navigator>

        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});