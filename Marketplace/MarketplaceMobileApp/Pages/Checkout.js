import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet, ActivityIndicator,
} from "react-native";
import Card from "../components/Card";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import Button from "../components/Button";

const {width, height} = Dimensions.get('window');

class Checkout extends Component {
 constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchConfirmcheckout();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true,
            }, function(){

            });

            this.fetchConfirmcheckout();
          }
        );
    }

   //     fetchCheckout() {
   //          return fetch('http://'+ global.ip +'/api/items/' + global.user_id + '/checkout/?format=json')
   //
   //         .then((response) => response.json())
   //         .then((responseJson) => {
   //
   //             this.setState({
   //                 isLoading: false,
   //                 dataSource: responseJson.results,
   //                 all_items: responseJson.count
   //             }, function () {
   //
   //                  console.log(responseJson.results)
   //             });
   //         })
   //         .catch((error) => {
   //             console.error(error)
   //         });
   // }

          fetchConfirmcheckout() {
            return fetch('http://'+ global.ip +'/api/items/' + global.user_id + '/confirmcheckout/?format=json')

           .then((response) => response.json())
           .then((responseJson) => {

               this.setState({
                   isLoading: false,
                   data:  responseJson.results,
               }, function () {

                    console.log(responseJson)
               });
           })
           .catch((error) => {
               console.error(error)
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
        // this.array_values = Array(this.state.all_items).fill().map(()=>Array(2).fill())
        // for (var i in this.state.dataSource) {
        //     this.array_values[i][0] = this.state.dataSource[i]["total_price"]
        //     this.array_values[i][1] = this.state.dataSource[i]["total_price2"]
        // }
        return(

            <View style={styles.page}>
                    {/*<FlatList*/}
                    {/*    data={this.array_values}*/}
                    {/*    renderItem={({item, index}) =>*/}
                    {/*        <Card>*/}
                    {/*                <View>*/}
                    {/*                    <Text numberOfLines={1}>Total: {item[0]}</Text>*/}
                    {/*                </View>*/}
                    {/*        </Card>*/}

                    {/*    }*/}
                    {/*    keyExtractor={(item, index) => index.toString()}*/}
                    {/*/>*/}
                <Text>Congratulation!</Text>
                <Text>Ref.Code: {this.state.data[0]}</Text>
                <Text>Number Order: {this.state.data[1]}</Text>
                <Button
                    text={'Visualizza Ordini'}
                    onPress={() => {
                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                    this.props.navigation.navigate('ViewOrders');}}
                />
                <Button
                    text={'Home'}
                    onPress={() => {
                    //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                    this.props.navigation.navigate('HomeStackNavigator');}}
                />
                </View>


        );

    }
}
const styles = StyleSheet.create({
  page: {
    marginTop: 10,
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
  star: {
    margin: 2,
  },
  quantityContainer: {
    margin: 5,
  }
})

export default Checkout;