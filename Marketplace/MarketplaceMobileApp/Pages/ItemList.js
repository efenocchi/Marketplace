import React, {Component} from 'react';
import {ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableHighlight, View, YellowBox} from "react-native";
import CardItem from "../components/CardItem";
import styles from "react-native/RNTester/js/examples/Border/BorderExample";
import {useNavigation} from "@react-navigation/native";
import {useRoute} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

class ItemList extends Component {

    constructor(props){
        super(props);
        this.state ={
            isLoading: true
        }
    }

    componentDidMount() {
        this.fetchProfile();
        this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          () => {
            this.setState({
                isLoading: true
            });
            this.fetchProfile();
          }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    /* FACCIO IL FETCH DELL'UTENTE */
    fetchProfile() {
        return fetch('http://5.88.60.56:8000/api/users/profile/' + 29 + '/?format=json')
        .then((response) => response.json())
        .then((responseJson) => {

        this.setState({
            isLoading: false,
            dataSource: responseJson
        }, function(){

        });

        })
        .catch((error) =>{
        this.fetchProfile();
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

        data = this.state.dataSource;

        let label_annunci_di = 'Item di ' + data.user.username;


        return(
        <View>
            <FlatList
                  renderItem={({item}) => <CardItem item={item} />}
            />
            <Text style={styles.title}>{label_annunci_di}</Text>
        </View>
        );

    }
}

export default ItemList;