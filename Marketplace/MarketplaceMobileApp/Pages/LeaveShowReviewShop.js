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

export default class LeaveShowReviewShop extends Component {
    username_shop;
    review_done;
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            show_pickers: true,
            //search: ""
        }
    }

    componentDidMount() {
        this.username_shop = this.props.route.params.username_shop;
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


    fetchAllItems() {
            return fetch('http://'+ global.ip +'/api/review_shop/' + this.username_shop + '/?format=json')

            .then((response) => response.json())
            .then((responseJson) => {

            this.setState({
                isLoading: false,
                dataSource: responseJson.results,
                all_reviews: responseJson.count // number of review
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

        this.array_values = Array(this.state.all_reviews).fill().map(()=>Array(7).fill())
        this.review_done = false
        for (var i in this.state.dataSource) {
            this.array_values[i][0] = this.state.dataSource[i]["title_of_comment"]
            this.array_values[i][1] = this.state.dataSource[i]["description"]
            this.array_values[i][2] = this.state.dataSource[i]["rating"]
            this.array_values[i][3] = this.state.dataSource[i]["writer"]
            if (this.array_values[i][3] === global.username){
                this.review_done = true
            }
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
                    {this.review_done === false && (
                       <Button
                        text={'Lascia una recensione'}
                        onPress={() => {
                            // console.warn('ShowShop')
                        this.props.navigation.navigate('LeaveOrReadReviewToShop',{username_shop: this.username_shop, review_left: this.review_done});
                        }}
                    />
                   )}
                    {this.review_done === true && (
                        <Button
                        text={'Mostra recensione lasciata'}
                        onPress={() => {
                            // console.warn('ShowShop')
                        this.props.navigation.navigate('LeaveOrReadReviewToShop',{username_shop: this.username_shop, review_left: this.review_done});
                        }}
                        />
                    )}

                    <Button
                        text={'Valutazione media'}
                        onPress={() => {console.warn('ShowShop')
                        // this.props.navigation.navigate('',{id_shop: this.id_shop});
                        }}
                    />
                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                    <View style={styles.rightContainer}>
                                        <Text style={styles.title} numberOfLines={1}>Titolo: {item[0]}</Text>
                                        <Text style={styles.title} numberOfLines={1}>Descrizione: {item[1]}</Text>
                                        <Text style={styles.title} numberOfLines={2}>Scritta da: {item[3]}</Text>
                                        <Text style={styles.title} numberOfLines={2}>Valutazione: {item[2]}</Text>

                                    </View>

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

