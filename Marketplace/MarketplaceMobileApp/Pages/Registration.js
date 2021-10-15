import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import CustomHeader from '../components/Header';
import { IconButton } from 'react-native-paper';
import Card from '../components/Card';
import Button from "../components/Button";

const {width, height} = Dimensions.get('window');

export default class Registration extends Component {
    name = ""
    render() {


        return (
            <View style={styles.screen}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                        <Text style={styles.title}> Registrati come: </Text>
                            <View style={styles.buttonStyle}>
                                <Button text="Utente" onPress={() => this.props.navigation.navigate('NormalUserRegistration')} />
                            </View>
                            <View style={styles.buttonStyle}>
                                <Button text="Negozio" onPress={() => this.props.navigation.navigate('ShopRegistration')}/>
                            </View>

                            <View style={{paddingTop: 15}}/>
                            <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: width - (width * 10 / 100)}}/>
                            <View style={{paddingTop: 25}}/>

                            <View style={{flexDirection: 'row'}}>
                                <View>
                                    <View style={styles.bottomTitle}>
                                        <Text style={styles.textTitle}>Hai già un account?</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={styles.bottomButton}>
                                       <Button
                                            text={'Login'}
                                            onPress={() => {
                                                this.props.navigation.navigate('Login');
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                        </Card>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'gray'
    },
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    inputContainer: {
        marginTop: height/4,
        minWidth: '96%'
    },
    buttonStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        width: 200
    },
    bottomButton: {
        width: 110,
        paddingRight: 5,
        paddingLeft: 10,
        paddingBottom: 10
    },
    bottomTitle: {
        marginBottom: 25,
        marginTop: 17,
        alignItems: 'flex-end'
    },
    textTitle: {
        fontWeight: 'bold'
    }
});