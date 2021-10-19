import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {Picker} from 'native-base';

const {width, height} = Dimensions.get('window');

export default class TakeRegions extends Component {

    state = {
        regione: global.regione
    };

    render() {
        return (
            <Picker
                style={styles.picker} itemStyle={styles.pickerItem}
                selectedValue={this.state.regione}
                onValueChange={(itemValue) => {global.regione = itemValue;
                    this.setState({regione: global.regione})}}
                >
                <Picker.Item label="Abruzzo" value="Abruzzo" />
                <Picker.Item label="Basilicata" value="Basilicata" />
                <Picker.Item label="Calabria" value="Calabria" />
                <Picker.Item label="Campania" value="Campania" />
                <Picker.Item label="Emilia-Romagna" value="Emilia-Romagna" />
                <Picker.Item label="Friuli-Venezia-Giulia" value="Friuli-Venezia-Giulia" />
                <Picker.Item label="Lazio" value="Lazio" />
                <Picker.Item label="Liguria" value="Liguria" />
                <Picker.Item label="Lombardia" value="Lombardia" />
                <Picker.Item label="Marche" value="Marche" />
                <Picker.Item label="Molise" value="Molise" />
                <Picker.Item label="Piemonte" value="Piemonte" />
                <Picker.Item label="Puglia" value="Puglia" />
                <Picker.Item label="Sardegna" value="Sardegna" />
                <Picker.Item label="Sicilia" value="Sicilia" />
                <Picker.Item label="Toscana" value="Toscana" />
                <Picker.Item label="Trentino-Alto-Adige" value="Trentino-Alto-Adige" />
                <Picker.Item label="Umbria" value="Umbria" />
                <Picker.Item label="Valle d'Aosta" value="Valle d'Aosta" />
                <Picker.Item label="Veneto" value="Veneto" />
            </Picker>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        marginLeft: 17,
        marginRight: 100,
        width: width - width / 2,
        backgroundColor: '#e7e7e7',
        marginBottom: 5,
        marginTop: 0,
    },
    pickerItem: {
        color: 'white',
    }
});