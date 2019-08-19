//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableRipple } from 'react-native-paper'

// create a component
class Bubble extends Component {
    render() {
        return (
            <View style={{ marginTop: 20, alignItems: this.props.me ? 'flex-end' : 'flex-start' }}>
                <TouchableRipple borderless={true} onPress={() => { }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.me ? '#2a2d58' : '#857bfb', paddingHorizontal: 20, borderRadius: 25, paddingVertical: 14 }}>
                    <Text style={{ fontSize: 18, color: "#FFF" }}>{this.props.message}</Text>
                </TouchableRipple>
            </View>
        );
    }
}



//make this component available to the app
export default Bubble;
