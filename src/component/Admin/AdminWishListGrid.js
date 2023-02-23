import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, TextInput, Keyboard, BackHandler, Linking, PanResponder, TouchableOpacity, SafeAreaView, Modal, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AutoScroll from "@homielab/react-native-auto-scroll";
import Octicons from "react-native-vector-icons/Octicons";
import ImageZoom from 'react-native-image-pan-zoom';
import Reload from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseUrl } from '../ApiConfigs/baseUrl';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowLeft from 'react-native-vector-icons/FontAwesome';

export default function AdminWishListGrid({ }) {

    const navigation = useNavigation();

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SWIPE_LIMIT = SCREEN_WIDTH / 2;

    const [index, setIndex] = useState(0);
    const [shortList, setShortList] = useState([]);
    const [onModal, setOnModal] = useState(false);
    const [modalImage, setModalImage] = useState(0);
    const [ind, setInd] = useState();
    const [jjj, setJJJ] = useState();
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState("");
    const [pageCount, setPageCount] = useState();
    const [fetchData, setFetchData] = useState(false);
    const [RecordCount, setRecordCount] = useState();
    const [showSearch, setShowSearch] = useState(false);
    const [showCount, setshowCount] = useState(true);

    const position = new Animated.ValueXY({ x: 0, y: 0 });

    const pageCnt = useRef(1);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            navigation.dispatch(DrawerActions.closeDrawer());
            setShowSearch(false);
            pageNumber.current = 1;
            pageCnt.current = 1;
            setSearch('');
            getShortList();
            setInd(0);
            setJJJ(3);
            return () => {

            };
        }, [])
    );

    const backAction = () => {
        navigation.goBack();
        return true;
    }

    const pageNumber = useRef(1);

    const getShortList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");

        var pageNo = pageNumber.current;
        let dataObj = {
            "pageNumber": pageNo,
            "pageSize": 3,
            "statusID": 2,
            "filterType": filterType,
            "search": search,
            "userID": token,
            "filtersList": [
                {
                    "name": "rating",
                    "filterValue": "3"
                },
                {
                    "name": "quantity",
                    "filterValue": "1-100"
                },
                {
                    "name": "price",
                    "filterValue": "1-10"
                }
            ]
        }
        axios.post(baseUrl + "Product/GetAdminProductsWithStatus", dataObj)
            .then((response) => {
                if (response.data) {
                    setPageCount(response.data.totalPages);
                    setRecordCount(response.data.totalCount);
                    if (response.data.totalPages == 0) {
                        setSearch("");
                        setFetchData(true);
                        setshowCount(false);
                    } else {
                        setFetchData(false);
                        setshowCount(true);
                    }
                    pageNo = pageNo + 3;
                    pageNumber.current = pageNo;

                    setShortList([...shortList, ...response.data.data]);
                    setLoader(false);
                } else {
                    setLoader(true);
                    setshowCount(true);

                }

            })
        //}
    }
    const getShortRecords = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");

        var pageNo = pageNumber.current;
        let dataObj = {
            "pageNumber": pageNo,
            "pageSize": 1,
            "statusID": 2,
            "filterType": filterType,
            "search": "",
            "userID": token,
            "filtersList": []
        }
        axios.post(baseUrl + "Product/GetAdminProductsWithStatus", dataObj)
            .then((response) => {
                if (response.data) {
                    // if (pageCount == undefined) {
                    setPageCount(response.data.totalPages);
                    setRecordCount(response.data.totalCount);

                    pageNo = pageNo + 1;
                    pageNumber.current = pageNo;

                    setShortList([...shortList, ...response.data.data]);
                    setLoader(false);

                } else {
                    setLoader(true);

                }

            })
        // }
    }

    const typeText = (text) => {
        setSearch(text);
    }

    const showSearchBox = () => {
        setShowSearch(!showSearch);
    }

    const searchData = () => {
        setFetchData(false);
        Keyboard.dismiss();
        setInd(0);
        setJJJ(3);
        pageNumber.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        getShortList();

    }



    const openModal = () => {
        setOnModal(true);
    }

    const selectImage = (ind) => {
        setModalImage(ind)
    }


    const openUrls = (item) => {
        Linking.openURL(item.companyUrl)
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
        onPanResponderRelease: (e, gesture) => {
            if (gesture.dx > SWIPE_LIMIT) {
                swiped('right');
            } else if (gesture.dx < -SWIPE_LIMIT) {
                swiped('left');
            } else {
                resetPosition();
            }
        },
    });

    const swiped = (direction) => {

        const x = direction === 'right' ? SCREEN_WIDTH * 3 : -SCREEN_WIDTH * 3;
        Animated.spring(position, {
            toValue: { x: x, y: 0 },
            useNativeDriver: true
        }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setInd(ind + 1);
            setJJJ(jjj + 1);
        });

        var cnt = pageCnt.current;
        pageCnt.current = cnt + 1;

        if (ind + 1 == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
        } else if (pageCnt.current > RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
        }
        else {
            setFetchData(false);
            setshowCount(true);
            getShortRecords();
        }

    };


    const rotate = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
        outputRange: ['-120deg', '0deg', '120deg'],
    });

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            stiffness: 200,
        }).start();
    };

    const onDiscard = async (itemId) => {
        Alert.alert(
            "Confirmation",
            "Are you want to Discard ?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => pressDiscard(itemId) }
            ]
        );
    }

    const pressDiscard = async (itemIdd) => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        let dataObj = {
            "id": itemIdd,
            "statusId": 0,
            "userId": token,
            "filterType": filterType
        }
        await axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            var pageNo = pageNumber.current;
            pageNumber.current = pageNo - 1;

            var cnt = pageCnt.current - 1;
            pageCnt.current = cnt;

        });

        //    console.log("RecordCount", RecordCount, "ind - 1", ind - 1);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind - 1);
            }
            swiped();
        }

        else {
            setFetchData(true);
            setshowCount(false);
        }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
        }

    }

    const onShortList = async (itemId) => {
        debugger;
        Alert.alert(
            "Confirmation message",
            "Are you want to shortlisted this item",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => pressShortList(itemId) }
            ]
        );
    }

    const pressShortList = async (itemIdd) => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        let dataObj = {
            "id": itemIdd,
            "statusId": 1,
            "userId": token,
            "filterType": filterType
        }
        await axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            var pageNo = pageNumber.current;
            pageNumber.current = pageNo - 1;

            var cnt = pageCnt.current - 1;
            pageCnt.current = cnt;
        })
        //console.log("RecordCount", RecordCount, "ind - 1", ind - 1);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind - 1);
            }
            swiped();
        }

        else {
            setFetchData(true);
            setshowCount(false);
        }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
        }
    }

    const cardView = (item) => {
        return (
            <View style={{ padding: "3%" }} key={item.id}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                    <View style={{ padding: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 0.1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomColor: "#284B4629", borderLeftColor: "#284B4629", borderRightColor: "#284B4629", borderTopColor: "#D1D1D1" }}>
                        <View style={styles.renderContainer}>
                            <View style={{ alignSelf: "flex-end", backgroundColor: "#FFFFFF", zIndex: 1 }}>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => openModal()}>
                                    <View>
                                        <FastImage
                                            style={styles.image}
                                            source={{
                                                uri: item.productImages[0].imageURL,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={{ height: 31, width: 31, backgroundColor: "#543A20", borderRadius: 3, position: "absolute", bottom: 10, right: 10, alignSelf: "flex-end", justifyContent: "center", alignItems: "center" }}
                                        onPress={() => openModal()}
                                    >
                                        <Octicons name='screen-full' size={18} color={"white"} />

                                    </TouchableOpacity>
                                </TouchableOpacity>
                                <View style={{ height: "8%" }}>
                                    <Text style={styles.description} numberOfLines={2}>{item.name}</Text>
                                </View>
                                <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#000000" }}>Prices :</Text>
                                <AutoScroll style={styles.scrolling}>
                                    <View style={{ flexDirection: "row" }}>
                                        {
                                            item.prices.map((itemData, i) => {
                                                return (
                                                    <View style={{ borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1 }}>
                                                        {
                                                            itemData.quantity == "" ?
                                                                null :
                                                                <View style={{ borderBottomWidth: 1 }}>
                                                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: "#000000" }}>{itemData.quantity}</Text>
                                                                </View>
                                                        }
                                                        <View style={{}}>
                                                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: "#000000", alignSelf: "center" }}>{itemData.price}</Text>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                    </View>
                                </AutoScroll>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontFamily: "HelveticaNeue Bold", color: "#00B100" }}>Delivery Time :</Text>
                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                        <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#00B100" }}>Quantity</Text>
                                        </View>
                                        <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#00B100" }}>Time</Text>
                                        </View>
                                    </View>
                                    <View style={{ height: 78 }}>
                                        {
                                            item.deliveries.map((del) => {
                                                return (
                                                    <View>
                                                        <View style={{ flexDirection: "row" }}>
                                                            <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                                                <Text style={{ fontFamily: "HelveticaNeue Medium", fontSize: 14, color: "#000000" }}>{del.quantityDays}</Text>
                                                            </View>
                                                            <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                                                <Text style={{ fontFamily: "HelveticaNeue Medium", fontSize: 14, color: "#000000" }}>{del.times}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })
                                        }
                                        <View style={{ alignSelf: "flex-end", marginRight: "2%" }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: "2%", color: "red" }}>{item.outOfStock == false ? null : "Out of Stock"}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%" }}>
                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                        <View style={{ backgroundColor: "#D1D1D1", justifyContent: "center", alignItems: "center" }}>
                                            <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#000000" }}>{item.joinYear} YRS</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => openUrls(item)}>
                                            <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#D1D1D1", width: 130 }} numberOfLines={1}> {item.centralLogoText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 27, width: 35 }}>
                                        <Image source={require('../Assets/Flag.png')} style={{ height: "100%", width: "100%" }} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={onModal}
                >
                    <SafeAreaView>
                        <View style={{ backgroundColor: "#000000", height: "100%" }}>
                            <View style={{ padding: "2%" }}>
                                <TouchableOpacity onPress={() => setOnModal(false)} style={{ alignSelf: "flex-end" }}>
                                    <Close name='close' size={25} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: '50%' }}>

                                <ImageZoom cropWidth={Dimensions.get('window').width}
                                    cropHeight={Dimensions.get('window').height - 200}
                                    imageWidth={400}
                                    imageHeight={400}
                                    style={{ paddingBottom: "30%" }}
                                >
                                    <View style={{ height: 400, width: "100%" }}>
                                        <FastImage
                                            style={styles.modalImage}
                                            source={{
                                                uri: shortList[ind].productImages[modalImage] && shortList[ind].productImages[modalImage].imageURL,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </View>
                                </ImageZoom>
                            </View>
                            <View style={{ marginTop: Platform.OS == "android" ? "18%" : "25%" }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {
                                        shortList[ind].productImages.map((img, i) => {
                                            return (
                                                <View style={{ borderRightWidth: 1, paddingLeft: 2 }}>
                                                    <TouchableOpacity onPress={() => selectImage(i)}>
                                                        <FastImage
                                                            style={styles.slideImage}
                                                            source={{
                                                                uri: img.imageURL,
                                                                priority: FastImage.priority.normal,
                                                            }}
                                                            resizeMode={FastImage.resizeMode.contain}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView>

                </Modal >
            </View>
        );
    };

    const reload = () => {
        setFetchData(false);
        Keyboard.dismiss();
        setInd(0);
        setJJJ(3);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        getShortList();
        setshowCount(false);

    }

    const renderCards = () => {
        return (

            <View style={{}}>
                {
                    fetchData ?
                        (
                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90%" }}>
                                <Text style={{ fontSize: 25 }}>No Record Found</Text>
                                <TouchableOpacity onPress={() => reload()}
                                    style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                >
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                        <Reload name='refresh' size={22} color="#A2A2A2" />
                                        <Text>  Refresh</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                        :
                        (
                            <View>
                                {
                                    shortList.slice(ind, jjj)
                                        .map((item, i) => {
                                            if (i == index) {
                                                return (
                                                    <View style={{ height: "100%" }}>
                                                        <Animated.View
                                                            style={{
                                                                position: 'absolute',
                                                                width: SCREEN_WIDTH - 30,
                                                                alignSelf: "center",
                                                                height: 552,
                                                                transform: [
                                                                    {
                                                                        translateX: position.x,
                                                                    },
                                                                    { rotate: rotate },
                                                                ],
                                                            }}
                                                            {...panResponder.panHandlers}>
                                                            {cardView(item)}
                                                        </Animated.View>

                                                        {
                                                            item.outOfStock == false ?
                                                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "85%", marginTop: Platform.OS == "android" ? 590 : 575, position: "absolute" }}>
                                                                    <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                        onPress={() => onDiscard(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                        onPress={() => onShortList(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
                                                                    </TouchableOpacity>
                                                                </View> :
                                                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "85%", marginTop: Platform.OS == "android" ? 590 : 575, position: "absolute" }}>
                                                                    <View style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                                                        onPress={() => onDiscard(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
                                                                    </View>
                                                                    <View style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                                                        onPress={() => onShortList(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
                                                                    </View>
                                                                </View>
                                                        }

                                                    </View>
                                                );
                                            } else {
                                                return (
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            width: SCREEN_WIDTH - 30,
                                                            top: -7 * (i - index),
                                                            paddingLeft: 2 * (i - index),
                                                            paddingRight: 2 * (i - index),
                                                            alignSelf: "center",
                                                            height: 552
                                                        }}>
                                                        {cardView(item)}
                                                    </View>
                                                );
                                            }
                                        })
                                        .reverse()}
                            </View>
                        )
                }
            </View>
        );
    };

    return (
        <SafeAreaView style={{ height: "100%" }}>
            <LinearGradient colors={['#FFFFFF', '#F2FDFB']} style={styles.container}>

                {
                    loader ?
                        <View style={{ justifyContent: 'center', height: "100%", alignItems: "center" }}>
                            <ActivityIndicator size="large" />
                        </View>
                        :
                        <View>
                            <View>
                                {
                                    showSearch ?
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: "2%", alignItems: "center" }}>
                                            <View style={{}}>
                                                <TouchableOpacity onPress={async () => {
                                                    navigation.goBack("AdminProduct")
                                                }}>
                                                    <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", width: "80%" }}>
                                                <TextInput placeholder=' Admin Search Product'
                                                    placeholderTextColor={"#585858"}
                                                    onChangeText={(text) => typeText(text)}
                                                    style={{ borderRightColor: "transparent", borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, height: 40, marginLeft: "2%", width: "80%", paddingLeft: "2%" }}
                                                    value={search}
                                                />
                                                <TouchableOpacity onPress={searchData} style={{ borderLeftColor: "transparent", borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, height: 40, alignItems: "center", justifyContent: "center", width: 40 }}>
                                                    <Image source={require('../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                                                    <View style={{ width: 25, height: 25 }}>
                                                        <Image source={require("../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ justifyContent: "center", height: 40 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "2%" }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "40%", marginLeft: "3%" }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("Product")}>
                                                        <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                    </TouchableOpacity>
                                                    <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium", marginTop: -5 }}>  Wishlisted</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "15%", marginRight: "2%" }}>
                                                    <TouchableOpacity onPress={() => showSearchBox()}>
                                                        <Image source={require('../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                                                        <View style={{ width: 25, height: 25 }}>
                                                            <Image source={require("../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                }
                            </View>
                            <View style={{ display: "flex", flexDirection: "row", width: "55%", justifyContent: "space-between", alignSelf: "center", height: "5%", marginTop: "2%" }}>
                                <TouchableOpacity onPress={() => navigation.goBack("AdminWishList")}>
                                    <Image source={require('../Assets/List.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <Image source={require('../Assets/Grid.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                            <View style={{}}>
                                {renderCards()}
                            </View>
                            {
                                showCount ?
                                    <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, alignSelf: "flex-end", position: "absolute", marginTop: Platform.OS == "android" ? 665 : 650, marginRight: "10%" }}>{pageCnt.current}/{RecordCount}</Text>
                                    : null
                            }
                        </View>

                }
            </LinearGradient>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%"
    },
    image: {
        width: '100%',
        height: 260
    },
    modalImage: {
        width: "100%",
        height: "100%"
    },
    slideImage: {
        height: 100,
        width: 100,
    },
    title: {
        color: "#F8810A",
        fontSize: 11,
        fontWeight: "bold",
        fontFamily: "HelveticaNeue Medium",
    },
    description: {
        color: "#000000",
        fontSize: 16,
    },
    scrolling: {
        wdith: "50%"
    }
});
