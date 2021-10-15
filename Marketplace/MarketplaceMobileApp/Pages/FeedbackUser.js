import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    Image,
    Dimensions,
    ActivityIndicator,
    YellowBox,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { IconButton } from 'react-native-paper';
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import Card from '../components/Card';

export default class FeedbackUser extends Component{
    // In questa funzione verranno ritornati i feedback che un utente loggato ha ricevuto
    // Non è la funzione che ritorna le recensioni dei prodotti da acquistare

    array_values;
    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
        }
    }

    componentDidMount() {
        this.fetchRecensioni();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });

            this.fetchRecensioni();
          }
        );
    }

   // componentWillUnmount() {
   //     this.willFocusSubscription.remove();
   // }


   fetchRecensioni() {
       return fetch('http://'+ global.ip +'/api/reviews_customer/' + global.user_id + '/?format=json')

           .then((response) => response.json())
           .then((responseJson) => {

               this.setState({
                   isLoading: false,
                   dataSource: responseJson.results,
                   number_reviews: responseJson.count
               }, function () {

                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)
               // this.fetchRecensioni();
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
        this.array_values = Array(this.state.number_reviews).fill().map(()=>Array(9).fill())
        // this.array_values[0][2] = 4
        // console.log(this.array_values[0][2])

        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["description"] // descrizione
            this.array_values[i][1] = this.state.dataSource[i]["id"]  // id
            this.array_values[i][2] = this.state.dataSource[i]["order"]  // order
            this.array_values[i][3] = this.state.dataSource[i]["rating"]  // rating
            this.array_values[i][4] = this.state.dataSource[i]["receiver"]  // receiver
            this.array_values[i][5] = this.state.dataSource[i]["title_of_comment"]  // title_of_comment
            this.array_values[i][6] = this.state.dataSource[i]["writer"]  // writer
            this.array_values[i][7] = this.state.dataSource[i]["order"]["ref_code"]  // ordine per cui ho ricevuto la recensione
            this.array_values[i][8] = this.state.dataSource[i]["order"]["items"]  // oggetti acquistati in quell'ordine (possono essere relativi a più negozi)
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
                        <Text style={styles.title}>Recensioni Ricevute</Text>
                        <View style={styles.rightcontainer}></View>
                    </View>
                </View>
                <View style={styles.flatlistview}>
                    <FlatList
                        style={{flex: 1}}
                        // data={[['ciao','ciao2','ciao3'],['risposta1','risposta2']]}
                        data={this.array_values}

                        renderItem={({item, index}) =>
                            <TouchableOpacity key={item.id} onPress={() => this.props.navigation.navigate('ItemsRelatedToOneShopAndOneOrder',
                                {order_items: item[8], name_shop: item[6]})}>
                            <Card style={styles.inputContainer}>
                                <View style={styles.data}>
                                   <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold',fontSize: 18}}numberOfLines={1}>Titolo: </Text>
                                        <Text style={{fontSize: 18}}>{item[5]}</Text>
                                    </View>
                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold',fontSize: 18}} numberOfLines={2}>Descrizione: </Text>
                                        <Text style={{fontSize: 18}}>{item[0]}</Text>
                                    </View>
                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold',fontSize: 18}} numberOfLines={2}>Ricevuta da: </Text>
                                        <Text style={{fontSize: 18}}>{item[6]}</Text>
                                    </View>
                                    <Text style={{fontWeight: 'bold',fontSize: 18}} numberOfLines={3}>Ordine con Ref.Code: </Text>
                                    <Text style={{fontSize: 18}}>{item[7]}</Text>

                                    <Text style={styles.feedbackCustomer}></Text>
                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold',fontSize: 18}} >Valutazione: </Text>
                                        <Text style={{fontSize: 18}}>{item[3]}</Text>
                                    </View>
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
    feedbackTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        width: width - width / 2.6
    },
    feedbackCustomer: {
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

