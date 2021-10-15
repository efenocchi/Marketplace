import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet, ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";

const {width, height} = Dimensions.get('window');

class ShopItemList extends Component {
    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
            show_pickers: true
        }
    }

    componentDidMount() {
        this.fetchShopItems();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });
            this.fetchShopItems();
          }
        );
    }

    // componentWillUnmount() {
    // this.willFocusSubscription.remove();
    // }

    fetchShopItems() {
            return fetch('http://'+ global.ip +'/api/items/' + global.user_id + '/shop_all_items/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                dataSource: responseJson.results,
                shop_items: responseJson.count,
                isLoading: false
            }, function(){
                console.log(responseJson.results)
            });
            })

            .catch((error) =>{
            });
        }

    render() {
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }

       else if(this.state.number_items === 0){
           return(
              <View style={{flex: 1, paddingTop: height / 2}}>
                   <ActivityIndicator/>
               </View>
           )
       }
        this.array_values = Array(this.state.shop_items).fill().map(()=>Array(6).fill())
        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["id"]
            this.array_values[i][1] = this.state.dataSource[i]["name"]
            this.array_values[i][2] = this.state.dataSource[i]["description"]
            this.array_values[i][3] = this.state.dataSource[i]["price"]
            this.array_values[i][4] = this.state.dataSource[i]["discount_price"]
            this.array_values[i][5] = this.state.dataSource[i]["image"]
        }
        return(
            <View style={styles.page}>
                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                <Pressable style={styles.pressable} onPress={() => {
                                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                                    this.props.navigation.navigate('ItemDetailPage',{id: item[0], name: item[1], description: item[2], price: item[3], discountprice: item[4] });}}>
                                    <Image style={styles.image} source={{uri: item[5]}} />
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.title} numberOfLines={1}>Id: {item[0]}</Text>
                                        <Text style={styles.title} numberOfLines={1}>Nome: {item[1]}</Text>
                                        <Text style={styles.description} numberOfLines={3}>Descrizione: {item[2]}</Text>
                                        <Text style={styles.discountprice}>
                                          DiscountPrice: {item[4]}
                                          {
                                            <Text style={styles.price}>Price:  {item[3]}</Text>
                                          }
                                        </Text>
                                    </View>
                                </Pressable>
                            </Card>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
        );

    }
}
const styles = StyleSheet.create({
  page: {
    marginTop: 0,
    backgroundColor: 'blue',

  },

  flatlist: {
    padding: -60,
    marginLeft: 15,
    backgroundColor: 'green',
  },

  card: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    backgroundColor: 'white',
    flex:1,
    padding: -20,
    marginTop: 5,

  },
  pressable: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'white',
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
  },
  price: {
    fontSize: 12,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  discountprice: {
    fontSize: 18,
    fontWeight: 'bold',
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

export default ShopItemList;