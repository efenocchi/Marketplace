import React, { Component, useContext } from 'react';
import { Dimensions, ActivityIndicator } from 'react-native';
import {View, Text, StyleSheet, Button, Image, TextInput, ToastAndroid, Platform} from 'react-native';
import CustomHeader from "../components/Header";
import {IconButton} from "react-native-paper";
import {ScrollView} from "react-native-gesture-handler";
import Card from "../components/Card";
import TakeProvinces from "../components/TakeProvinces";
import TakeRegions from "../components/TakeRegions";
const {width, height} = Dimensions.get('window');


export default class UserInfoModify extends Component {

    //Chiamo il costruttore che inizializza tutti i campi
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
                // telefono: "",
                // eta: 0,
                // caratteristiche: ""
            }
    }

    //La funzione "componentDidMount" viene chiamata dopo che il componente è montato
    componentDidMount() {
        this.fetchProfilo();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });
            this.fetchProfilo();
          }
        );
    }

    // Effettua tutte le necessarie operazioni di pulizia in questo metodo, come la cancellazione di timer,
    // richieste di rete o sottoscrizioni precedentemente create in componentDidMount().
    // componentWillUnmount() {
    //     this.willFocusSubscription.remove();
    // }

   // Vado  a prendere le info del profilo dell'id che ho settato precedentemente
   fetchProfilo() {
        const arrFinal = [];
    return fetch('http://'+ global.ip +'/api/users/profile/' + global.user_id + '/?format=json')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                username: responseJson.user.username,
                indirizzo: responseJson.indirizzo,
                // nome: responseJson.user.first_name,
                // cognome: responseJson.user.last_name,
                // email: responseJson.user.email,
                // sesso: responseJson.sesso,
                citta: responseJson.citta,
                codice_postale: responseJson.codice_postale,
                isLoading: false,

            // telefono: responseJson.telefono,
            // data_nascita: responseJson.data_nascita,
            }, function () {

            });

            global.provincia = responseJson.provincia;
            global.regione = responseJson.regione;


            if (global.login_negozio === true) {
                this.setState({
                    telefono: responseJson.telefono,
            }, function(){

            });
        }
        // Se non è un negozio allora
        //  else {
        //     this.setState({
        //         descrizione: responseJson.descrizione,
        //         hobby: responseJson.hobby
        //     }, function(){
        //
        //     });
        // }

        })
        .catch((error) => {
            console.error(error)
        });
    }


    modifyNormalProfile = () => {
                if (this.state.username !== "" && this.state.password !== "" && this.state.conferma_password !== "" &&
            // this.state.nome !== "" && this.state.cognome !== "" && this.state.email !== "" &&
            this.state.indirizzo !== "" && this.state.citta !== ""
            // && this.state.telefono !== "" && this.state.codice_postale !== ""
            // this.state.eta !== "" && this.state.caratteristiche !== ""
            )
            {

            if (this.state.password === this.state.conferma_password) {
                fetch('http://'+ global.ip +'/api/users/profile/',
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
                        password: this.state.password,
                        // first_name: this.state.nome,
                        // last_name: this.state.cognome,
                        // email: this.state.email
                    },
                    indirizzo: this.state.indirizzo,
                    citta: this.state.citta,
                    provincia: global.provincia,
                    regione: global.regione,
                    codice_postale: this.state.codice_postale,
                }),
                })
                .then(res => res.json())
                .then((res) => {
                    if (res.user.id != null) {
                        global.username = this.state.username;

                        this.clearFields();
                        this.props.navigation.navigate("Home");
                    } else {
                        this.setState({error_message: "Errore: " + JSON.stringify(res)});
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
            }
        }
    }

modifyShopProfile = () => {
                if (this.state.username !== "" && this.state.password !== "" && this.state.conferma_password !== "" &&
            // this.state.nome !== "" && this.state.cognome !== "" && this.state.email !== "" &&
            this.state.indirizzo !== "" && this.state.citta !== ""
            && this.state.telefono !== "" && this.state.codice_postale !== ""
            // this.state.eta !== "" && this.state.caratteristiche !== ""
            )
            {
            console.log("Sono entrato")
            if (this.state.password === this.state.conferma_password) {
                console.log("Stesse password")
                fetch('http://'+ global.ip +'/api/users/profile/',
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
                        password: this.state.password,
                        // first_name: this.state.nome,
                        // last_name: this.state.cognome,
                        // email: this.state.email
                    },
                    indirizzo: this.state.indirizzo,
                    citta: this.state.citta,
                    provincia: global.provincia,
                    regione: global.regione,
                    telefono: this.state.telefono,
                    codice_postale: this.state.codice_postale,
                }),
                })
                .then(res => res.json())
                .then((res) => {
                    if (res.user.id != null) {
                        global.username = this.state.username;

                        this.clearFields();
                        this.props.navigation.navigate("Home");
                    } else {
                        this.setState({error_message: "Errore: " + JSON.stringify(res)});
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
            }
        }
                else{

                    console.log("Non è entrato")
                }
    }



    clearFields = () => {
        this.setState({error_message: "",
            // username: "",
            password: "",
            conferma_password: "",
            // nome: "",
            // cognome: "",
            // email: "",
            // indirizzo: "",
            // citta: "",
            // codice_postale: "",
            // telefono: "",
            // eta: "",
            // caratteristiche: ""
        });

        // this.txtUsername.clear();
        this.txtPassword.clear();
        this.txtConfermaPassword.clear();
        // this.txtNome.clear();
        // this.txtCognome.clear();
        // this.txtEmail.clear();
        // this.txtIndirizzo.clear();
        // this.txtCitta.clear();
        // this.txtCodicePostale.clear();
        // this.txtEta.clear();
        // this.txtCaratteristiche.clear();

        if (global.login_negozio == true) {
            // this.txtTelefono.clear();

        }
        // else {
        //     this.txtDescrizione.clear();
        //     this.txtHobby.clear();
        // }
    }

    PROVAgetStudentsAndScores(){
        return Promise.all([this.fetchProfilo()])
    }

    render() {

        if(this.state.isLoading){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        // Se sono un utente normale
        if (global.login_negozio === false)
        {
            return(

            <View style={styles.screen}>
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                    </View>
                    <Text style={styles.title}>
                        Modifica il profilo utente
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

                                        {/*<View style={styles.entryTitle}>*/}
                                        {/*    <Text style={styles.textTitle}>Telefono: </Text>*/}
                                        {/*    <Text style={styles.asteriskStyle}>*</Text>*/}
                                        {/*</View>*/}
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
                                            value={this.state.username}
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
                                            value={this.state.indirizzo}
                                            ref={input => { this.txtIndirizzo = input }}
                                            onChangeText={(value) => this.setState({indirizzo: value})}/>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            value={this.state.citta}
                                            ref={input => { this.txtCitta = input }}
                                            onChangeText={(value) => this.setState({citta: value})}/>
                                        </View>
                                        <TakeProvinces/>
                                        <TakeRegions/>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            value={this.state.codice_postale}
                                            ref={input => { this.txtCodicePostale = input }}
                                            onChangeText={(value) => this.setState({codice_postale: value})}/>
                                        </View>

                                        {/*<View style={styles.textContainer}>*/}
                                        {/*    <TextInput editable maxLength={95}*/}
                                        {/*    ref={input => { this.txtTelefono = input }}*/}
                                        {/*    onChangeText={(value) => this.setState({telefono: value})}/>*/}
                                        {/*</View>*/}

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
                                        <Button title="Modifica Utente" onPress={() => {
                                            this.modifyNormalProfile();}} />
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

        // Se sono un negozio
        else{
            return(
                <View style={styles.screen}>
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                    </View>
                    <Text style={styles.title}>
                         Modifica il profilo negozio
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
                                            value={this.state.username}
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
                                            value={this.state.indirizzo}
                                            ref={input => { this.txtIndirizzo = input }}
                                            onChangeText={(value) => this.setState({indirizzo: value})}/>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            value={this.state.citta}
                                            ref={input => { this.txtCitta = input }}
                                            onChangeText={(value) => this.setState({citta: value})}/>
                                        </View>
                                        <TakeProvinces/>
                                        <TakeRegions/>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            value={this.state.codice_postale}
                                            ref={input => { this.txtCodicePostale = input }}
                                            onChangeText={(value) => this.setState({codice_postale: value})}/>
                                        </View>

                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            value={this.state.telefono}
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
                                        <Button title="Modifica Negozio" onPress={() => {
                                            this.modifyShopProfile();}} />
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