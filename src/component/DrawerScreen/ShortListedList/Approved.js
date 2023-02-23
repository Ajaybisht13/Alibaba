import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, TextInput, Keyboard, BackHandler, Linking, PanResponder, TouchableOpacity, SafeAreaView, Modal, ScrollView, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import AutoScroll from "@homielab/react-native-auto-scroll";
import Octicons from "react-native-vector-icons/Octicons";
import ImageZoom from 'react-native-image-pan-zoom';
import Reload from 'react-native-vector-icons/FontAwesome';
import ArrowRight from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowLeft from 'react-native-vector-icons/FontAwesome';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AdminShortListed({ route }) {

    const navigation = useNavigation();

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SWIPE_LIMIT = SCREEN_WIDTH / 2;

    const [index, setIndex] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [shortList, setShortList] = useState([]);
    const [onModal, setOnModal] = useState(false);
    const [modalImage, setModalImage] = useState(0);
    const [page, setPage] = useState(1);
    const [ind, setInd] = useState();
    const [jjj, setJJJ] = useState();
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState("");
    const [pageCount, setPageCount] = useState();
    const [fetchData, setFetchData] = useState(false);
    const [RecordCount, setRecordCount] = useState();
    const [showCount, setshowCount] = useState(false);
    const [showfilter, setShowFilter] = useState(false);
    const [undo, setUndo] = useState(false);

    const position = new Animated.ValueXY({ x: 0, y: 0 });

    const pageCnt = useRef(1);
    const filterDataText = useRef();

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            pageNumber.current = 1;
            pageCnt.current = 1;
            setSearch('');
            getShortList();
            setInd(0);
            setJJJ(3);
            getSearchText();
            clearAllFilter();
            setUndo(false);
            return () => {

            };
        }, [])
    );


    const clearAllFilter = async () => {
        const filterName = await AsyncStorage.getItem("pageName");
        if (filterName != null && filterName != "approve") {
            await AsyncStorage.setItem("navigationId", "0");
            reload();
        }
        await AsyncStorage.setItem("pageName", "approve");
        const filterName1 = await AsyncStorage.getItem("pageName");
    }

    const getSearchText = async () => {
        const filterSearchdata = await AsyncStorage.getItem("filterText");
        if (filterSearchdata != null) {
            filterDataText.current = filterSearchdata;
            setSearch(filterSearchdata);
            console.log(filterDataText.current);
        }
        console.log("search valueee", filterSearchdata);
    }


    const backAction = () => {
        navigation.goBack();
        return true;
    }

    const pageNumber = useRef(1);

    const getShortList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");

        var pageNo = pageNumber.current;
        let dataObj = {
            "pageNumber": pageNo,
            "pageSize": 3,
            "statusID": 4,
            "filterType": filterType,
            "search": search,
            "userID": 0,
            "filtersList": []
        }
        axios.post(baseUrl + "Product/GetAdminProductsWithStatus", dataObj)
            .then((response) => {
                if (response.data) {
                    setPageCount(response.data.totalPages);
                    setRecordCount(response.data.totalCount);
                    if (response.data.totalPages == 0) {
                        console.log("in get products");
                        setSearch("");
                        setFetchData(true);
                        setshowCount(false);
                    } else {
                        setshowCount(true);
                        setFetchData(false);
                    }
                    pageNo = pageNo + 3;
                    pageNumber.current = pageNo;

                    setShortList([...shortList, ...response.data.data]);
                    setLoader(false);
                } else {
                    setLoader(true);
                }

            })
        //}
    }
    const getShortRecords = async () => {
        const filterType = await AsyncStorage.getItem("Ali");

        var pageNo = pageNumber.current;
        let dataObj = {
            "pageNumber": pageNo,
            "pageSize": 1,
            "statusID": 4,
            "filterType": filterType,
            "search": search,
            "userID": 0,
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
        filterDataText.current = text;
    }

    const searchData = () => {
        setFetchData(false);
        Keyboard.dismiss();
        setInd(0);
        setJJJ(3);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        getShortList();
        setLoader(true);
        setshowCount(false);

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
        onStartShouldSetPanResponder: () => false,
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
            toValue: { x: 0, y: 0 },
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
            setUndo(false);
        } else if (pageCnt.current > RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(true);
        }
        else {
            setFetchData(false);
            setshowCount(true);
            setUndo(true);
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
        console.log("toookkeennn", token);
        let dataObj = {
            "id": itemIdd,
            "statusId": 3,
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

    const getPreviousCard = () => {
        if (pageCnt.current == 2) {
            setUndo(false);
        }
        if (pageCnt.current > 1) {
            setInd(ind - 1);
            setJJJ(jjj - 1);
            pageCnt.current = pageCnt.current - 1;
            pageNumber.current = pageNumber.current;
        } else {
            setInd(ind);
            setJJJ(jjj);
            pageCnt.current = 1;
            pageNumber.current = pageNumber.current;
            setUndo(false);
        }
    }

    const cardView = (item) => {
        console.log("Total", item);
        return (
            <View style={{ padding: "3%" }} key={item.id}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                    <View style={{ padding: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomColor: "#284B4629", borderLeftColor: "#284B4629", borderRightColor: "#284B4629", borderTopColor: "#D1D1D1", height: "100%" }}>
                        <View style={{}}>
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
                                <View style={{ height: 65 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: "#000000" }}>Prices :</Text>
                                    {
                                        item.prices.length < 3 ?
                                            <View style={styles.scrolling}>
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
                                            </View> :
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
                                    }
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontWeight: "bold", color: "#00B100" }}>Delivery Time :</Text>
                                    <View style={{ flexDirection: "row", marginTop: "2%" }}>
                                        <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 14, color: "#00B100" }}>Quantity</Text>
                                        </View>
                                        <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                            <Text style={{ fontWeight: "bold", fontSize: 14, color: "#00B100" }}>Time</Text>
                                        </View>
                                    </View>
                                    <View style={{}}>
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
                                        {/* <View style={{ alignSelf: "flex-end", backgroundColor: "#FFFFFF", zIndex: 1, marginTop: "3%" }}>
                                            <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", marginLeft: "5%", color: "black" }}>Shortlisted by - {item.users.length} user(s)</Text>
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", position: "absolute", bottom: "2%", width: "100%", alignSelf: "center" }}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                <View style={{ backgroundColor: "#D1D1D1", justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#000000" }}>{item.joinYear} YRS</Text>
                                </View>
                                <TouchableOpacity onPress={() => openUrls(item)}>
                                    <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 14, color: "#D1D1D1", width: 130 }} numberOfLines={1}> {item.centralLogoText}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ height: 27, width: 35 }}>
                                <Image source={require('../../Assets/Flag.png')} style={{ height: "100%", width: "100%" }} />
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
        AsyncStorage.removeItem("filterValue");
        AsyncStorage.removeItem("filterText");
        AsyncStorage.removeItem("countryName");
        AsyncStorage.removeItem("categoryId");
        AsyncStorage.removeItem("supplierId");
        AsyncStorage.removeItem("minValue");
        AsyncStorage.removeItem("maxValue");
        AsyncStorage.removeItem("minYearsValue");
        AsyncStorage.removeItem("maxYearsValue");
        AsyncStorage.removeItem("minQtyValue");
        AsyncStorage.removeItem("maxQtyValue");
        AsyncStorage.removeItem("jsonData");
        filterDataText.current = "";
        setSearch('');
        setFetchData(false);
        setShowFilter(false);
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
                                                                height: 580,
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
                                                        {/* <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "88%", marginTop: 592, position: "absolute" }}>
                                                            <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                onPress={() => onDiscard(item.id)}
                                                            >
                                                                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                onPress={() => onShortList(item.id)}
                                                            >
                                                                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Approved</Text>
                                                            </TouchableOpacity>
                                                        </View> */}
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
                                                            height: 580
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
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: showfilter == false ? "90%" : "85%", marginTop: "2%", marginLeft: "5%" }}>
                                {
                                    showSearch == true ?
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View style={{ flexDirection: "row", width: "92%", alignItems: "center" }}>

                                                <TouchableOpacity onPress={() => navigation.navigate("Product")}>
                                                    <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    placeholder='Search Product'
                                                    placeholderTextColor={"#A2A2A2"}
                                                    style={{ backgroundColor: 'white', fontSize: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#D1D1D1", width: showfilter == false ? "85%" : "83%", height: 38, borderLeftWidth: 1, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, marginLeft: "2%", paddingLeft: "2%" }}
                                                    onChangeText={(text) => typeText(text)}
                                                    value={search}
                                                />
                                                <View style={{ backgroundColor: 'white', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderTopWidth: 1, borderRightWidth: 1, borderRightColor: "#D1D1D1", borderBottomWidth: 1, height: 38, justifyContent: "center", alignItems: "center", width: 35, borderLeftColor: "#D1D1D1", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1" }}>
                                                    <TouchableOpacity onPress={searchData}>
                                                        {/* <ArrowRight name='long-arrow-right' size={22} color="#A2A2A2" /> */}
                                                        <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ justifyContent: "center", height: 40, width: "80%" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "2%" }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("Product")}>
                                                        <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                    </TouchableOpacity>
                                                    <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium", marginTop: Platform.OS == "android" ? -4 : -3 }}>  Approved</Text>
                                                </View>
                                            </View>
                                        </View>
                                }
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "15%", alignSelf: "center" }}>
                                    {
                                        showSearch == true ?
                                            null :
                                            <TouchableOpacity onPress={() => { setShowSearch(true) }}>
                                                <Image source={require('../../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                    }
                                    {
                                        showfilter == false ?
                                            null :
                                            <TouchableOpacity onPress={() => navigation.navigate("Filter")} style={{ marginLeft: "2%" }}>
                                                <FilterIcon name='filter' size={23} />
                                            </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())} style={{ marginLeft: showSearch == true ? "15%" : 0 }}>
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image source={require("../../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ position: "absolute", marginTop: 240, zIndex: 2, justifyContent: "space-between", flexDirection: "row", width: "96%", display: "flex", alignSelf: "center" }}>
                                {
                                    undo ?
                                        <TouchableOpacity
                                            onPress={() => getPreviousCard()}
                                            style={{}}
                                        >
                                            <Image source={require('../../Assets/Arrowright.png')} style={{ height: 35, width: 35, opacity: 0.8, transform: [{ rotate: '180deg' }] }} />
                                        </TouchableOpacity> :
                                        <View />
                                }
                                {
                                    fetchData == false ?
                                        <TouchableOpacity
                                            onPress={() => swiped()}
                                            style={{}}
                                        >
                                            <Image source={require('../../Assets/Arrowright.png')} style={{ height: 35, width: 35, opacity: 0.8 }} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <View style={{ marginTop: "5%" }}>
                                {renderCards()}
                            </View>
                        </View>

                }
                {
                    showCount ?
                        <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, alignSelf: "flex-end", position: "absolute", bottom: Platform.OS == "android" ? "8%" : "8%", marginRight: "10%" }}>{pageCnt.current}/{RecordCount}</Text>
                        : null
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
