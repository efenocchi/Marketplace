import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = props => {
return <View style={{...styles.card, ...props.style}}>{props.children}</View>
};

const styles = StyleSheet.create({
    card: {
        maxWidth: '96%',
        alignItems: 'center',
        elevation: 5,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 5
    }
});

export default Card;