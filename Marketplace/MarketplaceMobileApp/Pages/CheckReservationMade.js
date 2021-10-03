import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, Dimensions, ActivityIndicator, YellowBox, FlatList, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import Card from '../components/Card';


export default class CheckReservationMade extends Component{

    order_items;
    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
        }
    }

    componentDidMount() {
        this.order_items = this.props.route.params.order_items;

        this.fetchItemsBooked();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });

            this.fetchItemsBooked();
          }
        );
    }

   fetchItemsBooked() {
       // Return the order items related with the ref_code clicked before (not all the objects bought)
        fetch('http://10.110.215.142:5000/api/items_booked/' + this.order_items + '/?format=json',
             {
               method: 'GET',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Authorization': 'Token ' + global.user_key,
               }
           })
           .then((response) => response.json())
           .then((responseJson) => {

               this.setState({
                   dataSourceItems: responseJson.results,
                   number_items: responseJson.count,
                   isLoading: false,
               }, function () {

                    console.log("valori ritornati degli items")
                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)

           });
        ;
   }


   render() {

       if (this.state.isLoading) {
           return (
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
           this.array_values = Array(this.state.number_items).fill().map(() => Array(11).fill())
           for (var i in this.state.dataSourceItems) {
               this.array_values[i][0] = this.state.dataSourceItems[i]["quantity"] // quantità acquistata
               this.array_values[i][1] = this.state.dataSourceItems[i]["review_item_done"]  // dice se l'oggetto è stato recensito da questo utente relativo a questo ordine
               this.array_values[i][2] = this.state.dataSourceItems[i]["name"]  // nome del prodotto
               this.array_values[i][3] = this.state.dataSourceItems[i]["user"]["username"]  // negozio che lo vende
               this.array_values[i][4] = this.state.dataSourceItems[i]["category"]  // categoria del prodotto
               this.array_values[i][5] = this.state.dataSourceItems[i]["description"] // descrizione del prodotto
               this.array_values[i][6] = this.state.dataSourceItems[i]["price"]
               this.array_values[i][7] = this.state.dataSourceItems[i]["discount_price"]
               this.array_values[i][8] = this.state.dataSourceItems[i]["image"] // Immagine dell'oggetto
               this.array_values[i][9] = this.state.dataSourceItems[i]["id"] // id order items, mi serve nella prossima pagina
               this.array_values[i][10] = this.state.dataSourceItems[i]["id"] // id item to review

           }
           console.log("Stampo il primo")
           console.log(this.array_values)

           return (
               <View style={styles.screen}>

                   <View style={{alignSelf: 'flex-start', width: '100%', alignItems: 'center'}}>
                       <CustomHeader parent={this.props}/>

                       <View style={styles.contentbar}>
                           <View style={styles.leftcontainer}>
                               <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)}/>
                           </View>
                           <Text style={styles.title}>
                               Oggetti Acquistati
                           </Text>
                           <View style={styles.rightcontainer}></View>
                       </View>
                   </View>
                   <View style={styles.flatlistview}>
                       <FlatList
                           style={{flex: 1}}
                           // data={[['ciao','ciao2','ciao3'],['risposta1','risposta2']]}
                           data={this.array_values}

                           renderItem={({item, index}) =>

                               <Card style={styles.inputContainer}>

                                   <View style={styles.data}>
                                       <Image style={styles.image} source={{uri: item[8]}} />
                                       <Text style={styles.itemTitle} numberOfLines={0}>Prodotto: {item[2]}</Text>
                                       <Text style={styles.itemTitle}
                                             numberOfLines={1}>Descrizione: {item[5]}</Text>
                                       <Text style={styles.itemTitle}
                                             numberOfLines={2}>Categoria: {item[4]}</Text>
                                       <Text style={styles.itemTitle} numberOfLines={3}>Quantità: {item[0]}</Text>
                                       <Text style={styles.itemTitle} numberOfLines={4}>Negozio: {item[3]}</Text>
                                       <Text style={styles.itemTitle} numberOfLines={5}>Prezzo finale: {item[6]}</Text>

                                       {/*<Text style={styles.itemTitle} numberOfLines={6}>Ricevuta da: {item[6]}</Text>*/}

                                       {/*Stampo un valore diverso in base al fatto che la recensione sia stata lasciata o meno*/}
                                       {item[1] === true && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'green'}}>Recensione
                                                   lasciata</Text>
                                           </View>

                                       )}
                                       {item[1] === false && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'red'}}>Recensione
                                                   non lasciata</Text>
                                           </View>

                                       )}

                                   </View>
                               </Card>

                           }
                           keyExtractor={(item, index) => index.toString()}
                       />
                   </View>
               </View>

           );

       }
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        alignItems: 'center'
    },
    image: {
        flex: 2,
        height: 150,
        resizeMode: 'contain',
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
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    inputContainer: {
        minWidth: '96%',
        flexDirection: 'column'
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        width: width - width / 2.6
    },
    ordersSubtitle: {
        width: width - width / 2.6
    },
    data: {
        flex: 1
    },
    flatlistview: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textInline: {
        flexDirection: 'row'
    }
});

