import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, TextInput, Keyboard, BackHandler, Linking, PanResponder, TouchableOpacity, SafeAreaView, Modal, ScrollView, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
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
import StarRating from 'react-native-star-rating';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GridView() {

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
    const [buttonAction, setButtonAction] = useState(false);
    const [undo, setUndo] = useState(false);
    const [newArray, setNewArray] = useState([]);


    const position = new Animated.ValueXY({ x: 0, y: 0 });

    const pageCnt = useRef(1);
    const filter = useRef();
    const userIdValue = useRef();
    const endPoint = useRef();
    const userId = useRef();
    const filterDataText = useRef();
    const countryValue = useRef();
    const categoryValue = useRef();
    const supplierValue = useRef();
    const wishListValue = useRef();
    const concatArrayValue = useRef();

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            navigation.dispatch(DrawerActions.closeDrawer());
            setShowSearch(false);
            setLoader(true);
            pageNumber.current = 1;
            pageCnt.current = 1;
            setSearch('');
            setInd(0);
            setJJJ(3);
            clearAllFilter();
            getSearchText();
            getShortList();
            setUndo(false);
            return () => {

            };
        }, [])
    );

    const clearAllFilter = async () => {
        const filterName = await AsyncStorage.getItem("pageName");
        if (filterName != null && filterName != "wishList") {
            await AsyncStorage.setItem("navigationId", "0");
            reload();
        }
        await AsyncStorage.setItem("pageName", "wishList");
        const filterName1 = await AsyncStorage.getItem("pageName");
    }

    const backAction = () => {
        navigation.goBack();
        return true;
    }

    const getSearchText = async () => {
        const filterSearchdata = await AsyncStorage.getItem("filterText");
        if (filterSearchdata != null) {
            filterDataText.current = filterSearchdata;
            setSearch(filterSearchdata);
            console.log("Search Wish", filterDataText.current);
        }
        else {
            const filterName2 = await AsyncStorage.getItem("pageName");
            if (filterName2 == null && filterName2 == "wishList") {
                filterDataText.current = "";
                setSearch("");
            }
        }
        console.log("search valueee", filterSearchdata);
    }
    const pageNumber = useRef(1);

    const getShortList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");
        const wishListDataValue = await AsyncStorage.getItem("wishListFilterData");


        console.log("user Token", token);
        userId.current = token;

        var pageNo = pageNumber.current;

        let arr = [];
        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];
        let wishListArray = [];

        if (data == null) {
            filter.current = arr
        } else {
            filter.current = JSON.parse(data);
        }

        if (countryName == null) {
            countryValue.current = countryArray;
        } else {
            const uniqueArray = JSON.parse(countryName);
            console.log(uniqueArray);
            countryValue.current = uniqueArray;
        }


        if (categoryId == null) {
            categoryValue.current = categoryArray;
        } else {
            const uniqueArray = JSON.parse(categoryId);
            categoryValue.current = uniqueArray;
        }

        if (supplierId == null) {
            supplierValue.current = supplierArray;
        } else {
            const uniqueArray = JSON.parse(supplierId);
            supplierValue.current = uniqueArray;
        }

        if (wishListDataValue == null) {
            wishListValue.current = wishListArray;
        } else {
            const uniqueArray = JSON.parse(wishListDataValue);
            wishListValue.current = uniqueArray;
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current, wishListValue.current);
        concatArrayValue.current = concatArray.length;

        endPoint.current = "Product/GetAllProductsWithWishlist";

        let obj = {
            "pageNumber": pageNo,
            "pageSize": 3,
            "filterType": filterType,
            "search": filterDataText.current,
            "userId": token,
            "statusID": 2,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current,
            "wishlist": wishListValue.current
        }

        axios.post(baseUrl + endPoint.current, obj)

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
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");
        const wishListDataValue = await AsyncStorage.getItem("wishListFilterData");

        userId.current = token;

        var pageNo = pageNumber.current;

        let arr = [];
        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];
        let wishListArray = [];


        if (data == null) {
            filter.current = arr
        } else {
            filter.current = JSON.parse(data);
        }

        if (countryName == null) {
            countryValue.current = countryArray;
        } else {
            const uniqueArray = JSON.parse(countryName);
            console.log(uniqueArray);
            countryValue.current = uniqueArray;
        }


        if (categoryId == null) {
            categoryValue.current = categoryArray;
        } else {
            const uniqueArray = JSON.parse(categoryId);
            categoryValue.current = uniqueArray;
        }

        if (supplierId == null) {
            supplierValue.current = supplierArray;
        } else {
            const uniqueArray = JSON.parse(supplierId);
            supplierValue.current = uniqueArray;
        }

        if (wishListDataValue == null) {
            wishListValue.current = wishListArray;
        } else {
            const uniqueArray = JSON.parse(wishListDataValue);
            wishListValue.current = uniqueArray;
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current, wishListValue.current);
        concatArrayValue.current = concatArray.length;

        endPoint.current = "Product/GetAllProductsWithWishlist";

        let obj = {
            "pageNumber": pageNo,
            "pageSize": 1,
            "filterType": filterType,
            "search": filterDataText.current,
            "userId": token,
            "statusID": 2,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current,
            "wishlist": wishListValue.current
        }

        console.log("obj value", obj);

        axios.post(baseUrl + endPoint.current, obj)
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

    const showSearchBox = () => {
        setShowSearch(!showSearch);
    }

    const searchData = () => {
        setFetchData(false);
        Keyboard.dismiss();
        setInd(0);
        setJJJ(3);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        AsyncStorage.setItem("filterText", filterDataText.current);
        getShortList();
    }


    const reload = () => {
        AsyncStorage.setItem("navigationId", "0");
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
        AsyncStorage.removeItem("filterValueData");
        AsyncStorage.removeItem("wishListFilterData");
        filterDataText.current = "";
        setSearch('');
        setPageCount(10);
        setInd(0);
        setJJJ(3);
        setFetchData(false);
        setshowCount(false);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        getShortList();
        setLoader(true);
        setUndo(false);

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
        // console.log(pageCnt.current, RecordCount, ind, "current page");

        // if (ind + 1 == RecordCount) {
        //     if (buttonAction == true) {
        //         setFetchData(false);
        //         setshowCount(true);
        //         setButtonAction(false);
        //         setUndo(true);
        //     }
        //     else {
        //         setSearch("");
        //         setFetchData(true);
        //         setshowCount(false);
        //         setUndo(false);
        //     }
        // } else 
        if (pageCnt.current > RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
            setLoader(false);
        }
        else {
            setFetchData(false);
            setshowCount(true);
            setLoader(true);
            getShortRecords();
            setUndo(true);

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
            "statusId": 3,
            "userId": parseInt(token),
            "wishlishStatus": false
        }
        await axios.post(baseUrl + "Product/UpdateProductWishlist", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            var pageNo = pageNumber.current;
            pageNumber.current = pageNo - 1;

            // var cnt = pageCnt.current - 1;
            // pageCnt.current = cnt;

            setLoader(true);
            let productIndex_ = 0;
            shortList.forEach((item, index11) => {
                if (item.id == itemIdd) {
                    productIndex_ = index11;
                }
            });
            shortList.splice(productIndex_, 1);

            console.log("in discard", JSON.stringify(shortList));
            getShortRecords();

        });

        // const filterShortList = shortList.filter((item) => item.id !== itemIdd);
        // shortList.splice(1, shortList.length, ...filterShortList);

        // console.log(ind, "current index");

        // setButtonAction(true);
        // if (RecordCount > 1) {
        //     if (ind > 1) {
        //         setInd(ind - 1);
        //     }
        //     swiped();
        // }

        // else {
        //     setFetchData(true);
        //     setshowCount(false);
        //     setUndo(false);
        // }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
        }

    }

    const onShortList = async (itemId) => {
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
            "userId": parseInt(token),
            "filterType": filterType
        }
        await axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {

            var pageNo = pageNumber.current;
            pageNumber.current = pageNo - 1;

            // var cnt = pageCnt.current - 1;
            // pageCnt.current = cnt;

            setLoader(true);
            let productIndex_ = 0;
            shortList.forEach((item, index11) => {
                if (item.id == itemIdd) {
                    productIndex_ = index11;
                }
            });
            shortList.splice(productIndex_, 1);

            console.log("in discard", JSON.stringify(shortList));
            getShortRecords();

        });

        // const filterShortList = shortList.filter((item) => item.id !== itemIdd);
        // shortList.splice(1, shortList.length, ...filterShortList);

        // setButtonAction(true);
        // if (RecordCount > 1) {
        //     if (ind > 1) {
        //         setInd(ind - 1);
        //     }
        //     // swiped();
        // }

        // else {
        //     setFetchData(true);
        //     setshowCount(false);
        //     setUndo(false);
        // }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
        }
    }

    const cardView = (item) => {
        return (
            <View style={{ padding: "3%" }} key={item.id}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                    <View style={{ padding: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomColor: "#284B4629", borderLeftColor: "#284B4629", borderRightColor: "#284B4629", borderTopColor: "#D1D1D1" }}>
                        <View style={styles.renderContainer}>
                            <View style={{ alignSelf: "flex-start", backgroundColor: "#FFFFFF", zIndex: 1 }}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={item.productRate}
                                    selectedStar={(rating) => console.log(rating)}
                                    starSize={15}
                                    fullStarColor={"#FEDE12"}
                                />
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
                                        <View style={{ alignSelf: "flex-end" }}>
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
                                            <Text style={{ fontWeight: "bold", fontSize: 14, color: "#D1D1D1", width: 130 }} numberOfLines={1}> {item.centralLogoText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ height: 27, width: 35 }}>
                                        <Image source={{ uri: "http://apijiffygifts.nubiz.co.in/files/flags/" + item.flag }} style={{ height: "100%", width: "100%" }} />
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


    const getPreviousCard = () => {
        if (pageCnt.current == 2) {
            setUndo(false);
        }
        if (pageCnt.current > 1) {
            setInd(ind - 1);
            setJJJ(jjj - 1);
            var pageNo = pageNumber.current;
            pageNumber.current = pageNo - 1;
            var cnt = pageCnt.current - 1;
            pageCnt.current = cnt;
            // shortList.splice(shortList.length - 1, 1);
        } else {
            setInd(ind);
            setJJJ(jjj);
            pageCnt.current = 1;
            pageNumber.current = pageNumber.current;
            setUndo(false);
            setButtonAction(false)
        }
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
                                        <Text>{concatArrayValue.current === 0 ? "  Reload" : "  Clear filter"}</Text>
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
                                                            item.isApprove == true || item.isDiscard == true ?
                                                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "85%", marginTop: Platform.OS == "android" ? 590 : 575, position: "absolute" }}>
                                                                    <View style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                                                        onPress={() => onDiscard(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Remove</Text>
                                                                    </View>
                                                                    <View style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                                                        onPress={() => onShortList(item.id)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
                                                                    </View>
                                                                </View> :
                                                                <View>
                                                                    {
                                                                        item.outOfStock == false ?
                                                                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "85%", marginTop: Platform.OS == "android" ? 590 : 575, position: "absolute" }}>
                                                                                <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                                    onPress={() => onDiscard(item.id)}
                                                                                >
                                                                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Remove</Text>
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
                                                                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Remove</Text>
                                                                                </View>
                                                                                <View style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                                                                    onPress={() => onShortList(item.id)}
                                                                                >
                                                                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Shortlist</Text>
                                                                                </View>
                                                                            </View>
                                                                    }
                                                                </View>

                                                        }

                                                    </View>
                                                );
                                            }
                                            // else {
                                            //     return (
                                            //         <View
                                            //             style={{
                                            //                 position: 'absolute',
                                            //                 width: SCREEN_WIDTH - 30,
                                            //                 top: -7 * (i - index),
                                            //                 paddingLeft: 2 * (i - index),
                                            //                 paddingRight: 2 * (i - index),
                                            //                 alignSelf: "center",
                                            //                 height: 552
                                            //             }}>
                                            //             {cardView(item)}
                                            //         </View>
                                            //     );
                                            // }
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
                                        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: "2%", alignItems: "center", width: "97.5%" }}>
                                            <View style={{}}>
                                                <TouchableOpacity onPress={() => navigation.navigate("Product")}>
                                                    <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: "center", width: "80%" }}>
                                                <TextInput
                                                    placeholder='Search Product'
                                                    placeholderTextColor={"#585858"}
                                                    onChangeText={(text) => typeText(text)}
                                                    style={{ borderRightColor: "transparent", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1", borderLeftColor: "#D1D1D1", borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, height: 40, marginLeft: "2%", width: "80%", paddingLeft: "2%", borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                                                    value={filterDataText.current}
                                                />
                                                <TouchableOpacity onPress={searchData} style={{ borderLeftColor: "transparent", borderRightColor: "#D1D1D1", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1", borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, height: 40, alignItems: "center", justifyContent: "center", width: 40, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                                                    <Image source={require('../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => {
                                                navigation.navigate("Filter", {
                                                    totalCount: RecordCount,
                                                    categoryName: search,
                                                    productFilterId: 4
                                                })
                                            }}>
                                                <FilterIcon name='filter-outline' size={25} color={"#585858"} />
                                            </TouchableOpacity>
                                            <View>
                                                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                                                    <View style={{ width: 25, height: 25 }}>
                                                        <Image source={require("../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        :
                                        <View style={{ justifyContent: "center", height: 40, width: "100%", alignSelf: "center" }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "2%" }}>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "40%", marginLeft: "3%" }}>
                                                    <TouchableOpacity onPress={() => navigation.navigate("Product")}>
                                                        <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                    </TouchableOpacity>
                                                    <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium", marginTop: -5 }}>  Wishlisted</Text>
                                                </View>
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "25%", marginRight: "2%" }}>
                                                    <TouchableOpacity onPress={() => showSearchBox()}>
                                                        <Image source={require('../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => {
                                                        navigation.navigate("Filter", {
                                                            totalCount: RecordCount,
                                                            categoryName: search,
                                                            productFilterId: 4
                                                        })
                                                    }}>
                                                        <View style={{ position: "absolute", alignSelf: "flex-end", top: -3, right: -1, zIndex: 2, backgroundColor: concatArrayValue.current === 0 ? "transparent" : "red", borderRadius: 30, width: 15, height: 15, alignItems: "center", justifyContent: "center" }}>
                                                            <Text style={{ color: "white", fontFamily: "Poppins-SemiBold", fontSize: 12 }}>{concatArrayValue.current === 0 ? null : concatArrayValue.current}</Text>
                                                        </View>
                                                        <FilterIcon name='filter-outline' size={25} color={"#585858"} />
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
                                <TouchableOpacity onPress={() => navigation.goBack("WishList")}>
                                    <Image source={require('../Assets/List.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate("GridView")}>
                                    <Image source={require('../Assets/Grid.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ position: "absolute", marginTop: 240, zIndex: 2, justifyContent: "space-between", flexDirection: "row", width: "96%", display: "flex", alignSelf: "center" }}>
                                {
                                    undo ?
                                        <TouchableOpacity
                                            onPress={() => getPreviousCard()}
                                            style={{}}
                                        >
                                            <Image source={require('../Assets/Arrowright.png')} style={{ height: 35, width: 35, opacity: 0.8, transform: [{ rotate: '180deg' }] }} />
                                        </TouchableOpacity> :
                                        <View />
                                }
                                {
                                    fetchData == false ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                swiped()
                                            }}
                                            style={{}}
                                        >
                                            <Image source={require('../Assets/Arrowright.png')} style={{ height: 35, width: 35, opacity: 0.8 }} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <View style={{}}>
                                {renderCards()}
                            </View>
                            {
                                showCount ?
                                    <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, alignSelf: "flex-end", position: "absolute", marginTop: Platform.OS == "android" ? 673 : 658, marginRight: "10%" }}>{pageCnt.current}/{RecordCount}</Text>
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
        height: 245
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
