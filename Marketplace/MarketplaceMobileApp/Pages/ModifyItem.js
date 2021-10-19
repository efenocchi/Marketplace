import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import CustomHeader from '../components/Header';
import Card from '../components/Card';
import { TouchableOpacity, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import CheckBox from 'react-native-check-box';
import {Picker} from 'native-base';
import Button from "../components/Button";

const {width, height} = Dimensions.get('window');

class ModifyItem extends Component {
    id_item;
    constructor(props){
        super(props);
        this.state ={

            name: "",
            price: "",
            discount_price: "",
            category: "Abbigliamento",
            quantity: "",
            description: "",
            isLoading: true,
        }
    }

    componentDidMount() {
        this.id_item = this.props.route.params.id_item;
        this.fetchItemDetail();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });
            this.fetchItemDetail();
          }
        );
    }


    fetchItemDetail() {
        return fetch('http://'+ global.ip + '/api/items/' + this.id_item + '/detail/?format=json')
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson)
            console.log("name")
            console.log(responseJson.name)
            this.state.isLoading=false
        this.setState({

            isLoading: false,
            id_item: this.id_item,
            error_message: "",
            name: responseJson.name,
            price: responseJson.price,
            discount_price: responseJson.discount_price,
            category: responseJson.category,
            quantity: responseJson.quantity,
            description: responseJson.description,
        }, function(){

        });

        })
        .catch((error) =>{
            console.log(error)
        });
    }

    modifyitem = () => {
        console.log(this.state.name)
        console.log(this.state.price)
        console.log(this.state.discount_price)
        console.log(this.state.category)
        console.log(this.state.quantity)
        console.log(this.state.description)
        if(this.state.name !== "" && this.state.price !== "" && this.state.discount_price !== "" &&
            this.state.quantity !== "" && this.state.description !== "")  {
            fetch('http://'+ global.ip + '/api/items/' + this.id_item + '/modifyitem/',
            {
              method: 'PUT',
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
            .then(res => res.json())
            .then((res) => {
                if (res.id != null) {
                    this.props.navigation.goBack(null);
                } else {
                    this.props.navigation.goBack(null);
                }
            })
            .catch((error) => {
                // this.modifyitem;
            })
        } else {
            this.setState({error_message: "Errore: assicurati di riempire tutti i campi."});
        }
    }

    render() {
        console.log("isLoading")
        console.log(this.state.isLoading)
        console.log(this.state.discount_price)
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }
        console.log("ENTRAAAA")
        console.log(this.state.name)
        console.log(this.state.price)
        return (

            <View style={styles.screen}>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                            <Text style={styles.title}>Modifica un oggetto </Text>
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
                                            value={this.state.name}
                                            ref={input => { this.txtName = input }}
                                            onChangeText={(value) => this.setState({name: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                       value={this.state.price.toString()}
                                            ref={input => { this.txtPrice = input }}
                                            onChangeText={(value) => this.setState({price: value})} />
                                        </View>
                                         {this.state.discount_price !== null && (
                                          <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                       value={this.state.discount_price.toString()}
                                            ref={input => { this.txtDiscountPrice = input }}
                                            onChangeText={(value) => this.setState({discount_price: value})}/>
                                        </View>
                                         )}

                                        {this.state.discount_price === null && (
                                          <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                            ref={input => { this.txtDiscountPrice = input }}
                                            onChangeText={(value) => this.setState({discount_price: value})}/>
                                        </View>
                                        )}
                                        <View>
                                        <Picker
                                            style={styles.picker} itemStyle={styles.pickerItem}
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
                                                       value={this.state.quantity.toString()}
                                            ref={input => { this.txtQuantity = input }}
                                            onChangeText={(value) => this.setState({quantity: value})}/>
                                        </View>

                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                       value={this.state.description}
                                            ref={input => { this.txtDescription = input }}
                                            onChangeText={(value) => this.setState({description: value})}/>
                                        </View>

                                    </View>
                                </View>
                                <View style={styles.controlli}>
                                    <View style={styles.buttonview}>
                                        <Button text="Modifica" onPress={() => {
                                            this.modifyitem();}} />
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
        flex: 1,
        marginTop: 50
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 20
    },

    buttonview: {
        width: 110,
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
        fontWeight: 'bold',
        marginTop: 5
    },
    // contentbar: {
    //     height: 50,
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     alignItems: 'center'
    //   },
    // leftcontainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start'
    // },
    // rightcontainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-end',
    //     alignItems: 'center'
    // },
    textContainer: {
        borderWidth: 1,
        height: 28,
        width: width - width / 2,
        marginLeft: 10,
        marginBottom: 3,
        marginTop: 6
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
        marginTop: 3,
        paddingTop: -5,
        paddingBottom: -30,
    },
    pickerItem: {
        color: 'white',
    }
});

export default ModifyItem;