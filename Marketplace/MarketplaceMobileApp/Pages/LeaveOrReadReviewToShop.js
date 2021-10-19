import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ActivityIndicator,
    YellowBox,
    FlatList,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { IconButton } from 'react-native-paper';
import CustomHeader from '../components/Header';
const {width, height} = Dimensions.get('window');
import Card from '../components/Card';
import {ScrollView} from "react-native-gesture-handler";
import {Picker} from "native-base";
import Button from "../components/Button";



export default class LeaveOrReadReviewToShop extends Component{
    username_shop;
    review_left;

    constructor(props){
        super(props);
        this.state ={
            isLoading: true,
            title_of_comment: "",
            description: "",
            rating: 5,
        }
    }

    componentDidMount() {
        this.username_shop = this.props.route.params.username_shop;
        this.review_left = this.props.route.params.review_left;;

        // Se non ho già lasciato una recensione allora non devo caricare niente dal server
        if(this.review_left === false){
              this.setState({
                  isLoading: false
                });
        }
        // devo caricare la recensione che ho lasciato per poterla visualizzare
        else{
            this.fetchSingleReviewLeftToShop();

        }
    }


    fetchSingleReviewLeftToShop(){
       return fetch('http://'+ global.ip +'/api/get_single_review_shop/' + this.username_shop + '/?format=json', {
           method: 'GET',
           headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + global.user_key,
                },
       })
        .then((response) => response.json())
           .then((responseJson) => {

               console.log(responseJson)
               this.setState({

                   title_of_comment: responseJson.title_of_comment,
                   description: responseJson.description,
                   rating: responseJson.rating,
                   isLoading: false

               }, function () {

                    console.log(responseJson.results)
               });
           })
           .catch((error) => {
               console.error(error)
           });
    }

    LeaveReview(){
        if(this.state.title_of_comment !== "" && this.state.description !== "" && this.state.rating !== "") {
            return fetch('http://'+ global.ip +'/api/review_from_customer_to_shop/' + this.username_shop + '/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + global.user_key,
                },
                body: JSON.stringify({

                    title_of_comment: this.state.title_of_comment,
                    description: this.state.description,
                    rating: this.state.rating

                }),
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.id != null) {

                        this.props.navigation.navigate('ShowShop');

                    } else {
                        this.setState({error_message: JSON.stringify(responseJson)});
                    }
                })

                .catch((error) => {
                    this.setState({error_message: error});
                    console.error(error)
                })
        }
        else{
            this.setState({error_message: "Riempire tutti i campi."});
        }
    }


    render (){
        if(this.state.isLoading){
            return(
                <View style={{flex: 1, paddingTop: height / 2}}>
                    <ActivityIndicator/>
                </View>
            )
        }


        return(

            <View style={styles.screen}>

                <View style={{alignSelf: 'flex-start', width: '100%', alignItems: 'center'}}>
                    {/*<CustomHeader parent={this.props} />*/}

                    <View style={styles.contentbar}>
                        <View style={styles.leftcontainer}>
                            {/*<IconButton icon="arrow-left" onPress={() => this.props.navigation.goBack(null)} />*/}
                        </View>
                        <Text style={styles.title}>Recensione Lasciata</Text>
                        <View style={styles.rightcontainer}></View>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{alignItems: 'center'}}>
                        <Card style={styles.inputContainer}>
                            <View style={styles.data}>
                                <View style={{flexDirection: 'row'}}>
                                    <View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Titolo:</Text>
                                            {this.review_left === false && (
                                            <Text style={styles.asteriskStyle}>*</Text>
                                            )}
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Descrizione: </Text>
                                            {this.review_left === false && (
                                            <Text style={styles.asteriskStyle}>*</Text>
                                            )}
                                        </View>
                                        <View style={styles.entryTitle}>
                                            <Text style={styles.textTitle}>Valutazione: </Text>
                                            {this.review_left === false && (
                                            <Text style={styles.asteriskStyle}>*</Text>
                                            )}
                                        </View>
                                    </View>

                                    {/*Non posso editare ma solo visualizzare*/}
                                    {this.review_left === true && (
                                    <View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable={false}
                                                       value={this.state.title_of_comment}
                                            onChangeText={(value) => this.setState({title_of_comment: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable={false}
                                                       value={this.state.description}
                                            onChangeText={(value) => this.setState({description: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable={false}
                                                       value={this.state.rating.toString()}
                                            onChangeText={(value) => this.setState({description: value})} />
                                        </View>


                                    </View>
                                    )}

                                    {this.review_left === false && (

                                    <View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                       value={this.state.title_of_comment}
                                            ref={input => { this.txtTitleOfComment = input }}
                                            onChangeText={(value) => this.setState({title_of_comment: value})} />
                                        </View>
                                        <View style={styles.textContainer}>
                                            <TextInput editable maxLength={95}
                                                       value={this.state.description}
                                            ref={input => { this.txtDescription = input }}
                                            onChangeText={(value) => this.setState({description: value})} />
                                        </View>

                                        <View style={styles.titleField}>
                                        <Picker
                                            style={styles.picker} itemStyle={styles.pickerItem}
                                            selectedValue={this.state.rating}
                                            onValueChange={(itemValue) => this.setState({ rating: itemValue })}
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="1" value={1} />
                                            <Picker.Item label="2" value={2} />
                                            <Picker.Item label="3" value={3} />
                                            <Picker.Item label="4" value={4} />
                                            <Picker.Item label="5" value={5} />
                                        </Picker>
                                        </View>
                                    </View>
                                    )}


                                </View>


                                <View style={styles.controlli}>
                                    <View style={styles.buttonview}>
                                        {/*Se la recensione è stata lasciata allora non posso modificarla*/}
                                        {/*Se la recensione non è stata lasciata allora devo lasciarla*/}

                                {this.review_left === false && (
                                           <Button text="Recensisci" onPress={() => {
                                            this.LeaveReview();}} />
                                )}
                                {this.review_left === true && (
                                           <Button text="Indietro" onPress={() => {
                                            this.props.navigation.navigate('LeaveShowReviewShop');}} />
                                )}
                                    </View>
                                </View>



                                <View style={{paddingTop: 10}}></View>
                                <Text style={{color: 'red'}}>{this.state.error_message}</Text>
                                <View style={{paddingTop: 10}}></View>

                                {this.review_left === false && (
                                <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 5}}>
                                    <Text>I campi contrassegnati con</Text>
                                    <Text style={styles.asteriskStyle}>*</Text>
                                    <Text>sono obbligatori.</Text>
                                </View>
                                )}

                            </View>
                        </Card>
                    </View>
                </ScrollView>
            </View>



        );
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    title: {
        fontSize: 20,
        marginVertical: 10,
        marginLeft: 20
    },
    buttonview: {
        width: 160,
        paddingRight: 5,
        paddingLeft: 5
    },
    inputContainer: {
        minWidth: '96%'
    },
    controlli: {
        paddingTop: 20,
        paddingRight: 5,
        alignItems: 'center'
    },
    data: {
        paddingTop: 20,
        paddingLeft: 10
    },
    entryTitle: {
        marginBottom: 5,
        marginTop: 9,
        flexDirection: 'row'
    },
    textTitle: {
        fontWeight: 'bold'
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
    textContainer: {
        borderWidth: 1,
        height: 28,
        width: width - width / 2,
        marginLeft: 10,
        marginBottom: 3,
        marginTop: 3
    },
    asteriskStyle: {
        marginLeft: 3,
        marginRight: 3,
        color: 'red'
    },
    picker: {
        marginLeft: 10,
        width: width - width / 2,
        height: 28,
        backgroundColor: '#e7e7e7',
        marginBottom: 3,
        marginTop: 3
    },
    pickerItem: {
        color: 'white'
    }
});
