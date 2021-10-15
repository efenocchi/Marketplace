import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet,
    TouchableOpacity
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

    render() {

        if(this.state.isLoading1 || this.state.isLoading2){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }



        this.array_values = Array(this.state.all_items).fill().map(()=>Array(8).fill())
        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["id"]
            this.array_values[i][1] = this.state.dataSource[i]["name"]
            this.array_values[i][2] = this.state.dataSource[i]["description"]
            this.array_values[i][3] = this.state.dataSource[i]["price"]
            this.array_values[i][4] = this.state.dataSource[i]["discount_price"]
            this.array_values[i][5] = this.state.dataSource[i]["image"]
            this.array_values[i][6] = this.state.dataSource[i]["user"]["username"]
            this.array_values[i][7] = this.state.dataSource[i]["user"]["id"]
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
                                        {id: item[0], name: item[1], description: item[2], price: item[3], discountprice: item[4] })
                                    ;}}>
                                    <Image style={styles.image} source={{uri: item[5]}} />
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.title} numberOfLines={1}>Id: {item[0]}</Text>
                                        <Text style={styles.title} numberOfLines={2}>Nome: {item[1]}</Text>
                                        <Text style={styles.description} numberOfLines={2}>Descrizione: {item[2]}</Text>
                                        <Text style={styles.description} numberOfLines={2}>Negozio: {item[6]}</Text>
                                        {item[4] !== null && (
                                        <Text style={styles.discountprice} numberOfLines={2}>Prezzo scontato: {item[4]}€

                                            <Text style={styles.price}>{item[3]}€</Text>

                                        </Text>
                                        )}
                                        {item[4] === null && (
                                            <Text style={styles.discountprice} numberOfLines={2}>Prezzo: {item[3]}€</Text>
                                        )}
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

