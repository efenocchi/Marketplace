import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

const Button = ({onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.root}>
      <Text style={styles.text}>rrrr</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#e47911',
    marginVertical: 10,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#a15e1b',
  },
  text: {
    fontSize: 16,
  },
})

export default Button;
