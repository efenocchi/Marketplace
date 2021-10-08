import React from 'react';
import { Text, View, StyleSheet} from 'react-native';
import styles from './styles';

const Home = (props) => {
    return (
        <View style={styles.page}>
            <Text style={styles.root}>Ciao!!pagina home</Text>
        </View>
    );

};

export default Home;