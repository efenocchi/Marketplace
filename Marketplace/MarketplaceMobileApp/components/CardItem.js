import {Image, View, Text} from 'react-native';
import {StyleSheet } from 'react-native'
import React from 'react'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useNavigation} from '@react-navigation/native';
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const CardItem = () => {
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('ItemDetailPage');
  };
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <View style={styles.rightContainer}>
        <Text style={styles.title} numberOfLines={3}>Ciaone</Text>
        {/* Ratings */}
        <View style={styles.ratingsContainer}>
            <FontAwesome
              size={18}
              color={'#e47911'}
            />
          <Text></Text>
        </View>
        <Text style={styles.price}>from 30$</Text>
        <Text style={styles.discountprice}>20$</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  rootcard: {
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    flex: 2,
    height: 150,
    resizeMode: 'contain',
  },
  rightContainer: {
    padding: 10,
    flex: 3,
  },
  title: {
    fontSize: 18,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  discountprice: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  star: {
    margin: 2,
  },
  quantityContainer: {
    margin: 5,
  }
})

export default CardItem;
