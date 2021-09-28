import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, Dimensions } from 'react-native';
import CustomHeader from '../components/Header';
import { IconButton } from 'react-native-paper';
import Card from '../components/Card';

const {width, height} = Dimensions.get('window');

export default class Registration extends Component {
    name = ""
    render() {
        // this.name = this.props.route.params.user_id

        return (
            <View style={styles.screen}>
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                    </View>
                    <Text style={styles.title}>
                        Registrazione
                    </Text>
                    <View style={styles.rightcontainer}></View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>

                            <View style={styles.buttonStyle}>
                                <Button title="Account personale" onPress={() => this.props.navigation.navigate('NormalUserRegistration')} />
                            </View>
                            <View style={styles.buttonStyle}>
                                <Button title="Account professionale" onPress={() => this.props.navigation.navigate('ShopRegistration')}/>
                            </View>

                            <View style={{paddingTop: 15}}></View>
                            <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: width - (width * 10 / 100)}}></View>
                            <View style={{paddingTop: 25}}></View>

                            <View style={{flexDirection: 'row'}}>
                                <View>
                                    <View style={styles.bottomTitle}>
                                        <Text style={styles.textTitle}>Hai già un account?</Text>
                                    </View>
                                </View>

                                <View>
                                    <View style={styles.bottomButton}>
                                        <Button title="Login" onPress={() => this.props.navigation.navigate('Login')}/>
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
        flex: 1
    },
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    contentbar: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
    leftcontainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rightcontainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    inputContainer: {
        minWidth: '96%'
    },
    buttonStyle: {
        padding: 15,
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
        marginTop: 9,
        alignItems: 'flex-end'
    },
    textTitle: {
        fontWeight: 'bold'
    }
});

