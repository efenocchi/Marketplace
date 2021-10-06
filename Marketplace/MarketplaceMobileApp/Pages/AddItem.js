import React, { Component, useState, useEffect } from 'react';
import {View, Text, StyleSheet, Button, Image, TextInput, Platform, ActivityIndicator} from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Picker } from 'native-base';



const {width, height} = Dimensions.get('window');

import * as ImagePicker from 'expo-image-picker';


export default class AddItem extends Component {
    photo_uri=false;
    constructor(props){
        super(props);
        this.state ={
            name: "",
            price: "",
            discount_price: "",
            category: "Abbigliamento",
            quantity: "",
            description: "",
            image_item: null,
            isCreating: true,
        }
    }

    // createFormData = (photo, body) => {
    //   const data = new FormData();
    //
    //   data.append('photo', {
    //     name: photo.uri,
    //     type: photo.type,
    //     uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    //   });
    //
    //   Object.keys(body).forEach((key) => {
    //     data.append(key, body[key]);
    //   });
    //
    //   return data;
    // };

    // handleUploadPhoto = () => {
    //     fetch('http://'+ global.ip +'/api/upload_image/' + global.user_id + '/', {
    //         method: 'POST',
    //         body: this.createFormData(this.state.photo, { userId: global.user_id }),
    //         })
    //         .then((response) => response.json())
    //         .then((response) => {
    //               console.log('upload success', response);
    //               alert('Upload success!');
    //               this.setState({ photo: null });
    //         })
    //         .catch((error) => {
    //               console.log('upload error', error);
    //               alert('Upload failed!');
    //     });
    // };
    insertItem(){

        console.log(this.state.name)
        console.log(this.state.price)
        console.log(this.state.discount_price)
        console.log(this.state.category)
        console.log(this.state.quantity)
        console.log(this.state.description)
        if(this.state.name !== "" && this.state.price !== "" && this.state.discount_price !== "" &&
            this.state.quantity !== "" && this.state.description !== "") {
            console.log("Entrato nel fetch")
            return fetch('http://'+ global.ip +'/api/insert_item/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + global.user_key,
                },
                body: JSON.stringify({

                    name: this.state.name,
                    price: this.state.price,
                    discount_price: this.state.discount_price,
                    category: this.state.category,
                    quantity: this.state.quantity,
                    description: this.state.description,
                    image_item: null,

                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.id != null) {
                        this.clearFields();
                        this.props.navigation.navigate('ChooseShopInfoList');

                    } else {
                        this.setState({error_message: JSON.stringify(responseJson)});
                    }
                })

                .catch((error) => {
                    this.setState({error_message: error});
                    console.error(error)
                })
        }
        else{
            this.setState({error_message: "Riempire tutti i campi."});
        }
    }

    componentDidMount() {
        // this.photo = this.props.route.params.photo;
        // this.createFormData(this.photo);
        this.insertItem();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isCreating: true,
            }, function(){

            });
             this.insertItem();
            // this.createFormData();
          }
        );

        // console.log("preso valore dal DidMount")
        // console.log(this.photo_uri)

    }


    clearFields = () => {
        this.setState({error_message: "",
            name: "",
            price: "",
            discount_price: "",
            category: "",
            quantity: "",
            description: "",
            image_item: "",
        });

        this.txtName.clear();
        this.txtPrice.clear();
        this.txtDiscountPrice.clear();
        this.txtQuantity.clear();
        this.txtDescription.clear();

    }

    render() {
            // this.photo_uri = this.props.route.params.photo_uri;
            //
            //  if (this.photo.uri === false) {
            //    return (
            //        <View style={{flex: 1, paddingTop: height / 2}}>
            //            <ActivityIndicator/>
            //        </View>
            //    )
            // }

             return (
            <View style={styles.screen}>
                <CustomHeader parent={this.props} />

                <View style={styles.contentbar}>
                    <View style={styles.leftcontainer}>
                        <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                    </View>
                    <Text style={styles.title}>
                        Aggiungi un oggetto
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
                                            <Text style={styles.textTitle}>Nome:</Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Prezzo: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Prezzo Scontato: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Categoria: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Quantità: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Descrizione: </Text>
                                            <Text style={styles.asteriskStyle}>*</Text>
                                        </View>
                                    </View>

                                    <View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtName = input }}
                                            onChangeText={(value) => this.setState({name: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtPrice = input }}
                                            onChangeText={(value) => this.setState({price: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtDiscountPrice = input }}
                                            onChangeText={(value) => this.setState({discount_price: value})}/>
                                        </View>
                                        <View style={styles.textContainer}>
                                        <Picker

                                            selectedValue={this.state.category}
                                            onValueChange={(itemValue) => {this.setState({category: itemValue})}}
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="Abbigliamento" value="Abbigliamento" />
                                            <Picker.Item label="Tecnologia" value="Tecnologia" />
                                            <Picker.Item label="Sport" value="Sport" />
                                            <Picker.Item label="Casa" value="Casa" />
                                            <Picker.Item label="Motori" value="Motori" />
                                        </Picker>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtQuantity = input }}
                                            onChangeText={(value) => this.setState({quantity: value})}/>
                                        </View>

                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtDescription = input }}
                                            onChangeText={(value) => this.setState({description: value})}/>
                                        </View>

                                    </View>
                                </View>


                                <View style={styles.controlli}>
                                    <View style={styles.buttonview}>
                                        {/*{ <Image source={{ uri: this.photo.uri }} style={{ width: 200, height: 200 }} />}*/}
                                        {/*<Button title="Inserisci oggetto" onPress={() => {*/}
                                        {/*     this.handleUploadPhoto();}} />*/}
                                        <Button title="Inserisci oggetto" onPress={() => {
                                             this.insertItem();}} />

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
