import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, StyleSheet, View, Text, Animated, Image, TextInput, Linking, BackHandler, PanResponder, TouchableOpacity, SafeAreaView, Modal, ScrollView, Dimensions, ActivityIndicator, Alert, LogBox, Platform, Button } from 'react-native';
import axios from 'axios';
import AutoScroll from "@homielab/react-native-auto-scroll";
import Octicons from "react-native-vector-icons/Octicons";
import ImageZoom from 'react-native-image-pan-zoom';
import ArrowLeft from 'react-native-vector-icons/FontAwesome';
import ArrowRight from 'react-native-vector-icons/FontAwesome';
import Reload from 'react-native-vector-icons/FontAwesome';
import HeartPlus from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import CheckBox from '@react-native-community/checkbox';



LogBox.ignoreAllLogs();


export default function Product() {



    const navigation = useNavigation();

    const SCREEN_WIDTH = Dimensions.get('window').width;
    const SWIPE_LIMIT = SCREEN_WIDTH / 2;

    const [index, setIndex] = useState(0);
    const [product, setProduct] = useState([]);
    const [onModal, setOnModal] = useState(false);
    const [modalImage, setModalImage] = useState(0);
    const [ind, setInd] = useState();
    const [jjj, setJJJ] = useState();
    const [loader, setLoader] = useState(true);
    const [pageCount, setPageCount] = useState();
    const [search, setSearch] = useState("");
    const [fetchData, setFetchData] = useState(false);
    const [showCount, setshowCount] = useState(true);
    const [showIndicator, setShowIndicator] = useState(false);
    const [buttonAction, setButtonAction] = useState(false);
    const [likeStatus, setLikeStatus] = useState(false);
    const [likeModal, setLikeModal] = useState(false);
    const [collectionModal, setCollectionModal] = useState(false);
    const [modalCheckbox, setModalCheckbox] = useState(true);
    const [wishlistCategory, setWishlistCategory] = useState([]);
    const [itemId, setItemId] = useState();
    const [collectionName, setCollectionName] = useState("");
    const [wishlistCategoryId, setWishListCategoryId] = useState();

    const [undo, setUndo] = useState(false);

    const [RecordCount, setRecordCount] = useState();
    const position = new Animated.ValueXY({ x: 0, y: 0 });

    const pageCnt = useRef(1);
    const filter = useRef();
    const pageNumber = useRef(1);
    const filterDataText = useRef();
    const userId = useRef();
    const userIdValue = useRef();
    const endPoint = useRef();
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
            pageNumber.current = 1;
            pageCnt.current = 1;
            setSearch('');
            setLoader(true);
            setInd(0);
            setJJJ(3);
            getSearchText();
            getProductList();
            clearAllFilter();
            setUndo(false);
            getWishListCategory();
            return () => {

            };
        }, [])
    );
    const clearAllFilter = async () => {
        const filterName = await AsyncStorage.getItem("pageName");
        if (filterName != null && filterName != "product") {

            await AsyncStorage.setItem("navigationId", "0");
            reload();
        }

        await AsyncStorage.setItem("pageName", "product");
        const filterName1 = await AsyncStorage.getItem("pageName");



    }

    const backAction = () => {
        navigation.goBack();
        return true;
    };

    const getSearchText = async () => {
        const filterSearchdata = await AsyncStorage.getItem("filterText");
        if (filterSearchdata != null) {
            filterDataText.current = filterSearchdata;
            setSearch(filterSearchdata);
            console.log("in if", filterDataText.current);
        }
        console.log("search valueee", filterSearchdata);
    }

    const getProductList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");

        var pageNo = pageNumber.current;

        let arr = [];
        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];

        if (data == null) {
            filter.current = arr;
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
            userIdValue.current = token;
            endPoint.current = "Product/GetAdminProducts";
        } else {
            userIdValue.current = token;
            endPoint.current = "Product/GetAllUserProducts";
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current);
        concatArrayValue.current = concatArray.length;


        let obj = {
            "pageNumber": pageNo,
            "pageSize": 3,
            "filterType": filterType,
            "searchFilter": filterDataText.current,
            "userId": userIdValue.current,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current
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

                    setProduct([...product, ...response.data.data]);
                    setLoader(false);
                } else {
                    setLoader(true);
                }
            })
        //}
    }
    const getProductRecords = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const token = await AsyncStorage.getItem("authToken");
        const data = await AsyncStorage.getItem("filterValue");
        const countryName = await AsyncStorage.getItem("countryName");
        const categoryId = await AsyncStorage.getItem("categoryId");
        const supplierId = await AsyncStorage.getItem("supplierId");


        var pageNo = pageNumber.current;

        let arr = [];
        let countryArray = [];
        let categoryArray = [];
        let supplierArray = [];

        if (data == null) {
            filter.current = arr;
        } else {
            filter.current = JSON.parse(data);
            console.log("sasas", filter.current);
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
            userIdValue.current = token;
            endPoint.current = "Product/GetAdminProducts";
        } else {
            userIdValue.current = token;
            endPoint.current = "Product/GetAllUserProducts";
        }

        const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current);
        concatArrayValue.current = concatArray.length;


        let obj = {
            "pageNumber": pageNo,
            "pageSize": 1,
            "filterType": filterType,
            "searchFilter": filterDataText.current,
            "userId": userIdValue.current,
            "filtersList": filter.current,
            "countries": countryValue.current,
            "suppliers": supplierValue.current,
            "categories": categoryValue.current

        }

        // console.log(obj);

        axios.post(baseUrl + endPoint.current, obj)
            .then((response) => {
                if (response.data) {
                    setPageCount(response.data.totalPages);
                    setRecordCount(response.data.totalCount);

                    pageNo = pageNo + 1;
                    pageNumber.current = pageNo;

                    setProduct([...product, ...response.data.data]);
                    setLoader(false);
                    setShowIndicator(false);
                } else {
                    setLoader(true);
                }

            })
        // }
    }

    const getWishListCategory = async () => {
        const token = await AsyncStorage.getItem("authToken");

        axios.post(baseUrl + `Product/GetWishlistByUser?userId=${token}`)
            .then((response) => {
                let data_ = response.data.data;
                for (let i = 0; i < data_.length; i++) {
                    data_[i].isSelected = false;
                }
                data_[0].isSelected = true;
                setWishlistCategory(data_);
            })
    }


    const onWishListCategory = (item, index) => {
        for (let i = 0; i < wishlistCategory.length; i++) {

            if (index == i) {
                wishlistCategory[i].isSelected = !wishlistCategory[i].isSelected;
                item.isSelected = wishlistCategory[i].isSelected;

            } else {
                wishlistCategory[i].isSelected = false;
            }
            // setWishListCategoryId(item.id);
        }
    }

    const saveCollectionName = async () => {
        const token = await AsyncStorage.getItem("authToken");
        let dataObj = {
            "id": 0,
            "wishlistName": collectionName,
            "uidId": token
        }
        if (wishlistCategory.length < 2) {
            await axios.post(baseUrl + "Product/AddEditWishlistCommand", dataObj, {
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((response) => {
                setLikeModal(false);
                setCollectionModal(false);
                getWishListCategory();
            })
        } else {
            setLikeModal(false);
            setCollectionModal(false);
        }
    }


    const onLikeClick = async (itemId, item) => {
        setItemId(item);
        if (item.wishlist == true) {
            setLikeModal(false);
            pressLike(itemId, item);
        } else {
            setLikeModal(true);
        }
    }

    const pressLike = async (itemIdd, item) => {
        if (item.wishlist == false) {
            item.wishlist = true;
        } else {
            item.wishlist = false;
        }
        setLikeStatus(item.wishlist);
        const token = await AsyncStorage.getItem("authToken");
        const filterType = await AsyncStorage.getItem("Ali");
        let dataObj = {
            "id": itemIdd,
            "statusId": 2,
            "userId": token,
            "wishlishStatus": item.wishlist
        }
        console.log(dataObj);
        await axios.post(baseUrl + "Product/UpdateProductWishlist", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            var pageNo = pageNumber.current;
            pageNumber.current = pageNo;

            var cnt = pageCnt.current;
            pageCnt.current = cnt;
        });
        setButtonAction(true);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind);
            }
            // swiped();
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


    const onSavePress = async () => {
        setLikeModal(false);
        if (itemId.wishlist == false) {
            itemId.wishlist = true;
        } else {
            itemId.wishlist = false;
        }
        setLikeStatus(itemId.wishlist);
        const token = await AsyncStorage.getItem("authToken");
        const filterType = await AsyncStorage.getItem("Ali");
        let dataObj = {
            "id": itemId.id,
            "statusId": 2,
            "userId": token,
            "wishlishStatus": itemId.wishlist
        }
        console.log(dataObj);
        await axios.post(baseUrl + "Product/UpdateProductWishlist", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            var pageNo = pageNumber.current;
            pageNumber.current = pageNo;

            var cnt = pageCnt.current;
            pageCnt.current = cnt;
        });
        setButtonAction(true);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind);
            }
            // swiped();
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
                setButtonAction(false);
                setUndo(true);
            }
            else {
                setSearch("");
                setFetchData(true);
                setshowCount(false);
                setUndo(false);
            }
        } else if (pageCnt.current > RecordCount) {
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
            getProductRecords();

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
            useNativeDriver: true
        }).start();
    };

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
        //console.log("toookkeennn", token);
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
        setButtonAction(true);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind - 1);
            }
            swiped();
        }

        else {
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
        }
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
        setButtonAction(true);
        if (RecordCount > 1) {
            if (ind > 1) {
                setInd(ind - 1);
            }
            swiped();
        }

        else {
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
        }
        if (pageCnt.current == RecordCount) {
            setSearch("");
            setFetchData(true);
            setshowCount(false);
            setUndo(false);
        }
    }

    const typeText = (text) => {
        setSearch(text);
        filterDataText.current = text;
    }

    const searchData = () => {

        Keyboard.dismiss();
        setPageCount(10);
        setInd(0);
        setJJJ(3);
        setFetchData(false);
        pageNumber.current = 1;
        pageCnt.current = 1;
        setProduct(product.splice(0, product.length));
        setLoader(true);

        getProductList();


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
        setPageCount(10);
        setInd(0);
        setJJJ(3);
        setFetchData(false);
        setshowCount(false);
        pageNumber.current = 1;
        pageCnt.current = 1;
        filterDataText.current = "";
        setSearch('');
        setProduct(product.splice(0, product.length));
        getProductList();
        setLoader(true);
    }


    const cardView = (item, i) => {
        return (
            <View style={{ padding: "3%" }}>
                <View style={{ backgroundColor: "white", borderRadius: 10 }}>
                    <View style={{ padding: 10, borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, borderBottomColor: "#284B4629", borderLeftColor: "#284B4629", borderRightColor: "#284B4629", borderTopColor: "#D1D1D1" }}>
                        <View style={styles.renderContainer}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", zIndex: 1, alignItems: "center" }}>
                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={item.productRate}
                                    selectedStar={(rating) => console.log(rating)}
                                    starSize={15}
                                    fullStarColor={"#FEDE12"}
                                />
                                <TouchableOpacity onPress={() => onLikeClick(item.id, item)}>
                                    {
                                        item.wishlist ?
                                            <HeartPlus name='heart-plus' size={25} color="red" />
                                            :
                                            <HeartPlus name='heart-plus-outline' size={25} color="#A2A2A2" />
                                    }

                                </TouchableOpacity>
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
                                {/* <View style={{ marginTop: 5, backgroundColor: "#FFFFE0", width: "60%" }}>
                                    <Text style={styles.title}>{item.centralLogoText}</Text>
                                </View> */}
                                <View style={{ height: 65 }}>
                                    <Text style={{ fontWeight: "bold", fontSize: 14, color: "#000000" }}>Prices :</Text>
                                    {
                                        item.prices.length < 3 ?
                                            <View>
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
                                            <AutoScroll>
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
                                    <View style={{ height: 90 }}>
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
                                        {/* <Image source={require('../../Assets/Flag.png')} style={{ height: "100%", width: "100%" }} /> */}
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
                                    <FastImage
                                        style={styles.modalImages}
                                        source={{
                                            uri: product[ind].productImages[modalImage] && product[ind].productImages[modalImage].imageURL,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                </ImageZoom>
                            </View>
                            <View style={{ marginTop: Platform.OS == "android" ? "18%" : "25%" }}>
                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {
                                        product[ind].productImages.map((img, i) => {
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
            </View >
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
                        <View >
                            {product.slice(ind, jjj)
                                .map((item, i) => {
                                    if (i < index) {
                                        null;
                                    } else if (i == index) {
                                        return (
                                            <View style={{}}>
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
                                                    {cardView(item, i)}
                                                </Animated.View>
                                                {
                                                    showCount ?
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Regular", fontSize: 12, alignSelf: "flex-end", position: "absolute", marginTop: Platform.OS == "android" ? 598 : 585, marginRight: "10%" }}>{pageCnt.current}/{RecordCount}</Text>
                                                        : null
                                                }

                                                {
                                                    item.outOfStock == false ?

                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "88%", marginTop: Platform.OS == "android" ? 610 : 600, position: "absolute", alignItems: "center" }}>
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
                                                        </View>
                                                        :
                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "88%", marginTop: Platform.OS == "android" ? 610 : 600, position: "absolute", alignItems: "center" }}>
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
                                    }
                                    else {
                                        return (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    width: SCREEN_WIDTH - 30,
                                                    top: -7 * (i - index),
                                                    paddingLeft: 2 * (i - index),
                                                    paddingRight: 2 * (i - index),
                                                    alignSelf: "center",
                                                    height: 450
                                                }}>
                                                {cardView(item, i)}
                                            </View>
                                        );
                                    }
                                })
                                .reverse()
                            }
                        </View>
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
                        </View> :
                        <View style={{}}>
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "2%", marginLeft: "6%", width: "90%" }}>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", width: "85%" }}>
                                        <TextInput
                                            placeholder='Search Product'
                                            placeholderTextColor={"#585858"}
                                            style={{ backgroundColor: 'white', fontSize: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#D1D1D1", width: "100%", height: 38, borderLeftWidth: 1, borderTopLeftRadius: 6, borderBottomLeftRadius: 6, paddingLeft: "3%" }}
                                            onChangeText={(text) => typeText(text)}
                                            value={search}

                                        />

                                        <View style={{ backgroundColor: 'white', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderTopWidth: 1, borderRightWidth: 1, borderRightColor: "#D1D1D1", borderBottomWidth: 1, height: 38, justifyContent: "center", alignItems: "center", width: 35, borderLeftColor: "#D1D1D1", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1" }}>
                                            <TouchableOpacity onPress={() => searchData()}>
                                                {/* <ArrowRight name='long-arrow-right' size={22} color="#A2A2A2" /> */}
                                                <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "15%", justifyContent: "space-between" }}>
                                    <TouchableOpacity onPress={() => {
                                        navigation.navigate("Filter", {
                                            totalCount: RecordCount,
                                            categoryName: search,
                                            productFilterId: 1
                                        })
                                    }}>
                                        <View style={{ position: "absolute", alignSelf: "flex-end", top: -3, right: -1, zIndex: 2, backgroundColor: concatArrayValue.current === 0 ? "transparent" : "red", borderRadius: 30, width: 15, height: 15, alignItems: "center", justifyContent: "center" }}>
                                            <Text style={{ color: "white", fontFamily: "Poppins-SemiBold", fontSize: 12 }}>{concatArrayValue.current === 0 ? null : concatArrayValue.current}</Text>
                                        </View>
                                        <FilterIcon name='filter-outline' size={25} color={"#585858"} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                                        <View style={{ width: 25, height: 25 }}>
                                            <Image source={require("../../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {
                                product.length == 0 ?
                                    null :

                                    <View style={{ justifyContent: "center", top: "5%" }}>
                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "68%" }}>
                                            <ArrowLeft name='long-arrow-left' size={18} color="#A2A2A2" />
                                            <Text style={{ color: "#A2A2A2", fontFamily: "Poppins-Regular", fontSize: 12 }}>Swipe left/right for more products</Text>
                                            <ArrowRight name='long-arrow-right' size={18} color="#A2A2A2" />
                                        </View>
                                    </View>

                            }
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
                            <View style={{ marginTop: "3%" }}>
                                {renderCards()}
                            </View>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={likeModal}
                            >
                                <View style={{ height: "100%", backgroundColor: "#000000aa" }}>
                                    <View
                                        style={{
                                            height: wishlistCategory.length > 2 ? "48%" : '30%',
                                            marginTop: 'auto',
                                            backgroundColor: 'white',
                                            padding: "3%"
                                        }}>
                                        <View>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <TouchableOpacity onPress={() => {
                                                    setLikeModal(false);
                                                    setCollectionModal(false);
                                                }}>
                                                    <Close name='close' size={23} color="#000000" />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: "5%" }}>
                                                    <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>Manage item</Text>
                                                </View>
                                            </View>
                                            <View style={{ marginTop: "5%", display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // setLikeModal(false);
                                                        setCollectionModal(true);
                                                    }}
                                                    style={{ borderStyle: "dotted", borderWidth: 1, width: 40, height: 40, justifyContent: "center", alignItems: "center", borderColor: "#284B46" }}>
                                                    <Close name='plus' size={25} color="#000000" />
                                                </TouchableOpacity>
                                                <View style={{ marginLeft: "3%", flexDirection: "row", justifyContent: "space-between", width: "86%" }}>
                                                    {
                                                        collectionModal == false ?
                                                            <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>Create a new wishlist</Text> :
                                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                                <TextInput
                                                                    placeholder='Collection name'
                                                                    style={{ borderWidth: 1, height: 40, paddingLeft: "2%", width: "75%", fontFamily: "Poppins-Regular" }}
                                                                    onChangeText={(text) => setCollectionName(text)}
                                                                />
                                                                <TouchableOpacity
                                                                    onPress={() => saveCollectionName()}
                                                                    style={{ backgroundColor: "#284B46", justifyContent: "center", alignItems: "center", height: 35, width: 50 }}>
                                                                    <Text style={{ fontSize: 15, color: "white", fontFamily: "Poppins-Medium" }}>Save</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                            <View style={{ marginTop: "5%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <View style={{ width: "75%", alignItems: "center", flexDirection: "row", alignItems: "center" }}>
                                                    {/* <View style={{ backgroundColor: "#ffdddc", width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                                        <HeartPlus name='heart-plus' size={25} color="red" />
                                                    </View> */}
                                                    <View>
                                                        {
                                                            wishlistCategory && wishlistCategory.map((item, index) => {
                                                                return (
                                                                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3%", justifyContent: "space-between", width: "90%" }}>
                                                                        {/* {
                                                                            item.isSelected == false ?
                                                                                <TouchableOpacity onPress={() => { onWishListCategory(item, index) }}>
                                                                                    <Image source={require('../../Assets/uncheck.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                                                </TouchableOpacity>
                                                                                :
                                                                                <TouchableOpacity onPress={() => { onWishListCategory(item, index) }}>
                                                                                    <Image source={require('../../Assets/check.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                                                </TouchableOpacity>
                                                                        } */}
                                                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                            <View style={{ backgroundColor: item.isSelected ? "#ffdddc" : "#d3d3d3", width: 40, height: 40, justifyContent: "center", alignItems: "center" }}>
                                                                                {
                                                                                    item.isSelected ?
                                                                                        <HeartPlus name='heart-plus' size={25} color="red" /> :
                                                                                        <HeartPlus name='heart-plus-outline' size={25} color="#A2A2A2" />
                                                                                }
                                                                            </View>
                                                                            <View style={{ marginLeft: "8%" }}>
                                                                                <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>{item.wishlistName}</Text>
                                                                            </View>
                                                                        </View>
                                                                        <CheckBox
                                                                            disabled={false}
                                                                            // value={checked[item.name]}
                                                                            value={item.isSelected}
                                                                            onValueChange={(newValue) => onWishListCategory(item, index, newValue)}
                                                                            boxType="square"
                                                                            style={{ height: 20, width: 20 }}
                                                                            onTintColor="#000000"
                                                                            onCheckColor="#000000"
                                                                        />
                                                                    </View>
                                                                )
                                                            })
                                                        }
                                                        {/* <Text style={{ fontSize: 15, fontFamily: "Poppins-Regular" }}>My WishList</Text> */}
                                                    </View>
                                                </View>
                                                {/* <CheckBox
                                                    disabled={false}
                                                    value={modalCheckbox}
                                                    // onValueChange={(newValue) => categoryValues(itemCategoryList, index, newValue)}
                                                    boxType="square"
                                                    style={{ height: 20, width: 20 }}
                                                    onTintColor="#000000"
                                                    onCheckColor="#000000"
                                                /> */}
                                            </View>
                                        </View>
                                        <View style={{ borderWidth: 0.5, marginTop: "5%" }}></View>
                                        <TouchableOpacity
                                            onPress={() => onSavePress()}
                                            style={{ backgroundColor: "#284B46", justifyContent: "center", alignItems: "center", height: 35 }}>
                                            <Text style={{ fontSize: 15, color: "white", fontFamily: "Poppins-Medium" }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
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
    modalImages: {
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
    }
});