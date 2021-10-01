import React, { Component, useContext } from 'react';
import {Button, SafeAreaView, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import UserInfoModify from "./UserInfoModify"
import OrdersPlaced from "./OrdersPlaced"
import FeedbackUser from "./FeedbackUser"
import CheckItemsBought from "./CheckItemsBought"
import ReadOrLeaveFeedBackItem from "./ReadOrLeaveFeedBackItem"



export class ChooseUserInfoList extends Component{
    render(){
        return(

            <SafeAreaView style={styles.container}>
            <View>
                <Button
                title="Ordini effettuati"
                onPress={() => this.props.navigation.navigate('OrdersPlaced')}
                />
            </View>
            <View>
                <Button
                title="Recensioni ricevute"
                onPress={() => this.props.navigation.navigate('FeedbackUser')}
                />
            </View>
            <View>
                <Button
                title="Modifica informazioni utente"
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

            <Stack.Navigator initialRouteName="ChooseUserInfoList">
                <Stack.Screen name="ChooseUserInfoList" component={ChooseUserInfoList}/>
                <Stack.Screen name="UserInfoModify" component={UserInfoModify}/>
                <Stack.Screen name="OrdersPlaced" component={OrdersPlaced}/>
                <Stack.Screen name="FeedbackUser" component={FeedbackUser}/>

                {/*Controllo gli oggetti che ho acquistato dopo aver cliccato su un ordine già effettuato
                Se voglio posso lasciare una recensione a quello che ho acquistato*/}
                <Stack.Screen name="CheckItemsBought" component={CheckItemsBought}/>

                <Stack.Screen name="ReadOrLeaveFeedBackItem" component={ReadOrLeaveFeedBackItem}/>

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