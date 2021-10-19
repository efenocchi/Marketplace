import React, {Component, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, Picker, ScrollView, Text, TextInput, View} from "react-native";
import {StyleSheet} from 'react-native';
import ImageCarousel from "../components/ImageCarousel";
import Button from "../components/Button";
import product from "../components/product";
import NumericInput from 'react-native-numeric-input'
const {width, height} = Dimensions.get('window');

class ItemDetailPage extends Component {

    id;
    name;
    description;
    price;
    discountprice;
    shop;
    quantity;
    value;
    image_url;

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            quantity: 1,
        }
    }

    componentDidMount() {
        this.id = this.props.route.params.id;   /* id dell'item */
        this.name = this.props.route.params.name;
        this.description = this.props.route.params.description;
        this.price = this.props.route.params.price;
        this.discountprice = this.props.route.params.discountprice;
        this.shop = this.props.route.params.shop;
        this.image_url = this.props.route.params.image_url;
        this.quantity = this.props.route.params.quantity;  /* quantity = quantità di quell'item disponibile */
        this.setState({
            isLoading: false,
        });
    }

    /*----------------------------------------------------------------------------------------------------*/

    add_to_cart = () => {
        if (this.quantity > 0) {
            fetch('http://'+ global.ip +'/api/items/add_quantity' + '/' + global.user_id + '/' + this.id + '/' + this.state.value + '/',
                {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Token ' + global.user_key,
                    },
                    body: JSON.stringify({
                        quantity: this.quantity,
                        value: this.state.value,
                    }),
                })
                .then(res => res.json())
                .then((res) => {

                    if (res.id != null) {
                        // this.clearFields();
                        // this.props.navigation.goBack(null);
                    } else {
                        this.setState({error_message: JSON.stringify(res)});
                    }
                })
                .catch((error) => {
                    this.setState({error_message: error});
                    /*this.inviaRecensione;*/
                })
        } else {
            console.log("La quantità non è sufficiente");
        }
    }

    /*-------------------------------------------------------------------------------------------------*/
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }

        return (
            <ScrollView style={styles.root}>

                {/* Name */}
                <View style={styles.textInline}>
                    <Text style={{fontSize: 18}}>{this.name}</Text>
                </View>

                {/* Negozio */}
                <View style={styles.textInline}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Negozio: </Text>
                    <Text style={{fontSize: 18}}>{this.shop}</Text>
                </View>

                {/* Image Carousel */}

                <Image style={styles.image} source={{uri: this.image_url}} />

                {/* Category */}
                {/*
            <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
                <Picker.Item label="Label1" value="Label1"/>
                <Picker.Item label="Label2" value="Label2"/>
            </Picker>
            */}
                {/* Price + Discountprice */}
                <Text style={styles.discountprice}>
                    {this.discountprice !== null && (
                <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {this.discountprice}€

                    <Text style={styles.price}>{this.price}€</Text>

                </Text>
                )}
                {this.discountprice === null && (
                    <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {this.price}€</Text>
                )}
                </Text>

                {/* Quantity */}
                <View style={styles.textInline}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Quantità disponibile: </Text>
                    {this.quantity === 0 ?
                        <Text style={{fontSize: 18}}>{this.quantity} (Terminato)</Text>
                        :
                        <Text style={{fontSize: 18}}>{this.quantity}</Text>
                    }
                </View>

                <View style={styles.textInline}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Quantità da aggiungere: </Text>
                </View>

                {/* Inserire Quantità */}
                <NumericInput editable
                    value={this.state.value}
                    onChange={value => this.setState({value})}
                    onLimitReached={(isMax, msg) => console.log(isMax, msg)}
                    maxValue={this.quantity}
                    minValue={0}
                    totalWidth={100}
                    totalHeight={50}
                    iconSize={25}
                    step={1}
                    valueType='real'
                    rounded
                    textColor='black'
                    iconStyle={{color: 'white'}}
                    rightButtonBackgroundColor='gray'
                    leftButtonBackgroundColor='gray'/>

                {/* Description */}
                <View style={styles.textInline}  maxLength = {8}>
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>Descrizione: </Text>
                    <Text style={{fontSize: 18}}>{this.description}</Text>
                </View>

                {/* Button */}
                {this.quantity === 0 ?
                    <Text></Text>
                    // <Button
                    //     text={'Insert Your Mail'}
                    //     onPress={() => {
                    //         console.warn('Insert Your Mail')
                    //         //this.add_to_cart();
                    //         // this.props.navigation.navigate('RegistrationStackNavigator');
                    //     }}
                    // />
                    :
                    <Button
                        text={'Add To Cart'}
                        onPress={() => {
                            console.warn('Add to cart')
                            this.add_to_cart();
                            // this.props.navigation.navigate('RegistrationStackNavigator');
                        }}
                    />
                }
                <Button
                    text={'Go To Cart'}
                    onPress={() => {
                        console.warn('Go to cart')
                        this.props.navigation.navigate('Cart');
                    }}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  root:{
      padding: 10,
  },
  rootquantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: 130,
  },

  button: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d1d1',
  },

  buttontext: {
    fontSize: 18,
  },

  quantity: {
    color: '#007eb9',
  },

    title: {
        fontSize: 18,
    },

  price: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  image: {
    flex: 2,
    height: 200,
    resizeMode: 'contain',
    marginBottom:15,
  },
  discountprice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
    textInline: {
        marginTop: 10
    },
    description: {
        marginVertical: 10,
        lineHeight: 20,
    },
});
export default ItemDetailPage;
