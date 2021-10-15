import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import TakeProvinces from '../components/TakeProvinces';
import TakeRegions from '../components/TakeRegions';
import {Formik} from "formik";
import InputField from "../components/InputField";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import {StatusBar} from "expo-status-bar";
import * as Yup from "yup";
const {width, height} = Dimensions.get('window');


Yup.addMethod(Yup.string, "username_unique", function (errorMessage) {
    console.log("chiamato metodo")
    return this.test('test-unique', errorMessage, function (value) {

        return fetch('http://'+ global.ip +'/api/check_existing_username/' + value)
            .then((user_response) => user_response.json())
            .then((user_responseJson) => {
                const result = user_responseJson.result;
                return (result)
            })
            .catch((error) => {
            });
    })
});

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .label('Username')
        .required('Inserisci il tuo username')
        .min(3, "Username deve avere almeno 3 caratteri")
        .max(30, "Username deve avere al massimo 30 caratteri")
        .matches(/^[a-zA-Z0-9_\-]+$/, "Username invalido")
        .username_unique("Username non disponibile"),
    password: Yup.string()
        .label('Password')
        .min(8, "Password deve essere di almeno 8 caratteri")
        .max(20, "Password deve avere al massimo 20 caratteri")
        .required('Inserisci la tua password')
        .matches(/^[0-9A-Za-z]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?][0-9a-zA-Z]*$/, "Inserire almeno un carattere speciale"),
    conferma_password: Yup.string()
        .label('Conferma Password')
        .required('Conferma la tua password')
        .oneOf([Yup.ref("password"), null], "Le password devono essere uguali"),
    indirizzo: Yup.string()
        .label('Indirizzo')
        .max(50, 'Indirizzo non può avere più di 50 caratteri')
        .required('Inserire Indirizzo')
        .matches(/^[A-Za-z/, 0-9]+$/, 'Inserire Via e civico separati da una , '),
    citta: Yup.string()
        .label('Citta')
        .required('Inserire Citta')
        .min(3, 'Citta deve avere almeno 3 caratteri')
        .max(50, 'Citta deve avere al massimo 50 caratteri'),
    codice_postale: Yup.string()
        .label('Codice Postale')
        .required('Inserire Codice Postale')
        .max(8, 'Codice Postale può contenere al massimo 8 caratteri')
        .matches(/^[0-9]+$/, 'Codice Postale può contenere solo numeri'),

})


class NormalUserRegistration extends Component {

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

    fetchUserId() {
         fetch('http://'+ global.ip +'/api/users/find/' + global.username + '/?format=json')
        .then((user_response) => user_response.json())
        .then((user_responseJson) => {
            global.user_id = user_responseJson['results'][0]['user']['id'];
        })
        .catch((error) =>{
            console.error(error)
        // this.fetchUserId();
        });
    }

    RegisterUser = (values) => {

        // Se coincidono allora procedo a salvare l'utente


            fetch('http://'+ global.ip +'/api/rest-auth/registration/',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: values.username,
                    // email: this.state.email,
                    password1: values.password,
                    password2: values.conferma_password
                }),
            })
            .then(res => res.json())
            .then((res) => {
                if (res.key != null) {
                    global.user_key = res.key;
                    global.logged_in = false;
                    global.username = values.username;
                    this.fetchUserId();
                    this.RegisterNormalUser(values);
                } else {
                    this.setState({error_message: "Errore: " + JSON.stringify(res)});
                }
            })
            .catch((error) => {
                console.error(error);
                // this.RegisterUser;
            })

    }

    RegisterNormalUser = (values) => {
        global.login_negozio = false

        fetch('http://'+ global.ip +'/api/users/register/normaluser/',
        {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + global.user_key,
            },
            body: JSON.stringify({

                user: {
                    username: values.username,
                    // first_name: this.state.nome,
                    // last_name: this.state.cognome

                },

                indirizzo: values.indirizzo,
                citta: values.citta,
                provincia: global.provincia,
                regione: global.regione,
                // telefono: this.state.telefono,
                codice_postale: values.codice_postale,
                // foto_profilo: null,

                // eta: this.state.eta,
                // caratteristiche: this.state.caratteristiche,
            }),
        })
        .then(res => res.json())
        .then((res) => {
            console.log("Registrazione NormalUser")
            console.log(res.user.id)
            if (res.user.id != null) {
                // this.clearFields();
                this.props.navigation.navigate("UserStackNavigator");
            } else {
                this.setState({error_message: "Errore: " + JSON.stringify(res)});
            }
        })
        .catch((error) => {
            this.setState({error_message: "Errore: " + error});
            console.error(error);
            console.error("C'è stato un errore nella registrazione, riprovare");
            // this.RegisterNormalUser;
        })
    }

    render() {
        return (

            <View style={styles.screen}>

                <View style={styles.contentBar}>
                    <Text style={styles.title}>
                        Registra un account professionale
                    </Text>

                </View>

                <View style={styles.form}>

                    <Formik
                        initialValues={{
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
                            // // caratteristiche: ""
                        }}

                        onSubmit={(values, { resetForm }) => {
                            console.log(values)
                            this.RegisterUser(values);
                            resetForm();
                        }}

                        validationSchema={validationSchema}
                        validateOnChange={false}
                        validateOnBlur={false}

                    >
                        {({ handleChange, values, handleSubmit, errors, touched, handleBlur }) => (

                            <>
                                <ScrollView>
                                    <InputField
                                        name='username'
                                        label='Username'
                                        value={values.username}
                                        onChangeText={handleChange('username')}
                                        onBlur={handleBlur('username')}
                                        placeholder='Inserisci username'
                                        returnKeyType='done'

                                    />
                                    <ErrorMessage errorValue={touched.username && errors.username} />


                                    <InputField
                                        name='password'
                                        label='Password'
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        placeholder='Inserisci password'
                                        returnKeyType='done'
                                        autoCapitalize='none'
                                        secureTextEntry={true}

                                    />
                                    <ErrorMessage errorValue={touched.password && errors.password} />


                                    <InputField
                                        name='conferma_password'
                                        label='Conferma Password'
                                        value={values.conferma_password}
                                        onChangeText={handleChange('conferma_password')}
                                        onBlur={handleBlur('conferma_password')}
                                        placeholder='Conferma Password'
                                        returnKeyType='done'
                                        autoCapitalize='none'
                                        secureTextEntry={true}

                                    />
                                    <ErrorMessage errorValue={touched.conferma_password && errors.conferma_password} />

                                    <InputField
                                        name='indirizzo'
                                        label='Indirizzo'
                                        value={values.indirizzo}
                                        onChangeText={handleChange('indirizzo')}
                                        onBlur={handleBlur('indirizzo')}
                                        placeholder='Inserisci il tuo indirizzo completo'
                                        returnKeyType='done'

                                    />
                                    <ErrorMessage errorValue={touched.indirizzo && errors.indirizzo} />

                                    <InputField
                                        name='citta'
                                        label='Citta'
                                        value={values.citta}
                                        onChangeText={handleChange('citta')}
                                        onBlur={handleBlur('citta')}
                                        placeholder='Inserisci Citta di residenza'
                                        returnKeyType='done'

                                    />
                                    <ErrorMessage errorValue={touched.citta && errors.citta} />

                                    <View style={styles.titleField}>
                                        <Text style={styles.text}>Provincia: </Text>

                                        <TakeProvinces />
                                    </View>

                                    <View style={styles.titleField}>
                                        <Text style={styles.text}>Regione: </Text>

                                        <TakeRegions />
                                    </View>
                                    {/*<InputField*/}
                                    {/*    name='telefono'*/}
                                    {/*    label='Numero di telefono'*/}
                                    {/*    value={values.telefono}*/}
                                    {/*    onChangeText={handleChange('telefono')}*/}
                                    {/*    onBlur={handleBlur('telefono')}*/}
                                    {/*    placeholder='Inserici numero telefono'*/}
                                    {/*    keyboardType='numeric'*/}
                                    {/*    returnKeyType='done'*/}
                                    {/*    autoCapitalize='none'*/}

                                    {/*/>*/}
                                    {/*<ErrorMessage errorValue={touched.telefono && errors.telefono} />*/}

                                    <InputField
                                        name='codice_postale'
                                        label='Codice Postale'
                                        value={values.codice_postale}
                                        onChangeText={handleChange('codice_postale')}
                                        onBlur={handleBlur('codice_postale')}
                                        placeholder='Inserici codice postale'
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        autoCapitalize='none'

                                    />
                                    <ErrorMessage errorValue={touched.codice_postale && errors.codice_postale} />
                                    <View style={styles.buttonView}>
                                    <Button
                                        onPress={handleSubmit}
                                        buttonType='solid'
                                        text='Registrati'
                                    />
                                    </View>

                                </ScrollView>
                            </>

                        )}
                    </Formik>
                </View>
                <StatusBar style="auto" />
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
        marginVertical: 20,
        marginTop: 80,
        marginLeft: width/7
    },
    form: {
        flex: 1,
        width: '100%',
        marginTop: 50
    },
    buttonView: {
        width: width/2,
        paddingRight: 5,
        paddingLeft: 5,
        marginLeft: width/4,
    },
    inputContainer: {
        minWidth: '96%'
    },
    titleField: {
        marginBottom: 30,
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'row',
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
    contentBar: {
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
    leftContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    rightContainer: {
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
    pickerItem: {
        color: 'white'
    }
});

export default NormalUserRegistration;