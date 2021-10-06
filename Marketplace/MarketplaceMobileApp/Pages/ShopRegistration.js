import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput } from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Picker } from 'native-base';
import TakeProvinces from '../components/TakeProvinces';
import TakeRegions from '../components/TakeRegions';

const {width, height} = Dimensions.get('window');




class ShopRegistration extends Component {

    constructor(props){
        super(props);
        this.state ={
            error_message: "",
            username: "",
            password: "",
            conferma_password: "",
            // nome: "",
            // cognome: "",
            // email: "",
            indirizzo: "",
            citta: "",
            codice_postale: "",
            telefono: "",
            // eta: 0,
            // caratteristiche: ""
        }
    }

    fetchUserId() {
         fetch('http://10.110.215.142:5000/api/users/find/' + this.state.username + '/?format=json')
        .then((user_response) => user_response.json())
        .then((user_responseJson) => {
            global.user_id = user_responseJson['results'][0]['user']['id'];
            // global.login_negozio = (user_responseJson['results'][0]['login_negozio'] === true);
        })
        .catch((error) =>{
            console.error(error);
        });
    }

    RegisterUser = () => {
        if (this.state.username !== "" && this.state.password !== "" && this.state.conferma_password !== "" &&
            // this.state.nome !== "" && this.state.cognome !== "" && this.state.email !== "" &&
            this.state.indirizzo !== "" && this.state.citta !== ""
            && this.state.telefono !== "" && this.state.codice_postale !== ""
            // this.state.eta !== "" && this.state.caratteristiche !== ""
            )
            {

                // Se coincidono allora procedo a salvare l'utente
                if (this.state.password === this.state.conferma_password) {

                    fetch('http://10.110.215.142:5000/api/rest-auth/registration/',
                    {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        email: this.state.email,
                        password1: this.state.password,
                        password2: this.state.conferma_password
                    }),
                    })
                    .then(res => res.json())
                    .then((res) => {
                        if (res.key != null) {
                            global.user_key = res.key;
                            global.logged_in = true;
                            global.username = this.state.username;
                            this.fetchUserId();
                            this.RegisterShop();
                        } else {
                            this.setState({error_message: "Errore: " + JSON.stringify(res)});
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        // this.RegisterUser;
                    })
            }
                // se le password non corrispondono
                else {
                this.setState({error_message: "Errore: i campi Password e Conferma password non coincidono."});
            }
        }
        // se qualche parametro non è stato settato
        else {
        this.setState({error_message: "Errore: assicurati di riempire tutti i campi."});
        }
    }

    RegisterShop = () => {
        global.login_negozio = true

        fetch('http://10.110.215.142:5000/api/users/register/shopuser/',
        {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + global.user_key,
        },
        body: JSON.stringify({

            user: {
                username: this.state.username,
                // first_name: this.state.nome,
                // last_name: this.state.cognome

            },

            indirizzo: this.state.indirizzo,
            citta: this.state.citta,
            provincia: global.provincia,
            regione: global.regione,
            login_negozio: global.login_negozio,
            telefono: this.state.telefono,
            codice_postale: this.state.codice_postale,
            // foto_profilo: null,

            // eta: this.state.eta,
            // caratteristiche: this.state.caratteristiche,
        }),
        })
        .then(res => res.json())
        .then((res) => {
            console.log("Registrazione ShopUser")
            console.log(res.user.id)
            if (res.user.id != null) {
                this.clearFields();
                this.props.navigation.navigate("Registration");
            } else {
                this.setState({error_message: "Errore: " + JSON.stringify(res)});
            }
        })
        .catch((error) => {
            this.setState({error_message: "Errore: " + error});
            console.error(error);
            console.error("errore nel registrare un normal user");
            console.log("this.state.indirizzo",this.state.indirizzo)
            console.log("this.state.citta",this.state.citta)
            console.log("global.provincia",global.provincia)
            console.log("global.regione",global.regione)
            console.log("global.login_negozio",global.login_negozio)


            // this.RegisterNormalUser;
        })
    }

    clearFields = () => {
        this.setState({error_message: "",
            username: "",
            password: "",
            conferma_password: "",
            // nome: "",
            // cognome: "",
            // email: "",
            indirizzo: "",
            citta: "",
            codice_postale: "",
            telefono: "",
            // eta: "",
            // caratteristiche: ""
        });

        this.txtUsername.clear();
        this.txtPassword.clear();
        this.txtConfermaPassword.clear();
        // this.txtNome.clear();
        // this.txtCognome.clear();
        // this.txtEmail.clear();
        this.txtIndirizzo.clear();
        this.txtCitta.clear();
        this.txtCodicePostale.clear();
        this.txtTelefono.clear();
        // this.txtEta.clear();
        // this.txtCaratteristiche.clear();
    }

    render() {
        return (

            <View style={styles.screen}>
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                    </View>
                    <Text style={styles.title}>
                        Registra un account professionale
                    </Text>
                    <View style={styles.rightcontainer}></View>
                    </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                            <View style={styles.data}>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Username:</Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Password: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Conferma password: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Nome: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Cognome: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Email: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Indirizzo: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Città: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Provincia: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Regione: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Codice Postale: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>

                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Telefono: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Età: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Caratteristiche: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
                                    </View>

                                    <View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtUsername = input }}
                                            onChangeText={(value) => this.setState({username: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95} secureTextEntry={true}
                                            ref={input => { this.txtPassword = input }}
                                            onChangeText={(value) => this.setState({password: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95} secureTextEntry={true}
                                            ref={input => { this.txtConfermaPassword = input }}
                                            onChangeText={(value) => this.setState({conferma_password: value})}/>
                                        </View>
                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtNome = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({nome: value})}/>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtCognome = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({cognome: value})}/>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtEmail = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({email: value})}/>*/}
                                        {/*</View>*/}
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtIndirizzo = input }}
                                            onChangeText={(value) => this.setState({indirizzo: value})}/>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtCitta = input }}
                                            onChangeText={(value) => this.setState({citta: value})}/>
                                        </View>
                                        <TakeProvinces/>
                                        <TakeRegions/>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtCodicePostale = input }}
                                            onChangeText={(value) => this.setState({codice_postale: value})}/>
                                        </View>

                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtTelefono = input }}
                                            onChangeText={(value) => this.setState({telefono: value})}/>
                                        </View>

                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtEta = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({eta: value})}/>*/}
                                        {/*</View>*/}
                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtCaratteristiche = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({caratteristiche: value})}/>*/}
                                        {/*</View>*/}
                                    </View>
                                </View>

                                <View style={styles.controlli}>
                                    <View style={styles.buttonview}>
                                        <Button title="Registrati" onPress={() => {
                                            this.RegisterUser();}} />
                                    </View>
                                </View>

                                <View style={{paddingTop: 10}}></View>
                                <Text style={{color: 'red'}}>{this.state.error_message}</Text>
                                <View style={{paddingTop: 10}}></View>

                                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 5}}>
                                    <Text>I campi contrassegnati con</Text>
                                    <Text style={styles.asteriskStyle}>*</Text>
                                    <Text>sono obbligatori.</Text>
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
        marginVertical: 10,
        marginLeft: 20
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
        paddingLeft: 10
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
    asteriskStyle: {
        marginLeft: 3,
        marginRight: 3,
        color: 'red'
    },
    picker: {
        marginLeft: 10,
        width: width - width / 2,
        height: 28,
        backgroundColor: '#e7e7e7',
        marginBottom: 3,
        marginTop: 3
    },
    pickerItem: {
        color: 'white'
    }
});

export default ShopRegistration;