//import liraries

import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet, StatusBar, Keyboard, AppState } from 'react-native';
import Input from '../src/input'
import Bubble from '../src/bubble'
import { setRootViewBackgroundColor } from 'react-native-root-view-background';
import socketIO from "socket.io-client"
import { Appbar, ActivityIndicator } from 'react-native-paper'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Snackbar from 'react-native-snackbar';
import PushNotification from 'react-native-push-notification'
import { TypingAnimation } from 'react-native-typing-animation';

const socket = socketIO('https://random-chat101.herokuapp.com', {
    transports: ['websocket'], jsonp: false
});

import { Colors, TouchableRipple } from 'react-native-paper'
// create a component
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            connectetPeerId: 0,
            peer: null,
            inputText: '',
            status: 'არანაირი',
            started: false,
            onlineUsers: 0,
            searching: false,
            appState: AppState.currentState,
            notificationsFailCount: 0,
            isTyping: false,
            StrangerIsTyping: false
        }
    }
    _handleAppStateChange = (nextAppState) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active'
        ) {
            console.log('App has come to the foreground!');
            this.setState({ notificationsCount: 0 })
        }
        this.setState({ appState: nextAppState });
    };
    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }



    isTyping = () => {
        if (!this.state.isTyping) {
            this.setState({ isTyping: true })
            socket.emit('typing', this.state.connectetPeerId);
            setTimeout(() => {
                socket.emit('stop typing', this.state.connectetPeerId);
                this.setState({ isTyping: false })
            }, 1500)
        }

    }


    componentDidMount() {
        // let fontName = 'arial_geo'
        // GlobalFont.applyGlobal(fontName)
        AppState.addEventListener('change', this._handleAppStateChange);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        setRootViewBackgroundColor('#161934');
        socket.connect();
        socket.on('connect', () => {
            console.log('connected to socket server');
        });

        socket.on('typing', () => {
            this.setState({ StrangerIsTyping: true })
        })


        socket.on('stop typing', () => {
            this.setState({ StrangerIsTyping: false })
        })


        socket.on('aborted', () => {
            if (this.state.appState !== 'active' && this.state.notificationsFailCount == 0) {
                this.setState({ notificationsFailCount: 1 })
                PushNotification.localNotification({
                    message: 'პარტნიორი გაითიშა 😪',
                    foreground: false,
                    priority: "high"

                });
            }
            Snackbar.show({
                color: '#FFF',
                title: 'პარტნიორი გაითიშა  😪',
                duration: Snackbar.LENGTH_SHORT,
            });
            this.setState({ started: false, status: 'არანაირი', searching: false, messages: [], StrangerIsTyping: false })
            socket.emit('ManualDisconnect')
        })


        socket.on('userCount', (data) => {
            this.setState({ onlineUsers: data })
        })
        socket.on('match', (data) => {
            //alert(JSON.stringify(data))
            this.setState({ messages: [], searching: false, connectetPeerId: data.id, peer: data.username, status: 'არის კონტაქტი' })
        })

        socket.on('incoming message', (data) => {
            if (this.state.appState !== 'active' && this.state.notificationsCount == 0) {
                this.setState({ notificationsCount: 1 })
                PushNotification.localNotification({
                    message: 'უცნობმა მოგწერათ!',
                    foreground: false,
                    priority: "high"

                });
            }
            let messages = this.state.messages;
            messages.push({
                msg: data.message,
                me: false
            })
            this.setState({ messages }, () => {

                this.scrollView.scrollToEnd({ animated: true }, 50);
            })
        })
    }
    _keyboardDidShow = () => {
        this.scrollView.scrollToEnd({ animated: true }, 50);
    }
    start = () => {
        socket.emit('new user', 'kikiu')
        this.setState({ started: true, status: 'იძებნება', searching: true })
    }
    sendMessage = () => {
        if (this.state.inputText) {
            socket.emit('new message', {
                message: this.state.inputText,
                partner: this.state.peer,
                partnerID: this.state.connectetPeerId
            })
            let messages = this.state.messages;
            let msg = this.state.inputText;
            messages.push({
                msg,
                me: true
            })
            this.setState({ inputText: '', messages }, () => {
                this.scrollView.scrollToEnd({ animated: true }, 50);
            })
        }

    }

    stopMessaging = () => {
        socket.emit('ManualDisconnect')
        this.setState({ started: false, status: 'არანაირი', searching: false, messages: [], StrangerIsTyping: false })
    }

    changePeer = () => {
        socket.emit('ManualDisconnect')
        this.setState({ started: true, status: 'იძებნება', searching: true, messages: [], StrangerIsTyping: false })
        socket.emit('new user', 'kikiu')
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#24274f" barStyle="light-content" />
                <Appbar theme={{ colors: { primary: '#24274f' } }} style={styles.bottom}>
                    <View style={{ flex: 1, flexDirection: 'row', padding: 8, justifyContent: 'space-between' }}>
                        <View style={{ flex: 0.5 }} />
                        <View style={{ flex: 1, justifyContent: 'center', paddingRight: 10 }}>
                            <Text style={{ color: "#FFF", fontWeight: 'bold' }}>სტატუსი: {this.state.status}</Text>
                        </View>
                        <View style={{ borderRadius: 40 }}>
                            <TouchableRipple borderless={true} style={{ borderRadius: 40 }} onPress={() => { }}>
                                <View style={{ flexDirection: 'row', borderRadius: 50, padding: 10 }}>
                                    <FontAwesome5 color="#FFF" name="users" size={20} />
                                    <Text style={{ fontSize: 18, paddingLeft: 10, paddingRight: 15, color: '#FFF' }}>{this.state.onlineUsers}</Text>
                                </View>
                            </TouchableRipple>
                        </View>


                    </View>
                </Appbar>
                <ScrollView onContentSizeChange={(width, height) => {
                    this.scrollView.scrollTo({ y: height })
                }} ref={ref => this.scrollView = ref} style={{ flex: 1, backgroundColor: '#161934' }} contentContainerStyle={{ backgroundColor: '#161934', marginBottom: 20, flexGrow: 1, padding: 15 }}>
                    {/* <Bubble message="gamarjoba" />
                    <Bubble message="t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)." />
                    <Bubble message="გამარჯობა ლამასო" me /> */}
                    {
                        this.state.messages.map((item) => {
                            return (
                                <Bubble message={item.msg} me={item.me} />
                            )
                        })
                    }
                    {
                        this.state.status == 'იძებნება' ? (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <ActivityIndicator size={'small'} animating={true} color={'#a77af4'} />
                            </View>
                        ) : (<View />)
                    }
                    {
                        this.state.StrangerIsTyping ? (

                            <View style={{ height: 40, width: 60, backgroundColor: '#22405f', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
                                <TypingAnimation
                                    dotColor="#a3b3c9"
                                    dotMargin={3}
                                    dotAmplitude={3}
                                    dotSpeed={0.15}
                                    dotRadius={3}
                                    dotX={-2}
                                    dotY={-5}
                                />
                            </View>
                        ) : <View />
                    }
                </ScrollView>
                <View>

                    {
                        this.state.started ? (

                            <View style={{ flexDirection: 'row', height: 50 }}>
                                <TouchableRipple onPress={() => { this.stopMessaging() }} style={{ flex: 1, backgroundColor: Colors.red800, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'arial_geo', color: "#FFF", fontSize: 20 }}>გათიშვა</Text>
                                </TouchableRipple>

                                <TouchableRipple disabled={this.state.searching} onPress={() => { this.changePeer() }} style={{ flex: 1, backgroundColor: this.state.searching ? '#d0d4d7' : '#a77af4', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'arial_geo', color: this.state.searching ? '#f2f3f4' : "#FFF", fontSize: 20 }}>შემდეგი</Text>
                                </TouchableRipple>

                            </View>
                        ) : (
                                <View style={{ height: 50 }}>
                                    <TouchableRipple onPress={() => { this.start() }} style={{ flex: 1, backgroundColor: '#a77af4', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'arial_geo' }}>დაწყება</Text>
                                    </TouchableRipple>
                                </View>
                            )
                    }
                    <Input value={this.state.inputText}
                        send={() => this.sendMessage()}
                        onChangeText={(text) => {
                            this.isTyping();
                            this.setState({ inputText: text })
                        }} />
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
