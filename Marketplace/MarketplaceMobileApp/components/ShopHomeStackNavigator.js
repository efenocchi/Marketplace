import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ItemList from "../Pages/ItemList";
import ModifyItem from "../Pages/ModifyItem";
import ShopItemList from "../Pages/ShopItemList";

const Stack = createStackNavigator();

export default function ShopHomeStackNavigator()  {
  return (
      <Stack.Navigator >
        <Stack.Screen
            component={ShopItemList}
            name="ItemList"
            options={{
                title:'Gestione prodotti'
            }}
        />

        <Stack.Screen
            component={ModifyItem} screenOptions={{headerShown: false}}
            name="ModifyItem"
            options={{
                headerShown: false,
            }}
        />
      </Stack.Navigator>
  );
}
