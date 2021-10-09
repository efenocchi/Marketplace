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
    quantity;
    value;


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
                <Text style={styles.title}>{this.name}</Text>

                {/* Image Carousel */}
                <ImageCarousel images={product.images}/>

                {/* Category */}
                {/*
            <Picker
                selectedValue={selectedOption}
                onValueChange={(itemValue, itemIndex) => setSelectedOption(itemValue)}>
                <Picker.Item label="Label1" value="Label1"/>
                <Picker.Item label="Label2" value="Label2"/>
            </Picker>
            */}
                <Text>Category</Text>

                {/* Price */}
                <Text style={styles.price}>{this.price}
                    {/* Discount Price */}
                    <Text style={styles.discountprice}>{this.discountprice}</Text>
                </Text>
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
                <Text style={styles.description} numberOfLines={10}>{this.description}</Text>
                <Text style={styles.description} numberOfLines={10}>Quantity:{this.quantity}</Text>

                {/* Button */}
                {this.quantity === 0 ?
                    <Button
                        text={'Insert Your Mail'}
                        onPress={() => {
                            console.warn('Insert Your Mail')
                            //this.add_to_cart();
                            // this.props.navigation.navigate('RegistrationStackNavigator');
                        }}
                    />
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
        fontSize: 18,
        fontWeight: 'bold',
    },

    discountprice: {
        fontSize: 14,
        fontWeight: 'normal',
        textDecorationLine: 'line-through',
    },

    description: {
        marginVertical: 10,
        lineHeight: 20,
    },
});
export default ItemDetailPage;
