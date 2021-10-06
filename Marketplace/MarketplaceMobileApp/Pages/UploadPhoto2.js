import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
export default class UploadPhoto2 extends React.Component {

  constructor(props){
        super(props);
        this.state ={
            isLoading: true,
            photo: false,

        }
    }

  handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {

      this.state.photo = result;
      this.state.isLoading = false;
      console.log("entrato")
      console.log(this.state.photo.uri)
      this.props.navigation.navigate('AddItem',{photo_uri:this.state.photo});
    }


  };
  render() {

    // const { photo } = this.state;
    console.log("photo")
    console.log(this.state.photo["uri"])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick image" onPress={this.handleChoosePhoto} />

    </View>

    );
  }
}