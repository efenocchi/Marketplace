import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ItemList from "../Pages/ItemList";
import ItemDetailPage from "../Pages/ItemDetailPage";
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
            component={ItemDetailPage}
            name="ItemDetailPage"
        />
      </Stack.Navigator>
  );
}
