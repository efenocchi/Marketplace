import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, Image, Dimensions, ActivityIndicator, YellowBox, FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import Card from '../components/Card';

export default class FeedbackUser extends Component{
    // In questa funzione verranno ritornati i feedback che un utente loggato ha ricevuto
    // Non è la funzione che ritorna le recensioni dei prodotti da acquistare

    username = "Ciao"
    array_values;
    dictionariooo = {
      key1: "value1",
      key2: "value2"
      // etc.
    };
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
       return fetch('http://10.110.215.142:5000/api/reviews_customer/' + '3' + '/?format=json')

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
        this.array_values = Array(this.state.number_reviews).fill().map(()=>Array(7).fill())
        // this.array_values[0][2] = 4
        console.log(this.array_values[0][2])

        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["description"] // descrizione
            this.array_values[i][1] = this.state.dataSource[i]["id"]  // id
            this.array_values[i][2] = this.state.dataSource[i]["order"]  // order
            this.array_values[i][3] = this.state.dataSource[i]["rating"]  // rating
            this.array_values[i][4] = this.state.dataSource[i]["receiver"]  // receiver
            this.array_values[i][5] = this.state.dataSource[i]["title_of_comment"]  // title_of_comment
            this.array_values[i][6] = this.state.dataSource[i]["writer"]  // writer
        }
        console.log(this.array_values)
        console.log("fine caricamento")


        const result = Object.keys(this.state.dataSource).map(key => ({[key]: this.state.dataSource[key]}));
        // console.log(result);
        const array = Object.values( this.state.dataSource[0] );

        return (
            <View style={styles.screen}>

                <View style={{alignSelf: 'flex-start', width: '100%', alignItems: 'center'}}>
                    <CustomHeader parent={this.props} />

                    <View style={styles.contentbar}>
                        <View style={styles.leftcontainer}>
                            <IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />
                        </View>
                        <Text style={styles.title}>
                            Recensioni di {global.username}
                        </Text>
                        <View style={styles.rightcontainer}></View>
                    </View>
                </View>
                <View style={styles.flatlistview}>
                    <FlatList
                        style={{flex: 1}}
                        // data={this.state.dataSource}
                        // data={data2}
                        // data={this.dictionariooo}
                        // data={[['ciao','ciao2','ciao3'],['risposta1','risposta2']]}
                        data={this.array_values}

                        renderItem={({item, index}) =>
                            <Card style={styles.inputContainer}>
                                <View style={styles.data}>
                                    <Text style={styles.recensioneTitle} numberOfLines={0}>Titolo: {item[5]}</Text>
                                    <Text style={styles.recensioneTitle} numberOfLines={1}>Descrizione: {item[0]}</Text>
                                    <Text style={styles.recensioneTitle} numberOfLines={2}>Ricevuta da: {item[6]}</Text>

                                    <Text style={styles.recensioneSubtitle}></Text>
                                    <View style={styles.textInline}>
                                        <Text style={{fontWeight: 'bold', fontStyle: 'italic'}}>Valutazione: </Text>
                                        <Text>{item[3]}</Text>
                                    </View>
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
        flexDirection: 'row'
    },
    recensioneTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        width: width - width / 2.6
    },
    recensioneSubtitle: {
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