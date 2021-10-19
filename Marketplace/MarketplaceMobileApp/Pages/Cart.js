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
import Button from "../components/Button";

const {width, height} = Dimensions.get('window');

class Cart extends Component {

    constructor(props){
        super(props);
        this.state ={
            isLoading1: true,
            isLoading2: true,
            isLoading3: true,
        }

    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('focus',
               () => {
                    this.state.isLoading1 = true
                    this.state.isLoading2 = true
                    this.state.isLoading3 = true
                   Promise.all([
                       this.fetchCheckout(),
                       this.fetchCartOrders(),
                       this.fetchItemsFromOrderItems()
                   ]).then(([urlOneData, urlTwoData]) => {
                       this.setState({

                       });
                   })
               }
        );
    }


    deleteItem = (id_item_to_delete) => {
        fetch('http://'+ global.ip +'/api/items/' + id_item_to_delete + '/delete/', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Token ' + global.user_key
            }
        })
        .then(res => {
        })
        .catch((error) => {
        });
    }

       fetchCartOrders() {
            return fetch('http://'+ global.ip +'/api/items/' + global.user_id + '/cart_orders/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                dataSourceOrderItems: responseJson.results,
                all_order_items: responseJson.count,
                isLoading1: false
            }, function(){
                console.log("Entra 1")
                console.log(responseJson.results)
            });
            })
            .catch((error) =>{
                console.log(error)
            });
        }

   fetchItemsFromOrderItems() {
       // Return the order items related with the ref_code clicked before (not all the objects bought)
        fetch('http://'+ global.ip +'/api/id_items_from_orderitems/' + global.user_id + '/?format=json')
           .then((response) => response.json())
           .then((responseJson) => {

               this.setState({
                   dataSourceItems: responseJson.results,
                   isLoading2: false,
               }, function () {
                    console.log("Entra 2")
                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)
               // this.fetchOrderItems();
           });
        ;
   }

    fetchCheckout() {
            return fetch('http://'+ global.ip +'/api/items/' + global.user_id + '/checkout/?format=json')

           .then((response) => response.json())
           .then((responseJson) => {

               this.setState({
                   infocheckout: responseJson.results,
                   isLoading3: false,
               }, function () {

                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)
           });
    }

    render() {
       if (this.state.isLoading1 || this.state.isLoading2 || this.state.isLoading3) {
           return (
               <View style={{flex: 1, paddingTop: height / 2}}>
                   <ActivityIndicator/>
               </View>
           )
       }

        this.array_values = Array(this.state.all_order_items).fill().map(()=>Array(8).fill())
        if(this.state.all_order_items > 0) {
            for (var i in this.state.dataSourceOrderItems) {
                this.array_values[i][0] = this.state.dataSourceOrderItems[i]["quantity"]
                this.array_values[i][1] = this.state.dataSourceItems[i]["name"]
                this.array_values[i][2] = this.state.dataSourceItems[i]["description"]
                this.array_values[i][3] = this.state.dataSourceItems[i]["price"]
                this.array_values[i][4] = this.state.dataSourceItems[i]["discount_price"]
                this.array_values[i][5] = this.state.dataSourceItems[i]["image"]
                this.array_values[i][6] = this.state.dataSourceItems[i]["category"]
                this.array_values[i][7] = this.state.dataSourceItems[i]["id"]
            }
        }
        return(
            <View style={styles.page}>
                    <Card style={styles.viewcheckout}>
                        {/*mostro il prezzo totale*/}
                        <View style={styles.textInline}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Import totale: </Text>
                            <Text style={{fontSize: 18}}>{this.state.infocheckout[0]}€</Text>
                        </View>
                        {/*mostro la quantità totale*/}
                        <View style={styles.textInline}>
                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Quantità totale: </Text>
                            <Text style={{fontSize: 18}}>{this.state.infocheckout[1]}</Text>
                        </View>
                        <View style={styles.buttonView}>
                            <Button
                            text={'Checkout'}
                            onPress={() => {
                                 // this.fetchConfirmCheckout();
                                {
                                    this.state.infocheckout[1] > 0 &&
                                    this.props.navigation.navigate('Checkout');
                                }
                            }}
                            />
                        </View>
                    </Card>
                 <View style={{borderBottomColor: 'black', borderBottomWidth: 1, marginTop: 4, marginBottom: 4}}/>
                 <Text style={{fontWeight: 'bold', fontSize: 18, marginLeft: 120}} numberOfLines={1}>Oggetti nel carrello</Text>
                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                <Pressable style={styles.pressable} onPress={() => {
                                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                                    this.props.navigation.navigate('ItemDetailPage');}}>
                                    <Image style={styles.image} source={{uri: item[5]}} />
                                    <View style={styles.rightContainer}>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Quantità: </Text>
                                            <Text style={{fontSize: 18}}>{item[0]}</Text>
                                        </View>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Nome: </Text>
                                            <Text style={{fontSize: 18}}>{item[1]}</Text>
                                       </View>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Descrizione: </Text>
                                            <Text style={{fontSize: 18}}>{item[2]}</Text>
                                       </View>
                                        <Text style={styles.discountprice}>
                                          {item[4] !== null && (
                                            <Text style={styles.discountprice} numberOfLines={2}>Prezzo scontato: {item[4]}€

                                            <Text style={styles.price}>{item[3]}€</Text>

                                            </Text>
                                        )}
                                        {item[4] === null && (
                                            <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {item[3]}€</Text>
                                        )}
                                        </Text>
                                        <Button
                                            text={'Delete Item'}
                                            onPress={() => {console.warn('Delete Item')
                                                this.deleteItem(item[7]);
                                                console.log(item[7]);
                                                this.state.isLoading1 = true
                                                this.state.isLoading2 = true
                                                this.state.isLoading3 = true

                                                this.fetchCheckout(),
                                               this.fetchCartOrders(),
                                               this.fetchItemsFromOrderItems()
                                            }}
                                        />
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
    paddingTop: 10,
    // backgroundColor: '#dedede',

  },

  flatlist: {
    padding: -60,
    marginLeft: 15,
    backgroundColor: '#dedede',
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
  },
  textInline: {
      flexDirection: 'row',
      marginRight: -10,
  },

  viewcheckout: {
    marginLeft: 10,
    borderRadius: 0,
    marginTop: -5,
    paddingLeft: -2,
    textAlign: 'center',
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'black'
  },

  buttonView: {
    width: width/2,
    paddingRight: 5,
    paddingLeft: 5,
    marginLeft: 25,
    marginTop: 0,
    marginBottom: -2
  },
})

export default Cart;