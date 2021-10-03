import React, {Component} from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    Button
} from "react-native";
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import {IconButton} from "react-native-paper";
import Card from "../components/Card";


export default class OrdersReceived extends Component{

 constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            next: ""
        }
    }

    componentDidMount() {
        this.fetchOrders();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });

            this.fetchOrders();
          }
        );
    }

    fetchOrders() {
       return fetch('http://10.110.215.142:5000/api/orders_shop/',
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
                   dataSource: responseJson.results,
                   number_orderitems: responseJson.count,
                   isLoading: false
               }, function () {

                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)
               this.fetchRecensioni();
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
        this.array_values = Array(this.state.number_orderitems).fill().map(()=>Array(5).fill())
        // this.array_values[0][2] = 4
        console.log(this.array_values[0][2])

        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["ref_code"]
            this.array_values[i][1] = this.state.dataSource[i]["start_date"].slice(0,10)
            this.array_values[i][2] = this.state.dataSource[i]["items"]  // orderitems
            this.array_values[i][3] = this.state.dataSource[i]["review_customer_done"]
            this.array_values[i][4] = this.state.dataSource[i]["user"]["username"] // Who made the order

            // gli id degli order items relativi ad un acquisto identificato univocamente tramite uuid
            // verranno passati alla schermata successiva e verranno quindi visualizzati gli oggetti acquistati
            // in quell'ordine e la quantità acquistata per ogni oggetto.
            // sarà possibile lasciare una recensione o visualizzare una recensione già effettuata per un prodotto

        }
        console.log(this.array_values[0][1])
        console.log("fine caricamento")

        return (
            <View style={styles.screen}>

                <View style={{alignSelf: 'flex-start', width: '100%', alignItems: 'center'}}>
                    <CustomHeader parent={this.props} />

                    <View style={styles.contentbar}>
                        <View style={styles.leftcontainer}>
                            <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                        </View>
                        <Text style={styles.title}>
                            Prenotazioni Effettuate
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
                            <TouchableOpacity key={item.id} onPress={() => this.props.navigation.navigate('CheckReservationMade',
                                {order_items: item[2]})}>

                            <Card style={styles.inputContainer}>
                                <View style={styles.data}>
                                    <Text style={styles.orderTitle} numberOfLines={0}>Codice prenotazione: {item[0]}</Text>
                                    <Text style={styles.orderTitle} numberOfLines={1}>Utente Acquirente: {item[4]}</Text>
                                    <Text style={styles.orderTitle} numberOfLines={2}>Data prenotazione: {item[1]}</Text>

                                       {item[3] === true && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'green'}}>
                                                   Recensione lasciata </Text>
                                               <View style={styles.buttonview}>
                                                <Button title="Guarda Recensione" onPress={ "ok" } />
                                            </View>
                                           </View>

                                       )}
                                       {item[3] === false && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'red'}}>
                                                   Recensione non lasciata</Text>
                                           <View style={styles.buttonview}>
                                                <Button title="Lascia Recensione" onPress={ "ok" } />
                                            </View>
                                           </View>

                                       )}
                                </View>
                            </Card>
                            </TouchableOpacity>
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
        flex: 1,
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
        flexDirection: 'row'
    },
    orderTitle: {
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

