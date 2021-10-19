import React, {Component} from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Text,
    View,
    StyleSheet, ActivityIndicator, TextInput,
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

        return(

            <View style={styles.page}>

                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                            <View style={styles.data}>
                                <View style={{flexDirection: 'column'}}>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Ref. Code: </Text>
                                        </View>
                                        <Text style={{fontSize: 18, marginTop: -2, marginBottom: 5}}>{this.state.data[0]}</Text>
                                        <View style={styles.textInline}>
                                            <Text style={{fontWeight: 'bold', fontSize: 18}} numberOfLines={1}>Numero ordine: </Text>
                                            <Text style={{fontSize: 18}}>{this.state.data[1]}</Text>
                                       </View>
                                </View>

                                <View style={{paddingTop: 10}}/>
                                <View style={{borderBottomColor: 'black', borderBottomWidth: 1, width: width - (width * 10 / 100)}}/>
                                <View style={{paddingTop: 25}}/>

                                <View style={{flexDirection: 'row'}}>

                                    <View>
                                        <View style={styles.bottomButton}>
                                            <Button
                                                text={'Acquista ancora'}
                                                onPress={() => {
                                                //setto l'id dell'oggetto selezionato da mandare alla ItemDetailPage e visualizzarne i dettagli
                                                this.props.navigation.navigate('ItemList');}}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                </View>
        );

    }
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'gray'
    },
    title: {
        fontSize: 20,
        marginVertical: 10
    },
    buttonview: {
        width: 110,
        paddingRight: 5,
        paddingLeft: 5
    },
    inputContainer: {
        marginTop: height/4,
        minWidth: '96%'
    },
    controlli: {
        paddingTop: 20,
        paddingRight: 5,
        alignItems: 'center'
    },
    data: {
        paddingTop: 20,
        alignItems: 'center'
    },
    entryTitle: {
        marginBottom: 5,
        marginTop: 9,
        flexDirection: 'row'
    },
    textTitle: {
        fontWeight: 'bold'
    },
    textContainer: {
        borderWidth: 1,
        height: 28,
        width: width - width / 2,
        marginLeft: 10,
        marginBottom: 3,
        marginTop: 3
    },
  bottomButton: {
    width: width/2,
    paddingRight: 5,
    paddingLeft: 5,
    marginLeft: 25,
    marginTop: 0,
    marginBottom: -2
  },
    bottomTitle: {
        marginBottom: 25,
        marginTop: 17,
        alignItems: 'flex-end'
    },
      textInline: {
      flexDirection: 'row',
      marginRight: -5,
      marginTop: -5
  },
});

export default Checkout;