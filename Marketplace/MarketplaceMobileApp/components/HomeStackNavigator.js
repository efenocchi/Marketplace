import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ItemList from "../Pages/ItemList";
import ItemDetailPage from "../Pages/ItemDetailPage";
import ShowShop from "../Pages/ShowShop";
import LeaveShowReviewShop from "../Pages/LeaveShowReviewShop";
import LeaveOrReadReviewToShop from "../Pages/LeaveOrReadReviewToShop";

const Stack = createStackNavigator();

export default function HomeStackNavigator()  {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}}>

         <Stack.Screen
            component={ItemList}
            name="ItemList"
            options={{title:'ItemList'}}
        />

        <Stack.Screen
            component={ItemDetailPage}
            name="ItemDetailPage"
        />

        <Stack.Screen
            component={ShowShop}
            name="ShowShop"
        />

        <Stack.Screen
            component={LeaveShowReviewShop}
            name="LeaveShowReviewShop"
        />

        <Stack.Screen
            component={LeaveOrReadReviewToShop}
            name="LeaveOrReadReviewToShop"
        />


      </Stack.Navigator>
  );
}
