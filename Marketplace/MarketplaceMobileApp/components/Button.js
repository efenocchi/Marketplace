import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

const Button = ({text,onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#f0c14b',
    marginVertical: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  text: {
    fontSize: 16,
  },
})

export default Button;
