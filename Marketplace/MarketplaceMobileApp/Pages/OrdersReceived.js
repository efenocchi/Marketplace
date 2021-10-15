import React, {Component} from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image
} from "react-native";
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import {IconButton} from "react-native-paper";
import Card from "../components/Card";
import Button from "../components/Button";


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
       return fetch('http://'+ global.ip +'/api/orders_shop/',
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
        this.array_values = Array(this.state.number_orderitems).fill().map(()=>Array(7).fill())

        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["ref_code"]
            this.array_values[i][1] = this.state.dataSource[i]["start_date"].slice(0,10)
            this.array_values[i][2] = this.state.dataSource[i]["items"]  // orderitems
            this.array_values[i][3] = this.state.dataSource[i]["review_customer_done"] // Per sapere quali negozi hanno lasciato la recensione all'utente, essendoci più negozi per lo stesso reference code va controllato (si può togliere questa riga)

            if (this.state.dataSource[i]["review_customer_done"].length === 0){ //nessuno ha lasciato la recensione quindi sicuramente neanche il negozio loggato
                this.array_values[i][3] = false
                console.log("misura 0")
            }

            else{
                console.log("misura MAGGIORE di 0")
                this.array_values[i][3] = false // metto falso e se lo trovo cambio in vero (cioè ho già lasciato la recensione)
                for (let j = 0; j < this.state.dataSource[i]["review_customer_done"].length; j++){

                    if (this.state.dataSource[i]["review_customer_done"][j]["writer"]["username"] === global.username){
                         this.array_values[i][3] = true
                    }
                }
            }
            console.log("lunghezza------------------")
            console.log(this.state.dataSource[i]["review_customer_done"].length)
            this.array_values[i][4] = this.state.dataSource[i]["user"]["username"] // Who made the order
            this.array_values[i][5] = this.state.dataSource[i]["user"]["id"] // Id of who placed the order
            this.array_values[i][6] = this.state.dataSource[i]["id"] // Id order

            // gli id degli order items relativi ad un acquisto identificato univocamente tramite uuid
            // verranno passati alla schermata successiva e verranno quindi visualizzati gli oggetti acquistati
            // in quell'ordine e la quantità acquistata per ogni oggetto.
            // sarà possibile lasciare una recensione o visualizzare una recensione già effettuata per un prodotto

        }
        console.log(this.array_values)
        console.log("fine caricamento")


        return (
            <View style={styles.screen}>
                <View style={{alignSelf: 'flex-start', width: '100%', alignItems: 'center'}}>
                    {/*<CustomHeader parent={this.props} />*/}

                    <View style={styles.contentbar}>
                        <View style={styles.leftcontainer}>
                            {/*<IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />*/}
                        </View>
                        <Text style={styles.title}>Oggetti Comprati</Text>
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
                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold'}} numberOfLines={1}>Ref. Code:  </Text>
                                    </View>
                                    <Text>{item[0]}</Text>

                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold'}} numberOfLines={1}>Utente Acquirente:  </Text>
                                        <Text>{item[4]}</Text>
                                    </View>

                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold'}} numberOfLines={1}>Data Prenotazione:  </Text>
                                        <Text>{item[1]}</Text>
                                    </View>

                                       {item[3] === true && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'green'}}>
                                                   Recensione lasciata </Text>
                                            <View style={styles.buttonview}>
                                                <Button text="Mostra" onPress={() => { this.props.navigation.navigate('LeaveOrReadReviewToCustomer',
                                                  {id_user: item[5], review_left: item[3], id_order:item[6]}) }} />
                                            </View>

                                           </View>

                                       )}
                                       {item[3] === false && (
                                           <View style={styles.textInline}>
                                               <Text style={{fontWeight: 'bold', fontStyle: 'italic', color: 'red'}}>
                                                   Recensione non lasciata</Text>
                                               <View style={styles.buttonview2}>
                                                <Button text="Lascia" onPress={() => { this.props.navigation.navigate('LeaveOrReadReviewToCustomer',
                                                  {id_user: item[5], review_left: item[3], id_order:item[6]}) }} />
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
        flexDirection: 'row',
        marginLeft: 7
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
    },
    buttonview: {
        width: 110,
        marginTop: 15,
        marginLeft: -120,
    },

        buttonview2: {
        width: 110,
        marginTop: 15,
        marginLeft: -145,
    },

});

