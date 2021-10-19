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
import Entypo from "react-native-vector-icons/Entypo";
import {red} from "react-native-reanimated/src/reanimated2/Colors";

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
                    {this.review_done === false && (
                       <View style={styles.buttonView}>
                           <Button
                            text={'Lascia una recensione'}
                            onPress={() => {
                                // console.warn('ShowShop')
                            this.props.navigation.navigate('LeaveOrReadReviewToShop',{username_shop: this.username_shop, review_left: this.review_done});
                            }}
                        />
                    </View>
                   )}
                    {this.review_done === true && (
                         <View style={styles.buttonView}>
                            <Button
                            text={'Mostra recensione'}
                            onPress={() => {
                                // console.warn('ShowShop')
                            this.props.navigation.navigate('LeaveOrReadReviewToShop',{username_shop: this.username_shop, review_left: this.review_done});
                            }}
                            />
                         </View>
                    )}

                    {/*<Button*/}
                    {/*    text={'Valutazione media'}*/}
                    {/*    onPress={() => {console.warn('ShowShop')*/}
                    {/*    // this.props.navigation.navigate('',{id_shop: this.id_shop});*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <FlatList style={styles.flatlist}
                        data={this.array_values}
                        renderItem={({item, index}) =>
                            <Card style={styles.card}>
                                    <View style={styles.rightContainer}>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Titolo: </Text>
                                            <Text style={{fontSize: 18}}>{item[0]}</Text>
                                        </View>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Descrizione: </Text>
                                            <Text style={{fontSize: 18}}>{item[1]}</Text>
                                        </View>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Scritta da: </Text>
                                            <Text style={{fontSize: 18}}>{item[3]}</Text>
                                        </View>
                                       <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Valutazione: </Text>
                                            <Text style={{fontSize: 18}}>({item[2]})</Text>
                                           {item[2] === 1 && (
                                               <Entypo name="star" color='red' size={20}/>
                                           )}
                                           {item[2] === 2 && (
                                               <View style={styles.ratingsContainer}>
                                                  <Entypo name="star" color='red' size={20}/>
                                              </View>
                                           )}
                                           {item[2] === 3 && (
                                               <View style={styles.ratingsContainer}>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                              </View>
                                           )}
                                           {item[2] === 4 && (
                                               <View style={styles.ratingsContainer}>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                              </View>
                                           )}
                                          {item[2] === 5 && (
                                              <View style={styles.ratingsContainer}>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                                  <Entypo name="star" color='red' size={20}/>
                                              </View>
                                           )}
                                        </View>
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
    marginTop: 20,
    // backgroundColor: '#dedede',

  },
buttonView: {
        width: width/2,
        paddingRight: 5,
        paddingLeft: 5,
        marginLeft: width/4,
    },
  flatlist: {
    padding: -60,
    marginLeft: 15,
    // backgroundColor: '#dedede',
  },
    textInline: {
        flexDirection: 'row',
        marginRight: -10,
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

