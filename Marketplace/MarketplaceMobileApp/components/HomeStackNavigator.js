import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ItemList from "../Pages/ItemList";
import ItemDetailPage from "../Pages/ItemDetailPage";

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

      </Stack.Navigator>
  );
}
