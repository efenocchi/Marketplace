import React, {Component} from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet,
    YellowBox
} from "react-native";
import CardItem from "../components/CardItem";
import CustomHeader from "../components/Header";
import {IconButton} from "react-native-paper";
import Card from "../components/Card";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {NavigationActions as navigation} from "react-navigation";
import {useNavigation} from "@react-navigation/native";
import Button from "../components/Button";
import SearchBar from "react-native-dynamic-search-bar";

const {width, height} = Dimensions.get('window');

class ItemList extends Component {
    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
            show_pickers: true,
            //search: ""
        }
    }

    componentDidMount() {
        this.fetchAllItems();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });
            this.fetchAllItems();
          }
        );
    }
    //
    // componentWillUnmount() {
    // this.willFocusSubscription.remove();
    // }

    fetchAllItems() {
            return fetch('http://'+ global.ip +'/api/items/list_all_items/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                isLoading: false,
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
                <SearchBar style={styles.searchbar}
                    onPressToFocus
                    autoFocus={false}
                    fontColor="#c6c6c6"
                    iconColor="#c6c6c6"
                    shadowColor="#282828"
                    cancelIconColor="#c6c6c6"
                    backgroundColor="#36485f"
                    placeholder="Search Item"
                    width="88%"
                    activeOpacity={.9}
                    onChangeText={text => {
                        this.fetchSearchItem(text);
                    }}
                    onPressCancel={() => {
                        console.log("cancel");
                    }}
                />
                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                <Pressable style={styles.pressable} onPress={() => {
                                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                                    this.props.navigation.navigate('ItemDetailPage',
                                        {id: item[0], name: item[1], description: item[2], price: item[3], discountprice: item[4] })
                                    ;}}>
                                    <Image style={styles.image} source={{uri: item[5]}} />
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.title} numberOfLines={1}>Id: {item[0]}</Text>
                                        <Text style={styles.title} numberOfLines={1}>Nome: {item[1]}</Text>
                                        <Text style={styles.description} numberOfLines={2}>Descrizione: {item[2]}</Text>
                                        <Text style={styles.description} numberOfLines={2}>Negozio: {item[6]}</Text>
                                        <Text style={styles.discountprice}>
                                          DiscountPrice: {item[4]}
                                          {
                                            <Text style={styles.price}>Price:  {item[3]}</Text>
                                          }
                                        </Text>
                                        <Button
                                            text={'Visita il Negozio'}
                                            onPress={() => {console.warn('ShowShop')
                                            this.props.navigation.navigate('ShowShop',{id_shop: item[7]});
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
    marginTop: -35, //10
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

export default ItemList;