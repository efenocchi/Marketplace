import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {Picker} from 'native-base';

const {width, height} = Dimensions.get('window');

export default class TakeProvinces extends Component {

    state = {
        provincia: global.provincia
    };

    render() {
        return (
            <Picker
                style={styles.picker} itemStyle={styles.pickerItem}
                selectedValue={this.state.provincia}
                onValueChange={(itemValue) => {global.provincia = itemValue;
                    this.setState({provincia: global.provincia});}}
                >
                <Picker.Item label="AG" value="AG" />
                <Picker.Item label="AL" value="AL" />
                <Picker.Item label="AN" value="AN" />
                <Picker.Item label="AO" value="AO" />
                <Picker.Item label="AP" value="AP" />
                <Picker.Item label="AQ" value="AQ" />
                <Picker.Item label="AR" value="AR" />
                <Picker.Item label="AT" value="AT" />
                <Picker.Item label="AV" value="AV" />
                <Picker.Item label="BA" value="BA" />
                <Picker.Item label="BG" value="BG" />
                <Picker.Item label="BI" value="BI" />
                <Picker.Item label="BL" value="BL" />
                <Picker.Item label="BN" value="BN" />
                <Picker.Item label="BO" value="BO" />
                <Picker.Item label="BR" value="BR" />
                <Picker.Item label="BS" value="BS" />
                <Picker.Item label="BT" value="BT" />
                <Picker.Item label="BZ" value="BZ" />
                <Picker.Item label="CA" value="CA" />
                <Picker.Item label="CB" value="CB" />
                <Picker.Item label="CE" value="CE" />
                <Picker.Item label="CH" value="CH" />
                <Picker.Item label="CL" value="CL" />
                <Picker.Item label="CN" value="CN" />
                <Picker.Item label="CO" value="CO" />
                <Picker.Item label="CR" value="CR" />
                <Picker.Item label="CS" value="CS" />
                <Picker.Item label="CT" value="CT" />
                <Picker.Item label="CZ" value="CZ" />
                <Picker.Item label="EN" value="EN" />
                <Picker.Item label="FC" value="FC" />
                <Picker.Item label="FE" value="FE" />
                <Picker.Item label="FG" value="FG" />
                <Picker.Item label="FI" value="FI" />
                <Picker.Item label="FM" value="FM" />
                <Picker.Item label="FR" value="FR" />
                <Picker.Item label="GE" value="GE" />
                <Picker.Item label="GO" value="GO" />
                <Picker.Item label="GR" value="GR" />
                <Picker.Item label="IM" value="IM" />
                <Picker.Item label="IS" value="IS" />
                <Picker.Item label="KR" value="KR" />
                <Picker.Item label="LC" value="LC" />
                <Picker.Item label="LE" value="LE" />
                <Picker.Item label="LI" value="LI" />
                <Picker.Item label="LO" value="LO" />
                <Picker.Item label="LT" value="LT" />
                <Picker.Item label="LU" value="LU" />
                <Picker.Item label="MB" value="MB" />
                <Picker.Item label="MC" value="MC" />
                <Picker.Item label="ME" value="ME" />
                <Picker.Item label="MI" value="MI" />
                <Picker.Item label="MN" value="MN" />
                <Picker.Item label="MO" value="MO" />
                <Picker.Item label="MS" value="MS" />
                <Picker.Item label="MT" value="MT" />
                <Picker.Item label="NO" value="NO" />
                <Picker.Item label="NU" value="NU" />
                <Picker.Item label="OR" value="OR" />
                <Picker.Item label="PA" value="PA" />
                <Picker.Item label="PC" value="PC" />
                <Picker.Item label="PD" value="PD" />
                <Picker.Item label="PE" value="PE" />
                <Picker.Item label="PC" value="PC" />
                <Picker.Item label="PD" value="PD" />
                <Picker.Item label="PE" value="PE" />
                <Picker.Item label="PG" value="PG" />
                <Picker.Item label="PI" value="PI" />
                <Picker.Item label="PN" value="PN" />
                <Picker.Item label="PO" value="PO" />
                <Picker.Item label="PR" value="PR" />
                <Picker.Item label="PT" value="PT" />
                <Picker.Item label="PU" value="PU" />
                <Picker.Item label="PV" value="PV" />
                <Picker.Item label="PZ" value="PZ" />
                <Picker.Item label="RA" value="RA" />
                <Picker.Item label="RC" value="RC" />
                <Picker.Item label="RE" value="RE" />
                <Picker.Item label="RG" value="RG" />
                <Picker.Item label="RI" value="RI" />
                <Picker.Item label="RM" value="RM" />
                <Picker.Item label="RN" value="RN" />
                <Picker.Item label="RO" value="RO" />
                <Picker.Item label="SA" value="SA" />
                <Picker.Item label="SI" value="SI" />
                <Picker.Item label="SO" value="SO" />
                <Picker.Item label="SP" value="SP" />
                <Picker.Item label="SR" value="SR" />
                <Picker.Item label="SS" value="SS" />
                <Picker.Item label="SU" value="SU" />
                <Picker.Item label="SV" value="SV" />
                <Picker.Item label="TA" value="TA" />
                <Picker.Item label="TE" value="TE" />
                <Picker.Item label="TN" value="TN" />
                <Picker.Item label="TO" value="TO" />
                <Picker.Item label="TP" value="TP" />
                <Picker.Item label="TR" value="TR" />
                <Picker.Item label="TS" value="TS" />
                <Picker.Item label="TV" value="TV" />
                <Picker.Item label="UD" value="UD" />
                <Picker.Item label="VA" value="VA" />
                <Picker.Item label="VB" value="VB" />
                <Picker.Item label="VC" value="VC" />
                <Picker.Item label="VE" value="VE" />
                <Picker.Item label="VI" value="VI" />
                <Picker.Item label="VR" value="VR" />
                <Picker.Item label="VT" value="VT" />
                <Picker.Item label="VV" value="VV" />
            </Picker>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        marginLeft: 10,
        marginRight: 100,
        width: width - width / 2,
        backgroundColor: '#e7e7e7',
        marginBottom: 4,
        marginTop: 0,
    },
    pickerItem: {
        color: 'white',
    }
});