import {Button, Text, View} from "react-native";
import React, {Component} from "react";
import { NavigationContainer } from '@react-navigation/native';
import {NavigationActions as navigation} from "react-navigation";



global.value = ""

export default class HomeScreen2 extends Component {
      user_id = "";

      constructor(props){
        super(props);
        this.state ={
            username: "",
            password: "",
            error_message: ""
        }
      }


    render(){
        // HomeScreen12({navigation, route})
       // const { user_id } = this.props;
       // console.log({user_id})

        return (
                 // <Text>Inviti di {this.props.route.params.user_id}</Text>


         <Button
        title="Go to Login"
        onPress={() => this.props.navigation.navigate('Login', {user_id: 'parametro passato1'})}
        // onPress={() => navigation.navigate('Home2')}
        />
        );
    }
}

// function fetch(){
//     console.log("fetch fatto")
//
// }
//
// export default function HomeScreen2({ navigation, route }) {
//     // const {user_id} = route.params;
//
//     fetch()
//     // global.value = {user_id}
//     return (
//         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//             <Text>Home Screen</Text>
//
//             <Button
//
//                 // title={user_id}
//                 title="{user_id}"
//                 onPress={() => navigation.navigate('Home')}
//                 // onPress={() => navigation.navigate('Login')}
//             />
//
//
//         </View>
//     );
// }