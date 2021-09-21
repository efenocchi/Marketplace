import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, ToastAndroid } from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
const {width, height} = Dimensions.get('window');

export default class Login extends Component {

    constructor(props){
        super(props);
        this.state ={
            username: "",
            password: "",
            error_message: ""
        }
    }

    fetchUserId() {
        fetch('http://10.110.215.142:5000/api/users/find/' + this.state.username + '/?format=json')
        .then((user_response) => user_response.json())
        .then((user_responseJson) => {

            global.user_id = user_responseJson['results'][0]['user']['id'];
            global.login_negozio = (user_responseJson['results'][0]['login_negozio'] === 'true');
            console.log(global.user_id)
            console.log(global.login_negozio)
        })
        .catch((error) =>{
        console.error(error);
        // this.fetchUserId();
        });
    }

    loginExecute = () => {
        fetch('http://10.110.215.142:5000/api/rest-auth/login/',
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

                    ToastAndroid.show("Bentornato, " + global.username, ToastAndroid.SHORT);


                    this.clearFields();
                    this.props.navigation.goBack(null);
                } else {
                    this.setState({error_message: "Errore: username o password errati."});
                }
            })
            .then(obj =>  {
              callback(obj)
            })
            .catch((error) => {
                // this.loginExecute;
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
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() =>
                            {this.clearFields();
                            this.props.navigation.goBack(null);}} />
                    </View>
                    <Text style={styles.title}>
                        Log in
                    </Text>
                    <View style={styles.rightcontainer}/>
                </View>

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
                                        <Button title="Accedi" onPress={ this.loginExecute } />
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
                                            <Button title="Registrati" onPress={() => {
                                                this.clearFields();
                                                this.props.navigation.navigate('Registrazione');}}/>
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
        flex: 1
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
        marginTop: 9,
        alignItems: 'flex-end'
    }
});

