import React, {Component, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, Picker, ScrollView, Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import ImageCarousel from "../components/ImageCarousel";
import Button from "../components/Button";
import product from "../components/product";

const {width, height} = Dimensions.get('window');

class ItemDetailPage extends Component {

    id;
    name;
    description;
    price;
    discountprice;
    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
        }
    }

        componentDidMount() {
        this.id = this.props.route.params.id;
        this.name = this.props.route.params.name;
        this.description = this.props.route.params.description;
        this.price = this.props.route.params.price;
        this.discountprice = this.props.route.params.discountprice;

        this.setState({
                isLoading: false,
            });
    }

    render(){
        if(this.state.isLoading){
            return(
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

            {/* Description */}
            <Text style={styles.description} numberOfLines={10}>{this.description}</Text>

            {/* Button */}
            <Button
                text={'Add To Cart'}
                onPress={() => {
                    console.warn('Add to cart')
                    // this.AddToCart();
                    // this.props.navigation.navigate('RegistrationStackNavigator');
                }}
            />
            <Button
                text={'Go To Cart'}
                onPress={() => {console.warn('Go to cart')
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
