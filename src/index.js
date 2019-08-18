//import liraries

import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, StatusBar } from 'react-native';
import Input from '../src/input'
import Bubble from '../src/bubble'
import { Colors, TouchableRipple } from 'react-native-paper'
// create a component
class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#24274f" barStyle="light-content" />
                <ScrollView style={{ flex: 1, backgroundColor: '#161934' }} contentContainerStyle={{ backgroundColor: '#161934', padding: 15 }}>
                    <Bubble message="gamarjoba" />
                    <Bubble message="t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." />
                    <Bubble message="გამარჯობა ლამასო" me />
                </ScrollView>
                <View>
                    <View style={{ flexDirection: 'row', height: 50 }}>
                        <TouchableRipple onPress={() => { }} style={{ flex: 1, backgroundColor: Colors.red800, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: "#FFF", fontSize: 20 }}>STOP</Text>
                        </TouchableRipple>

                        <TouchableRipple onPress={() => { }} style={{ flex: 1, backgroundColor: '#a77af4', justifyContent: 'center', alignItems: 'center' }}>

                            <Text style={{ color: "#FFF", fontSize: 20 }}>NEXT</Text>
                        </TouchableRipple>

                    </View>
                    <Input />
                </View>
            </View >
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#161934',
        flex: 1
    },
});

//make this component available to the app
export default App;
