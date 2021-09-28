import React, {useState} from 'react';
import {Image, Picker, ScrollView, Text, View} from "react-native";
import {StyleSheet} from 'react-native';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import ImageCarousel from "../components/ImageCarousel";
import Button from "../components/Button";
import product from "../components/product";


const ItemDetailPage = (props) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [quantity, setQuantity] = useState(1);

    const onMinus = () => {}
    const onPlus = () => {}
    console.log(selectedOption);
    return (
        <ScrollView style={styles.root}>

            {/* Name */}
            <Text style={styles.title}>Logitech MX Master 3 Mouse Wireless Avanzato, Ricevitore Bluetooth o USB 2.4 GHz,</Text>

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
            <Text style={styles.price}>from 30$
                {/* Discount Price */}
                <Text style={styles.discountprice}>10$</Text>
            </Text>

            {/* Description */}
            <Text style={styles.description} numberOfLines={10}>
                Scorri 1000 righe in un secondo: Il nuovissimo scorrimento
                MagSpeed è così ‎preciso e veloce da permetterti di fermarti su un singolo pixel
                e scorrere 1000 righe al secondo e in silenzio Design ergonomico: Lavora meglio grazie a una silhouette realizzata
                per la forma della mano. Crea e condividi in modo più ‎intuitivo con pulsanti dal layout ideale e
                scroller da pollice Impostazioni personalizzabili: Il mouse wireless è personalizzabile in quasi tutte le app che
                usi e ti permette di lavorare più velocemente ottimizzando le tue app preferite Più Dispositivi, Un Solo Mouse:
                Lavora senza problemi su tre computer. Trasferisci file di testo, immagini e altri file da
                Windows, maOS o Linux, su PC, Mac o laptop
            </Text>

            {/* Quantity */}
            <View style={styles.rootquantity}>
                <Pressable onPress={onMinus} style={styles.button}>
                    <Text style={styles.buttontext}>-</Text>
                </Pressable>
                    <Text style={styles.buttontext}>0</Text>
                <Pressable onPress={onPlus} style={styles.button}>
                    <Text style={styles.buttontext}>+</Text>
                </Pressable>
            </View>
            {/* Button */}
            <Button
                text={'Add To Cart'}
                onPress={() => {console.warn('Add to cart')}}
            />
            <Button
                text={'Go To Cart'}
                onPress={() => {console.warn('Go to cart')}}
            />
        </ScrollView>
    );
};

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
