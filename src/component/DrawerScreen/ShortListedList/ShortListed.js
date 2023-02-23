import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image, TextInput, Keyboard, BackHandler, Linking, PanResponder, TouchableOpacity, SafeAreaView, Modal, ScrollView, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import AutoScroll from "@homielab/react-native-auto-scroll";
import Octicons from "react-native-vector-icons/Octicons";
import ImageZoom from 'react-native-image-pan-zoom';
import Reload from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ArrowLeft from 'react-native-vector-icons/FontAwesome';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StarRating from 'react-native-star-rating';

export default function ShortListed() {

    const navigation = useNavigation();

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SWIPE_LIMIT = SCREEN_WIDTH / 2;

    const [index, setIndex] = useState(0);
    const [showSearch, setShowSearch] = useState(false);
    const [shortList, setShortList] = useState([]);
    const [onModal, setOnModal] = useState(false);
    const [modalImage, setModalImage] = useState(0);
    const [undo, setUndo] = useState(false);
    const [ind, setInd] = useState();
    const [jjj, setJJJ] = useState();
    const [loader, setLoader] = useState(true);
    const [search, setSearch] = useState("");
    const [pageCount, setPageCount] = useState();
    const [fetchData, setFetchData] = useState(false);
    const [RecordCount, setRecordCount] = useState();
    const [showCount, setshowCount] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [buttonAction, setButtonAction] = useState(false);
    const [roleId, setRoleId] = useState("");
    const [newArray, setNewArray] = useState([]);
    const [dataValue, setDataValue] = useState();

    const position = new Animated.ValueXY({ x: 0, y: 0 });

    const pageCnt = useRef(1);
    const filter = useRef();
    const pageNumber = useRef(1);
    const userId = useRef();
    const userIdValue = useRef();
    const endPoint = useRef();
    const filterDataText = useRef();
    const countryValue = useRef();
    const categoryValue = useRef();
    const supplierValue = useRef();
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
            pageNumber.current = 1;
            pageCnt.current = 1;
            setSearch('');
            getShortList();
            setInd(0);
            setJJJ(3);
            clearAllFilter();
            getSearchText();
            getRoleId();
            setUndo(false);
            setLoader(true);
            return () => {

            };
        }, [])
    );

    const getRoleId = async () => {
        const roleId = await AsyncStorage.getItem("roleId");
        console.log(roleId);
        setRoleId(roleId);
    }
    const clearAllFilter = async () => {
        const filterName = await AsyncStorage.getItem("pageName");
        if (filterName != null && filterName != "shortList") {
            await AsyncStorage.setItem("navigationId", "0");
            reload();
        }
        await AsyncStorage.setItem("pageName", "shortList");
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
            console.log(filterDataText.current);
        }
        console.log("search valueee", filterSearchdata);
    }

    const getShortList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");

        userId.current = token;

        // const searchFilterValue = await AsyncStorage.getItem("filterText");
        // console.log("search text", search);

        var pageNo = pageNumber.current;
        let arr = [];

        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];

        if (data == null) {
            filter.current = arr
        } else {
            filter.current = JSON.parse(data);
            console.log("sasas", filter.current);
        }

        if (countryName == null) {
            countryValue.current = countryArray;
        } else {
            const uniqueArray = JSON.parse(countryName);
            console.log("unique arrayyyyyy", uniqueArray);
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

        if (userId.current == 7) {
            var UserIdData = await AsyncStorage.getItem("userId");
            if (UserIdData != null) {
                try {
                    userIdValue.current = parseInt(UserIdData);
                    console.log(userIdValue.current, "parse user id");
                }
                catch { userIdValue.current = 0; }
            }
            else {
                userIdValue.current = 0;
            }
            endPoint.current = "Product/GetAdminProductsWithStatus";
        } else {
            userIdValue.current = userId.current;
            endPoint.current = "Product/GetAllProductsWithStatus";
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current);
        const concatArray1 = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current, userIdValue.current);

        if (userId.current == 7) {
            concatArrayValue.current = concatArray1.length;
        } else {
            concatArrayValue.current = concatArray.length;
        }

        let obj = {
            "pageNumber": pageNo,
            "pageSize": 3,
            "filterType": filterType,
            "search": filterDataText.current,
            "userId": userIdValue.current,
            "statusID": 1,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current
        }

        console.log(obj);

        axios.post(baseUrl + endPoint.current, obj)
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
        const token = await AsyncStorage.getItem("authToken");
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");
        const searchFilterValue = await AsyncStorage.getItem("filterText");
        console.log("search text", search);

        console.log("user Token", token);

        userId.current = token;

        var pageNo = pageNumber.current;

        let arr = [];

        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];

        if (data == null) {
            filter.current = arr
        } else {
            filter.current = JSON.parse(data);
        }

        if (countryName == null) {
            countryValue.current = countryArray;
        } else {
            const uniqueArray = JSON.parse(countryName);
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

        if (userId.current == 7) {
            var UserIdData = await AsyncStorage.getItem("userId");
            if (UserIdData != null) {
                try {
                    userIdValue.current = parseInt(UserIdData);
                    console.log(userIdValue.current, "parse user id");
                }
                catch { userIdValue.current = 0; }
            }
            else {
                userIdValue.current = 0;
            }
            endPoint.current = "Product/GetAdminProductsWithStatus";
        } else {
            userIdValue.current = userId.current;
            endPoint.current = "Product/GetAllProductsWithStatus";
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current);
        const concatArray1 = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current, userIdValue.current);

        if (userId.current == 7) {
            concatArrayValue.current = concatArray1.length;
        } else {
            concatArrayValue.current = concatArray.length;
        }

        let obj = {
            "pageNumber": pageNo,
            "pageSize": 1,
            "filterType": filterType,
            "search": filterDataText.current,
            "userId": userIdValue.current,
            "statusID": 1,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current
        }

        console.log(obj);

        axios.post(baseUrl + endPoint.current, obj)
            .then((response) => {
                if (response.data) {

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
        AsyncStorage.removeItem("userId");
        filterDataText.current = "";
        setSearch('');
        setFetchData(false);
        Keyboard.dismiss();
        setInd(0);
        setJJJ(3);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setShortList(shortList.splice(0, shortList.length));
        getShortList();
        setshowCount(false);
        setUndo(false);
        setLoader(true);

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
            if (buttonAction == true) {
                setFetchData(false);
                setshowCount(true);
                setUndo(true);
                setButtonAction(false);
            }
            else {
                setSearch("");
                setFetchData(true);
                setshowCount(false);
                setUndo(false);
            }
        } else
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
                setUndo(true);
                setLoader(true);
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

    const onDiscard = async (itemId, ii) => {
        Alert.alert(
            "Confirmation",
            "Are you want to Discard ?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => pressDiscard(itemId, ii) }
            ]
        );
    }

    const pressDiscard = async (itemIdd, ii) => {

        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");


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
            // getShortList();
            getShortRecords();
        });


        // const filterShortList = shortList.filter((item) => item.id !== itemIdd);
        // shortList.splice(1, shortList.length, ...filterShortList);

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
            "Are you want to Approved this item ?",
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
        console.log("toookkeennn", token);

        let dataObj = {
            "id": itemIdd,
            "statusId": 4,
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

            setLoader(true);

            // var cnt = pageCnt.current - 1;
            // pageCnt.current = cnt;
            let productIndex_ = 0;
            shortList.forEach((item, index11) => {
                if (item.id == itemIdd) {
                    productIndex_ = index11;
                }
            });
            shortList.splice(productIndex_, 1);

            console.log("in discard", JSON.stringify(shortList));
            // getShortList();
            getShortRecords();
        })

        // const filterShortList = shortList.filter((item) => item.id !== itemIdd);
        // shortList.splice(1, shortList.length, ...filterShortList);

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
        // }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(false);

        }
    }

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


    const cardView = (item) => {
        return (
            <View style={{ padding: "3%" }} key={item.id}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                    {
                        item.isApprove == true ?
                            <Image source={require('../../Assets/Approved.png')} style={{ height: "45%", width: "45%", alignSelf: "center", position: "absolute", zIndex: 3, marginTop: "5%" }} resizeMode="contain" />
                            : item.isDiscard == true ?
                                <Image source={require('../../Assets/Discard.png')} style={{ height: "45%", width: "45%", alignSelf: "center", position: "absolute", zIndex: 3, marginTop: "5%" }} resizeMode="contain" />
                                : null

                    }
                    <View style={{ padding: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomColor: "#284B4629", borderLeftColor: "#284B4629", borderRightColor: "#284B4629", borderTopColor: "#D1D1D1", opacity: item.isApprove == true || item.isDiscard == true ? 0.5 : 1 }}>
                        <View style={styles.renderContainer}>
                            <View>
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
                                    <View style={{ flexDirection: "row", marginTop: "1%" }}>
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
                                        {
                                            item.outOfStock == false ?
                                                <View>
                                                    {
                                                        userId.current == 7 && item.users ? item.users.length !== 0 ?
                                                            <TouchableOpacity style={{ alignSelf: "flex-end", backgroundColor: "#FFFFFF", zIndex: 1, marginTop: "2%" }}
                                                                onPress={() => {
                                                                    setDataValue(item.id);
                                                                    setShowModal(true);
                                                                }}
                                                            >
                                                                <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", marginLeft: "5%", color: "black" }}>Shortlisted by - {item.users.length} user(s)</Text>
                                                            </TouchableOpacity> :
                                                            null :
                                                            null
                                                    }
                                                </View> :
                                                <View style={{ alignSelf: "flex-end" }}>
                                                    <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: "2%", color: "red" }}>Out of Stock</Text>
                                                </View>
                                        }
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "8%" }}>
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
                {
                    userId.current == 7 && item.id == dataValue ?
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={showModal}
                        >
                            <SafeAreaView>
                                <View style={{ height: "100%", justifyContent: "center", backgroundColor: "#000000aa", padding: "2%" }}>
                                    <View style={{ backgroundColor: "white", borderRadius: 7, width: "90%", alignSelf: "center", padding: "5%", maxHeight: "50%" }}>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View style={{}}>
                                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 22, color: "#2A2539" }}>Users List</Text>
                                            </View>
                                            <View style={{ padding: "2%" }}>
                                                <TouchableOpacity onPress={() => setShowModal(false)} style={{ alignSelf: "flex-end" }}>
                                                    <Close name='close' size={25} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <View style={{ width: "100%", borderWidth: 0.5, borderColor: "#707070" }}></View>
                                        <ScrollView style={{ width: "100%", marginTop: "5%" }}>
                                            {
                                                item.users.map((item, index) => {
                                                    console.log("modal item", item);
                                                    return (
                                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#2A2539" }}>{index + 1} .</Text>
                                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, color: "#2A2539", marginLeft: "5%" }}>{item}</Text>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                            </SafeAreaView>
                        </Modal > : null
                }
            </View>
        );
    };

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
                                                        {
                                                            userId.current == 7 ?
                                                                <View style={{ display: "flex", alignSelf: "center", width: "88%", marginTop: 600, position: "absolute", alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
                                                                    <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", backgroundColor: "transparent" }}
                                                                        onPress={() => onDiscard(item.id, i)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#284B46" }}>Discard</Text>
                                                                    </TouchableOpacity>
                                                                    <TouchableOpacity style={{ height: 50, width: 133, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                                        onPress={() => onShortList(item.id, i)}
                                                                    >
                                                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "#FFFFFF" }}>Approved</Text>
                                                                    </TouchableOpacity>

                                                                </View>
                                                                :
                                                                <View style={{ display: "flex", alignSelf: "center", width: "88%", marginTop: 600, position: "absolute", alignItems: "center" }}>
                                                                    {
                                                                        item.isApprove == true || item.isDiscard == true ?
                                                                            null
                                                                            :
                                                                            <View>
                                                                                {
                                                                                    item.outOfStock == false ?
                                                                                        <TouchableOpacity style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", backgroundColor: "#284B46" }}
                                                                                            onPress={() => onDiscard(item.id, i)}
                                                                                        >
                                                                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "white" }}>Discard</Text>
                                                                                        </TouchableOpacity> :
                                                                                        <View style={{ height: 50, width: 133, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", backgroundColor: "#284B46", opacity: 0.3 }}
                                                                                            onPress={() => onDiscard(item.id, i)}
                                                                                        >
                                                                                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 20, color: "white" }}>Discard</Text>
                                                                                        </View>
                                                                                }
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
                                            //                 height: 580
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
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "83%", marginTop: "2%", marginLeft: "5%" }}>
                                {
                                    showSearch == true ?
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                            <View style={{ flexDirection: "row", width: "92%", alignItems: "center" }}>
                                                <TouchableOpacity onPress={() => navigation.goBack("Product")}>
                                                    <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                                                </TouchableOpacity>
                                                <TextInput
                                                    placeholder='Search Product'
                                                    placeholderTextColor={"#585858"}
                                                    style={{ backgroundColor: 'white', fontSize: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#D1D1D1", width: "83%", height: 38, borderLeftWidth: 1, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, marginLeft: "2%", paddingLeft: "2%" }}
                                                    onChangeText={(text) => typeText(text)}
                                                    value={filterDataText.current}
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
                                                    <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium", marginTop: Platform.OS == "android" ? -4 : -3 }}>  Shortlisted</Text>
                                                </View>
                                            </View>
                                        </View>
                                }
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "15%", alignSelf: "center" }}>
                                    {
                                        showSearch == true ?
                                            null :
                                            <TouchableOpacity onPress={() => { setShowSearch(true) }} style={{ marginRight: "5%" }}>
                                                <Image source={require('../../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={() => navigation.navigate("Filter", {
                                        totalCount: RecordCount,
                                        categoryName: search,
                                        productFilterId: 3
                                    })}
                                        style={{ marginLeft: "3%" }}>
                                        <View style={{ position: "absolute", alignSelf: "flex-end", top: -3, right: -1, zIndex: 2, backgroundColor: concatArrayValue.current === 0 ? "transparent" : "red", borderRadius: 30, width: 15, height: 15, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: "white", fontFamily: "Poppins-SemiBold", fontSize: 12 }}>{concatArrayValue.current === 0 ? null : concatArrayValue.current}</Text>
                                        </View>
                                        <FilterIcon name='filter-outline' size={25} color={"#585858"} />
                                    </TouchableOpacity>

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
                                            onPress={() => {
                                                swiped();
                                            }}
                                            style={{}}
                                        >
                                            <Image source={require('../../Assets/Arrowright.png')} style={{ height: 35, width: 35, opacity: 0.8 }} />
                                        </TouchableOpacity> : null
                                }
                            </View>
                            <View style={{ marginTop: "5%" }}>
                                {renderCards()}
                            </View>
                            {
                                showCount ?
                                    <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, alignSelf: "flex-end", position: "absolute", marginTop: Platform.OS == "android" ? 655 : 645, marginRight: "10%" }}>{pageCnt.current}/{RecordCount}</Text>
                                    : null
                            }
                        </View>

                }
                {/* {
                    undo ?
                        <TouchableOpacity
                            onPress={() => getPreviousCard()}
                            style={{ position: "absolute", bottom: "13%", marginLeft: "8%" }}
                        >
                            <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, }}>Undo</Text>
                        </TouchableOpacity>
                        : null
                } */}
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
