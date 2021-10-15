import React, { Component, useContext } from 'react';
import {SafeAreaView, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import UserInfoModify from "./UserInfoModify"
import OrdersPlaced from "./OrdersPlaced"
import FeedbackUser from "./FeedbackUser"
import CheckItemsBought from "./CheckItemsBought"
import ReadOrLeaveFeedbackItem from "./ReadOrLeaveFeedbackItem"
import ItemsRelatedToOneShopAndOneOrder from "./ItemsRelatedToOneShopAndOneOrder"
import Button from "../components/Button";


export class ChooseUserInfoList extends Component{
    render(){
        return(

            <SafeAreaView style={styles.container}>
            <View>
                <Button
                text="Ordini effettuati"
                onPress={() => this.props.navigation.navigate('OrdersPlaced')}
                />
            </View>
            <View>
                <Button
                text="Recensioni ricevute"
                onPress={() => this.props.navigation.navigate('FeedbackUser')}
                />
            </View>
            <View>
                <Button
                text="Modifica informazioni utente"
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
                <Stack.Screen name="ChooseUserInfoList" component={ChooseUserInfoList} options={{headerShown: false}}/>
                <Stack.Screen name="UserInfoModify" component={UserInfoModify} options={{headerShown: false}}/>
                <Stack.Screen name="OrdersPlaced" component={OrdersPlaced} options={{headerShown: false}}/>
                <Stack.Screen name="FeedbackUser" component={FeedbackUser} options={{headerShown: false}}/>
                <Stack.Screen name="ItemsRelatedToOneShopAndOneOrder" component={ItemsRelatedToOneShopAndOneOrder} options={{headerShown: false}}/>

                {/*Controllo gli oggetti che ho acquistato dopo aver cliccato su un ordine già effettuato
                Se voglio posso lasciare una recensione a quello che ho acquistato*/}
                <Stack.Screen name="CheckItemsBought" component={CheckItemsBought} options={{headerShown: false}}/>

                <Stack.Screen name="ReadOrLeaveFeedbackItem" component={ReadOrLeaveFeedbackItem} options={{headerShown: false}}/>

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