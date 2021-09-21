import React from 'react';
import { Header } from 'react-native-elements';
import { Icon } from 'native-base';

const CustomHeader = props => {
    return (
        <Header
            leftComponent={<Icon name="menu" style={{color: '#e1e1e1'}} onPress={() => props.parent.navigation.openDrawer()} />}
            centerComponent={{ text: 'Marketplace', style: { color: '#e1e1e1', fontFamily: 'satisfy', fontSize: 18 } }}
            containerStyle={{
                backgroundColor: '#232f3e',
                justifyContent: 'space-around',
            }}
            rightComponent={<Icon name="home" style={{color: '#e1e1e1'}} onPress={() => props.parent.navigation.navigate('ItemList')} />}
        />
    );
};

export default CustomHeader;