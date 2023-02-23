import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_LIMIT = SCREEN_WIDTH / 2;

class Tinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        };
        const position = new Animated.ValueXY();
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gesture) => {
                position.setValue({ x: gesture.dx, y: 0 });
            },
            onPanResponderRelease: (e, gesture) => {
                if (gesture.dx > SWIPE_LIMIT) {
                    this.swiped('right');
                } else if (gesture.dx < -SWIPE_LIMIT) {
                    this.swiped('left');
                } else {
                    this.resetPosition();
                }
            },
        });
        this.position = position;
    }


    componentDidMount = () => {
        this.setState({
            ind: 0,
            jjj: 3
        })
    }

    onShortList = async (itemId) => {
        //     console.log("sasasasa", itemId);
        //     let dataObj = {
        //         "id": itemId,
        //         "statusId": 1,
        //         "userId": 7,
        //         "filterType": 0
        //     }
        //    await axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     }).then((response) => {
        //         console.log("response", response.data);
        //     })
        this.getProductList();
    }

    getProductList = () => {

        axios.get(baseUrl + "Product/GetAllProducts?pageNumber=1&pageSize=10&filterType=0&v=55")
            .then((response) => {
                // setProduct(response.data.data)
                console.log("aaaaa", response.data);
            })
    }

    onDiscard = (itemId) => {
        // console.log("sasasasa", itemId);
        let dataObj = {
            "id": itemId,
            "statusId": 3,
            "userId": 7,
            "filterType": 0
        }
        axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            console.log("response", response.data);
        })
    }

    swiped(direction) {
        const x = direction === 'right' ? SCREEN_WIDTH * 3 : -SCREEN_WIDTH * 3;
        Animated.timing(this.position, {
            toValue: { x: x, y: 0 }
        }).start(() => {
            this.position.setValue({ x: 0, y: 0 }),
                this.setState({ ind: this.state.ind + 1, jjj: this.state.jjj + 1 }, () => {
                    // console.log("aaaaa", this.state.index, this.props.data.length, this.state.ind, this.state.jjj);
                    if (this.state.ind == this.props.data.length) {
                        this.setState({
                            ind: 0,
                            jjj: 3
                        })
                    }
                });
        });
    }
    resetPosition() {
        Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            stiffness: 200,
        }).start();
    }
    mycardStyle() {
        const rotate = this.position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
            outputRange: ['-120deg', '0deg', '120deg'],
        });
        return {
            ...this.position.getLayout(),
            transform: [{ rotate: rotate }],
        };
    }
    rendercard() {
        if (this.state.index >= this.props.data.length) {
            // console.log("index", this.state.index, this.props.data.length);
            if (this.state.index == this.props.data.length - 1) {
                this.setState({
                    index: 0
                })
            }
        }
        return this.props.data
            .slice(this.state.ind, this.state.jjj)
            .map((item, i) => {
                if (i < this.state.index) {
                    return null;
                }
                if (i === this.state.index) {
                    return (
                        <View style={{ height: "100%" }}>
                            <Animated.View
                                key={item.id}
                                style={[this.mycardStyle(), styles.cardStyle]}
                                {...this.panResponder.panHandlers}>
                                {this.props.renderCards(item)}
                            </Animated.View>
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "80%", position: "absolute", bottom: 30 }}>
                                <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                    onPress={() => this.onDiscard(item.id)}
                                >
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                    onPress={() => this.onShortList(item.id)}>
                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }
                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.cardStyle,
                            {
                                top: -7 * (i - this.state.index),
                                paddingLeft: 2 * (i - this.state.index),
                                paddingRight: 2 * (i - this.state.index),
                            },
                        ]}>
                        {this.props.renderCards(item)}
                    </Animated.View>
                );
            })
            .reverse();
    }
    render() {
        return <View>{this.rendercard()}</View>;
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        position: 'absolute',
        // zIndex: 1,
        width: SCREEN_WIDTH,
        height: 500,
    },
});

export default Tinder;
