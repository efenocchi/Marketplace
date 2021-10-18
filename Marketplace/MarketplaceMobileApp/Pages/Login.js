import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TextInput, ToastAndroid, Platform} from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
const {width, height} = Dimensions.get('window');
import Toast from 'react-native-root-toast';
import Button from "../components/Button";


export default class Login extends Component {
    name=""

    constructor(props){
        super(props);
        this.state ={
            username: "",
            password: "",
            error_message: ""
        }
    }


    fetchUserId() {
        fetch('http://'+ global.ip +'/api/users/find/' + this.state.username + '/?format=json')
        .then((user_response) => user_response.json())
        .then((user_responseJson) => {

            global.user_id = user_responseJson['results'][0]['user']['id'];
            global.login_negozio = (user_responseJson['results'][0]['login_negozio'] === true);
            console.log("sto stampando l'id dal fetch")
            console.log(global.user_id)
            console.log(global.login_negozio)
            // this.props.navigation.reset({
            // routes: [{ name: "UserStackNavigator" }]
            // });
            if(global.login_negozio === true) {
                this.props.navigation.navigate('ShopStackNavigator');
            }
            else {
                this.props.navigation.navigate('UserStackNavigator');
            }

        })
        .catch((error) =>{
        console.error(error);
        // this.fetchUserId();
        });


    }

    changeScreen = () => {
        console.log("sono in changeScreen")
    }
    loginExecute = () => {

        fetch('http://'+ global.ip +'/api/rest-auth/login/',
            {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,

              }),
            })
            .then(res => res.json())
            .then((res) => {
                if(res.key != null) {
                    global.user_key = res.key;
                    global.logged_in = true;
                    global.username = this.state.username;
                    this.fetchUserId();
                    this.changeScreen();

                    Toast.show("Bentornato, " + global.username, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.BOTTOM,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                    console.log("sto stampando l'id dopo il login")
                    console.log(global.user_id)

                } else {
                    this.setState({error_message: "Errore: username o password errati."});
                }
            })
            .then(obj =>  {
            })
            .catch((error) => {
                console.log(error)
            })

    }

    clearFields = () => {
        this.setState({username: ""});
        this.setState({password: ""});
        this.setState({error_message: ""});
        this.txtUsername.clear();
        this.txtPassword.clear();
    }

    render() {

        return (

            <View style={styles.screen}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                            <View style={styles.data}>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Username:</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Password: </Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                ref={input => { this.txtUsername = input }}
                                                onChangeText={(value) => this.setState({username: value})}
                                            />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95} secureTextEntry={true}
                                                ref={input => { this.txtPassword = input }}
                                                onChangeText={(value) => this.setState({password: value})} />
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.controlli}>
                                    <View style={styles.buttonview}>
                                    <Button
                                        text={'Login'}
                                        onPress={() => {
                                            this.loginExecute();
                                        }}
                                    />
                                    </View>
                                </View>

                                <View style={{paddingTop: 10}}/>
                                <Text style={{color: 'red'}}>{this.state.error_message}</Text>
                                <View style={{paddingTop: 10}}/>
                                <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: width - (width * 10 / 100)}}/>
                                <View style={{paddingTop: 25}}/>

                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={styles.bottomTitle}>
                                            <Text style={styles.textTitle}>Non hai un account?</Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.bottomButton}>
                                        <Button
                                            text={'Registrati'}
                                            onPress={() => {
                                                this.clearFields();
                                                this.props.navigation.navigate('RegistrationStackNavigator');
                                            }}
                                        />
                                        </View>
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
    buttonview: {
        width: 110,
        paddingRight: 5,
        paddingLeft: 5
    },
    inputContainer: {
        marginTop: height/4,
        minWidth: '96%'
    },
    controlli: {
        paddingTop: 20,
        paddingRight: 5,
        alignItems: 'center'
    },
    data: {
        paddingTop: 20,
        alignItems: 'center'
    },
    entryTitle: {
        marginBottom: 5,
        marginTop: 9,
        flexDirection: 'row'
    },
    textTitle: {
        fontWeight: 'bold'
    },
    textContainer: {
        borderWidth: 1,
        height: 28,
        width: width - width / 2,
        marginLeft: 10,
        marginBottom: 3,
        marginTop: 3
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
    }
});