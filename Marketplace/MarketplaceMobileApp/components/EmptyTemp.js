import React, { Component, useContext } from 'react';
import { Text} from 'react-native';


export default class EmptyTemp extends Component {
    user_id = -1;

    // componentDidMount() {
    //     this.user_id = this.props.route.params.user_id;
    //     console.log("stampa di this.user_id")
    // }

    stampa_user_id() {
        console.log("siamo in Empty temp")
        console.log(global.user_id)
        // console.log(this.user_id)
    }

    render() {
        this.stampa_user_id()

        return (

                <Text>Bentornato {global.user_id}</Text>

        );

    }
}
