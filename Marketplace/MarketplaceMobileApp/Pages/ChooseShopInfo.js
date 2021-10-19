import React, { Component, useContext } from 'react';
import {SafeAreaView, View, StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import UserInfoModify from "./UserInfoModify"
import OrdersReceived from "./OrdersReceived"
import CheckReservationMade from "./CheckReservationMade"
import LeaveOrReadReviewToCustomer from "./LeaveOrReadReviewToCustomer"
import FeedbackShop from "./FeedbackShop"
import AddItem from "./AddItem"
import Button from "../components/Button";
import ModifyItem from "./ModifyItem";
import Logout from "../Pages/Logout"

// Serve solo per visualizzare i bottoni con i quali si andrà nelle varie schermate
export class ChooseShopInfoList extends Component{
    render(){
        return(

            <SafeAreaView style={styles.container}>
            <View>
                <Button
                text="Ordini ricevuti"
                onPress={() => this.props.navigation.navigate('OrdersReceived')}
                />
            </View>
            <View>
                <Button
                text="Valutazione negozio" //posso visualizzare le recensioni che mi hanno lasciato
                onPress={() => this.props.navigation.navigate('FeedbackShop')}
                />
            </View>
            <View>
                <Button
                text="Modifica informazioni profilo"
                onPress={() => this.props.navigation.navigate('UserInfoModify')}
                />
            </View>
            <View>
                <Button
                text="Logout"
                onPress={() => this.props.navigation.navigate('Logout')}
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

            <Stack.Navigator initialRouteName="ChooseShopInfoList" screenOptions={{headerShown: false}}>
                <Stack.Screen name="ChooseShopInfoList" component={ChooseShopInfoList} screenOptions={{headerShown: false}}/>
                <Stack.Screen name="UserInfoModify" component={UserInfoModify} screenOptions={{headerShown: false}}/>
                <Stack.Screen name="OrdersReceived" component={OrdersReceived} screenOptions={{headerShown: false}}/>
                <Stack.Screen name="CheckReservationMade" component={CheckReservationMade} screenOptions={{headerShown: false}}/>
                <Stack.Screen name="LeaveOrReadReviewToCustomer" component={LeaveOrReadReviewToCustomer} screenOptions={{headerShown: false}}/>

                <Stack.Screen name="FeedbackShop" component={FeedbackShop}/>

                {/*<Stack.Screen name="CheckItemsBought" component={CheckItemsBought}/>*/}

                {/*<Stack.Screen name="ReadOrLeaveFeedBackToCustomer" component={ReadOrLeaveFeedbackItem}/>*/}
                <Stack.Screen name="Logout" component={Logout} options={{headerShown: false}}/>
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