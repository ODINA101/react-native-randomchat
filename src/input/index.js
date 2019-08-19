//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'
import { TouchableRipple } from 'react-native-paper';

// create a component
class Input extends Component {
    render() {
        return (
            <View style={styles.container}>

                <TextInput style={{
                    flex: 1,
                    backgroundColor: '#161934',
                    borderRadius: 30,
                    color: "#FFF",
                    padding: 12

                }}
                    onChangeText={(text) => this.props.onChangeText(text)}
                    placeholderTextColor="#34385e"
                    placeholder="დაწერე შეტყობინება..."
                    value={this.props.value}
                />
                <View style={{ width: 15 }} />
                <TouchableRipple borderless={true} onPress={() => { this.props.send() }} style={{ width: 46, elevation: 5, height: 46, justifyContent: 'center', borderRadius: 23, backgroundColor: '#a77af4', alignItems: 'center' }}>
                    <Feather name="send" color='#FFF' size={25} />
                </TouchableRipple>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#1f2248',
        borderTopWidth: 2,
        borderColor: '#292c54',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20

    },
});

//make this component available to the app
export default Input;
