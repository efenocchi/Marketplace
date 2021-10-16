import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity, TextInput, TouchableHighlight
} from "react-native";
import CardItem from "../components/CardItem";
import CustomHeader from "../components/Header";
import {IconButton} from "react-native-paper";
import Card from "../components/Card";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {NavigationActions as navigation} from "react-navigation";
import {useNavigation, useRoute} from "@react-navigation/native";
import Button from "../components/Button";
import SearchBar from "react-native-dynamic-search-bar";

const {width, height} = Dimensions.get('window');

export default class ShowShop extends Component {
    username_shop;
    constructor(props){
        super(props);
        this.state ={
            isLoading1: true,
            isLoading2: true,
            email: ""
        }
    }

    componentDidMount() {

        this.username_shop = this.props.route.params.username_shop;

        this.focusListener = this.props.navigation.addListener('focus',
               () => {
                    this.state.isLoading1 = true
                    this.state.isLoading2 = true
                       console.log('focus is called');
                               Promise.all([
                            this.fetchTime(),
                            this.fetchAllItems()
                        ]).then(([urlOneData, urlTwoData]) => {
                            this.setState({
                                // mergedData: urlOneData.concat(urlTwoData)
                            });
                        })
               }
             );
    }


    fetchTime(){
         return fetch('http://'+ global.ip +'/api/travel_time/' + this.username_shop + '/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                isLoading2: false,
                dataSourceTime: responseJson["result"],

            }, function(){
                console.log(responseJson["result"])
            });
            })
            .catch((error) =>{
            });
    }


    fetchAllItems() {
            return fetch('http://'+ global.ip +'/api/items/' + this.username_shop + '/show_shop/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                isLoading1: false,
                dataSource: responseJson.results,
                all_items: responseJson.count
            }, function(){
                console.log(responseJson.results)
            });
            })
            .catch((error) =>{
            });
    }


    setPassword(item_selected_id){
        console.log("bottone spinto")
        console.log(this.state.email)

        fetch('http://'+ global.ip +'/api/insert_email/' + item_selected_id + '/',
                {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + global.user_key,
                },
                body: JSON.stringify({
                    email: this.state.email,
                }),
                })
                .then(res => res.json())
                .then((res) => {

                    console.log("Inserimento email esito:")
                    console.log(res)
                    if(res["result"] === true) {
                        console.warn('Email aggiunta con successo')
                    }
                    else{
                        console.warn('Email già presente')
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
    }



    createWaitUser(item_selected_id){
        console.log("bottone spinto")
        console.log(this.state.email)

        // fetch('http://'+ global.ip +'/api/insert_email/' + item_selected_id + '/',
        fetch('http://'+ global.ip +'/api/create_waituser/',
                {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + global.user_key,
                },
                body: JSON.stringify({
                    email: this.state.email,
                }),
                })
                .then(res => res.json())
                .then((res) => {
                    console.log(res)
                    this.setPassword(item_selected_id)
                })
                .catch((error) => {
                    console.error(error)
                })
    }

    render() {

        if(this.state.isLoading1 || this.state.isLoading2){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }



        this.array_values = Array(this.state.all_items).fill().map(()=>Array(9).fill())
        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["id"]
            this.array_values[i][1] = this.state.dataSource[i]["name"]
            this.array_values[i][2] = this.state.dataSource[i]["description"]
            this.array_values[i][3] = this.state.dataSource[i]["price"]
            this.array_values[i][4] = this.state.dataSource[i]["discount_price"]
            this.array_values[i][5] = this.state.dataSource[i]["image"]
            this.array_values[i][6] = this.state.dataSource[i]["user"]["username"]
            this.array_values[i][7] = this.state.dataSource[i]["user"]["id"]
            this.array_values[i][8] = this.state.dataSource[i]["quantity"]
        }
        return(


            <View style={styles.page}>

                    <Text style={styles.title_time} numberOfLines={2}>{this.state.dataSourceTime}</Text>
                <View style={styles.buttonView}>
                    <Button
                        text={'Recensioni'}
                        onPress={() => {
                        this.props.navigation.navigate('LeaveShowReviewShop',{username_shop: this.username_shop});
                        }}
                    />
                    </View>

                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                <TouchableOpacity style={styles.pressable} onPress={() => {
                                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                                    this.props.navigation.navigate('ItemDetailPage',
                                        {id: item[0], name: item[1], description: item[2], price: item[3], discountprice: item[4],quantity: item[8], shop: item[6]})
                                    ;}}>
                                    <Image style={styles.image} source={{uri: item[5]}} />
                                    <View style={styles.rightContainer}>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Id: </Text>
                                            <Text style={{fontSize: 18}}>{item[0]}</Text>
                                        </View>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Quantità: </Text>
                                            <Text style={{fontSize: 18}}>{item[8]}</Text>
                                        </View>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Nome: </Text>
                                            <Text style={{fontSize: 18}}>{item[1]}</Text>
                                        </View>
                                        <View style={styles.textInline}  maxLength = {8}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}}>Descrizione: </Text>
                                            <Text style={{fontSize: 18, paddingRight: 120}} maxLength = {8}>{item[2]}</Text>
                                        </View>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Negozio: </Text>
                                            <Text style={{fontSize: 18}}>{item[6]}</Text>
                                        </View>
                                        {item[4] !== null && (
                                        <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {item[4]}€

                                            <Text style={styles.price}>{item[3]}€</Text>

                                        </Text>
                                        )}
                                        {item[4] === null && (
                                            <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {item[3]}€</Text>
                                        )}

                                        {item[8] === 0 &&    //se la quantity è 0 -> item finito
                                            <View style={styles.textInputView}>
                                                <View style={{flexDirection:'row', width: window.width, marginVertical: 10, padding:4, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'#888', borderRadius:10}}>

                                                    <View style={{flex:4}}>
                                                          <TextInput editable maxLength={95}
                                                            placeholder={"Inserisci la tua email"}
                                                            placeholderTextColor={'red'}
                                                            keyboardType = 'email-address'
                                                            // ref={input => { this.txtName = input }}
                                                            onChangeText={(value) => this.setState({email: value})}
                                                            onSubmitEditing = {()=>{this.createWaitUser(item[0])}}
                                                            />
                                                    </View>

                                                    <TouchableHighlight style={{alignItems:'center',justifyContent:'center'}} onPress = {()=>{this.createWaitUser(item[0])}} underlayColor = 'transparent'>
                                                            <View>
                                                              <Image source={ require('../assets/upload.png') } style={ { width: 20, height: 20 } } />
                                                            </View>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </TouchableOpacity>
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
    marginTop: 20,
    backgroundColor: 'blue',

  },

  flatlist: {
    padding: -60,
    marginLeft: 18,
    marginBottom:100,
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
    textInline: {
        flexDirection: 'row',
        marginRight: -10,
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
buttonView: {
        width: width/2,
        paddingRight: 5,
        paddingLeft: 5,
        marginLeft: width/4,
    },
        textInputView: {
        width: width/2,
        paddingRight: 5,
        paddingLeft: 5,
        marginBottom: -20,
        marginTop: 10,
        marginLeft: -width/6,
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
  title_time: {
    fontSize: 18,
      textAlign:'center'
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

  button_small: {
    fontSize: 16,
    backgroundColor: '#e47911',
    marginVertical: 10,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#a15e1b',

  },

  star: {
    margin: 2,
  },

  quantityContainer: {
    margin: 5,
  }
})
