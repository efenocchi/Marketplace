import {Button, Text, View} from "react-native";
import React, {Component} from "react";

export default class HomeScreen2 extends Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Home Screen</Text>
                <Button
                    title="ABBIAMO APPENA EFFETTUATO UNA REGISTRAZIONE"
                    onPress={() => this.props.navigation.navigate('Registration')}
                />
            </View>
        );
    }
}