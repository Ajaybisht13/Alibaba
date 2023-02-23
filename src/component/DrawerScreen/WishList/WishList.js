import { View, Text, SafeAreaView, Image, Keyboard, TouchableOpacity, BackHandler, Linking, Modal, Dimensions, StyleSheet, ScrollView, ActivityIndicator, TextInput, Alert, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import axios from 'axios';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import AutoScroll from "@homielab/react-native-auto-scroll";
import ArrowLeft from 'react-native-vector-icons/FontAwesome';
import { DrawerActions, useNavigation, useFocusEffect } from '@react-navigation/native';
import Reload from 'react-native-vector-icons/FontAwesome';
import Close from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageZoom from 'react-native-image-pan-zoom';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';
import FilterIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Product from '../../StackScreen/Product/Product';


const WishList = () => {
  const navigation = useNavigation();

  const [wishListData, setWishListData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modalLoader, setModalLoader] = useState(true);
  const [pageCount, setPageCount] = useState();
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [onModal, setOnModal] = useState(false);
  const [modalImage, setModalImage] = useState(0);
  const [imageData, setImageData] = useState(0);
  const [fetchData, setFetchData] = useState(false);
  const [totalCount, setTotalCount] = useState();
  const [PageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // getWishList();
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      navigation.dispatch(DrawerActions.closeDrawer());
      pageNumber.current = 1;

      setShowSearch(false);
      clearAllFilter();
      getSearchText();
      getWishList();
      setLoader(true);
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

  const getWishList = async () => {
    const filterType = await AsyncStorage.getItem("Ali");
    const token = await AsyncStorage.getItem("authToken");
    const data = await AsyncStorage.getItem("filterValue");
    const countryName = await AsyncStorage.getItem("countryName");
    const categoryId = await AsyncStorage.getItem("categoryId");
    const supplierId = await AsyncStorage.getItem("supplierId");
    const wishListDataValue = await AsyncStorage.getItem("wishListFilterData");
    console.log(wishListDataValue);

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
      endPoint.current = "Product/GetAllProductsWithWishlist";
    } else {
      userIdValue.current = token;
      endPoint.current = "Product/GetAllProductsWithWishlist";
    }

    if (wishListDataValue == null) {
      wishListValue.current = wishListArray;
    } else {
      const uniqueArray = JSON.parse(wishListDataValue);
      wishListValue.current = uniqueArray;
    }

    const concatArray = filter.current.concat(supplierValue.current, categoryValue.current, countryValue.current, wishListValue.current);
    concatArrayValue.current = concatArray.length;

    let obj = {
      "pageNumber": pageNo,
      "pageSize": 5,
      "filterType": filterType,
      "search": filterDataText.current,
      "userId": userIdValue.current,
      "statusID": 2,
      "filtersList": filter.current,
      "countries": countryValue.current,
      "suppliers": supplierValue.current,
      "categories": categoryValue.current,
      "wishlist": wishListValue.current,
    }

    console.log("dtaaaaa", obj);

    axios.post(baseUrl + endPoint.current, obj)

      // axios.get(baseUrl + `Product/GetAllProductsWithStatus?pageNumber=${pageNo}&pageSize=5&StatusID=2&FilterType=${filterType}&search=${search}&UserId=${token}`)
      .then((response) => {
        if (response.data) {
          setPageCount(response.data.totalPages);
          setTotalCount(response.data.totalCount);
          if (response.data.totalPages == 0) {
            setSearch("");
            setFetchData(true);
          } else {
            setFetchData(false);
          }
          pageNo = pageNo + 1;

          pageNumber.current = pageNo;

          setWishListData([...wishListData, ...response.data.data]);
          setLoader(false);
        } else {
          setLoader(true)
        }
      });
  }

  const searchData = () => {
    Keyboard.dismiss();
    pageNumber.current = 1;
    const emptArr = wishListData.splice(0, wishListData.length);
    setWishListData(emptArr);
    setFetchData(false);
    setImageData(0);
    setModalImage(0);
    getWishList();
    setLoader(true);
    AsyncStorage.setItem("filterText", filterDataText.current);
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
    Keyboard.dismiss();
    setPageCount(10);
    setFetchData(false);
    pageNumber.current = 1;
    const emptArr = wishListData.splice(0, wishListData.length);
    setWishListData(emptArr);
    setShowSearch(false);
    setImageData(0);
    setModalImage(0);
    getWishList();
    setLoader(true);
  }

  const typeText = (text) => {
    setSearch(text);
    filterDataText.current = text;
  }
  const openUrls = (item) => {
    Linking.openURL(item.companyUrl)
  }

  const showSearchBox = () => {
    setShowSearch(!showSearch);
  }

  const openModal = (i, id) => {
    setOnModal(true);
    setImageData(i);
    setModalLoader(true);
  }

  const selectImage = (i) => {
    setModalImage(i)
  }

  const onDiscard = async (itemId) => {
    Alert.alert(
      "Confirmation",
      "Are you want to Remove ?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => pressDiscard(itemId)}
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
      "userId": parseInt(token),
      "wishlishStatus": false
    }
    await axios.post(baseUrl + "Product/UpdateProductWishlist", dataObj, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      setLoader(true);
      var pageNo = pageNumber.current;
      pageNumber.current = pageNo - 1;
    });
    pageNumber.current = 1;
    const emptArr = wishListData.splice(0, wishListData.length);
    setWishListData(emptArr);
    getWishList();
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
    console.log("toookkeennn", token);

    let dataObj = {
      "id": itemIdd,
      "statusId": 1,
      "userId": parseInt(token),
      "filterType": filterType
    }

    console.log(dataObj);

    await axios.post(baseUrl + "Product/AddEditProductStatus", dataObj, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response) => {
      console.log(response.data.message);
      var pageNo = pageNumber.current;
      pageNumber.current = pageNo - 1;
    })
    pageNumber.current = 1;
    const emptArr = wishListData.splice(0, wishListData.length);
    setWishListData(emptArr);
    getWishList();
  }


  return (
    <SafeAreaView>
      <LinearGradient colors={['#FFFFFF', '#F2FDFB']} style={{ height: "100%" }}>
        {
          loader ?
            <View style={{ justifyContent: 'center', height: "100%", alignItems: "center" }}>
              <ActivityIndicator size="large" />
            </View>
            :
            <View>
              <View>
                <View>
                  {
                    showSearch ?
                      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: "2%", alignItems: "center", width: "97.5%" }}>
                        <View style={{}}>
                          <TouchableOpacity onPress={() => {
                            navigation.goBack("Product");
                          }}>
                            <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", width: "80%" }}>
                          <TextInput placeholder='Search Product' placeholderTextColor={"#585858"}
                            onChangeText={(text) => typeText(text)}
                            style={{ borderRightColor: "transparent", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1", borderLeftColor: "#D1D1D1", borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1, height: 40, marginLeft: "2%", width: "80%", paddingLeft: "2%", borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
                            value={filterDataText.current}
                          />
                          <TouchableOpacity onPress={searchData} style={{ borderLeftColor: "transparent", borderRightColor: "#D1D1D1", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1", borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, height: 40, alignItems: "center", justifyContent: "center", width: 40, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
                            <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ marginRight: "2%" }} onPress={() => {
                          navigation.navigate("Filter", {
                            totalCount: totalCount,
                            categoryName: search,
                            productFilterId: 2
                          })
                        }}>
                          {/* <View style={{ position: "absolute", alignSelf: "flex-end", top: -3, right: -1, zIndex: 2, backgroundColor: concatArrayValue.current === 0 ? "" : "red", borderRadius: 30, width: 15, height: 15, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ color: "white", fontFamily: "Poppins-SemiBold", fontSize: 12 }}>{concatArrayValue.current === 0 ? null : concatArrayValue.current}</Text>
                          </View> */}
                          <FilterIcon name='filter-outline' size={25} color={"#585858"} />
                        </TouchableOpacity>
                        <View>
                          <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                            <View style={{ width: 25, height: 25 }}>
                              <Image source={require("../../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View> :
                      <View style={{ justifyContent: "center", height: 40, width: "98%" }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "2%" }}>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "45%", marginLeft: "3%" }}>
                            <TouchableOpacity onPress={() => navigation.goBack("Product")}>
                              <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium", marginTop: -5 }}>  Wishlisted</Text>
                          </View>
                          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "22%" }}>
                            <TouchableOpacity onPress={() => showSearchBox()} style={{}}>
                              <Image source={require('../../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{}} onPress={() => {
                              navigation.navigate("Filter", {
                                totalCount: totalCount,
                                categoryName: search,
                                productFilterId: 2
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
                      </View>
                  }
                </View>
                {/* onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} */}
              </View>
              <View style={styles.container}>
                <View style={{ display: "flex", flexDirection: "row", width: "60%", justifyContent: "space-between", alignSelf: "center", height: "5%" }}>
                  <TouchableOpacity onPress={() => navigation.navigate("WishList")}>
                    <Image source={require('../../Assets/listView.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate("GridView")}>
                    <Image source={require('../../Assets/GridView.png')} style={{ height: 25, width: 27 }} resizeMode="contain" />
                  </TouchableOpacity>
                </View>
                {
                  fetchData ?
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
                    :
                    <ScrollView onScrollEndDrag={getWishList} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: "55%" }}>
                      {
                        wishListData.map((item, i) => {
                          return (
                            <View style={{
                              borderWidth: Platform.OS == "ios" ? 0.5 : 0,
                              marginTop: Platform.OS == "ios" ? "2%" : 0,
                              shadowColor: "#000",
                              borderColor: "#d3d3d3",
                              backgroundColor: "white",
                              shadowOffset: {
                                width: 0,
                                height: 2
                              },
                              shadowOpacity: 0.25,
                              shadowRadius: 4,
                            }}>
                              <View style={styles.flatListSubContainer}>
                                <View style={{ width: "20%", marginLeft: "3%", marginTop: Platform.OS == "android" ? "3%" : 0 }}>
                                  <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    rating={item.productRate}
                                    selectedStar={(rating) => console.log(rating)}
                                    starSize={15}
                                    fullStarColor={"#FEDE12"}
                                  />
                                </View>
                                <View style={styles.flatListItemContainer}>
                                  <TouchableOpacity onPress={() => openModal(i, item.id)}>
                                    <FastImage
                                      style={styles.image}
                                      source={{
                                        uri: item.productImages[0].imageURL,
                                        priority: FastImage.priority.normal,
                                      }}
                                      resizeMode={FastImage.resizeMode.contain}
                                    />
                                  </TouchableOpacity>
                                  <View style={{ width: "70%", marginTop: "2%" }}>
                                    <View>
                                      <Text style={styles.description}>{item.name}</Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={{ marginTop: "3%" }}>
                                  <Text style={{ fontWeight: "bold", fontSize: 14, color: "#000000", marginLeft: "2%" }}>Prices</Text>
                                  {
                                    item.prices.length < 3 ?
                                      <View style={{ width: "95%", alignSelf: "center" }}>
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
                                      <AutoScroll style={{ width: "95%", alignSelf: "center" }}>
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
                                  {/* {
                                    item.deliveries.map((itemTime, i) => {
                                       return ( */}
                                  <Text style={{ marginTop: "2%", marginLeft: "2%", fontWeight: "bold", fontSize: 14, color: "#00B100" }}>Delivery Time :</Text>
                                  {/* )
                                    })
                                  } */}
                                  <View style={{ flexDirection: "row", marginTop: "1%", width: "95%", alignSelf: "center" }}>
                                    <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                      <Text style={{ fontWeight: "bold", fontSize: 14, color: "#00B100" }}>Quantity</Text>
                                    </View>
                                    <View style={{ borderWidth: 1, width: "50%", alignItems: "center" }}>
                                      <Text style={{ fontWeight: "bold", fontSize: 14, color: "#00B100" }}>Time</Text>
                                    </View>
                                  </View>
                                  <View>
                                    {
                                      item.deliveries.map((del) => {
                                        return (
                                          <View>
                                            <View style={{ flexDirection: "row", width: "95%", alignSelf: "center" }}>
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
                                    <View style={{ alignSelf: "flex-end", marginRight: "3%" }}>
                                      <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: "2%", color: "red" }}>{item.outOfStock == false ? null : "Out of Stock"}</Text>
                                    </View>
                                  </View>
                                </View>
                                {
                                  item.isApprove == true || item.isDiscard == true ?
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "60%", marginTop: "3%" }}>
                                      <View style={{ height: 30, width: 80, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                        onPress={() => onDiscard(item.id)}
                                      >
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#284B46" }}>Remove</Text>
                                      </View>
                                      <View style={{ height: 30, width: 80, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                        onPress={() => onShortList(item.id)}
                                      >
                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#FFFFFF" }}>Shortlist</Text>
                                      </View>
                                    </View> :
                                    <View>
                                      {
                                        item.outOfStock == false ?
                                          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "60%", marginTop: "3%" }}>
                                            <TouchableOpacity style={{ height: 30, width: 80, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                              onPress={() => onDiscard(item.id)}
                                            >
                                              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#284B46" }}>Remove</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ height: 30, width: 80, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                              onPress={() => onShortList(item.id)}
                                            >
                                              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#FFFFFF" }}>Shortlist</Text>
                                            </TouchableOpacity>
                                          </View> :
                                          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "60%", marginTop: "3%" }}>
                                            <View style={{ height: 30, width: 80, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                              onPress={() => onDiscard(item.id)}
                                            >
                                              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#284B46" }}>Remove</Text>
                                            </View>
                                            <View style={{ height: 30, width: 80, backgroundColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%", opacity: 0.3 }}
                                              onPress={() => onShortList(item.id)}
                                            >
                                              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 13, color: "#FFFFFF" }}>Shortlist</Text>
                                            </View>
                                          </View>
                                      }
                                    </View>
                                }
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignSelf: "center", width: "95%", paddingBottom: "2%", marginTop: "2%" }}>
                                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                    <Text style={{ fontFamily: "HelveticaNeue Bold", fontSize: 11, color: "#000000" }}>{item.joinYear} YRS</Text>
                                    <TouchableOpacity onPress={() => openUrls(item)}>
                                      <Text style={{ fontWeight: "bold", fontSize: 14, color: "#A2A2A2" }}> {item.centralLogoText}</Text>
                                    </TouchableOpacity>
                                  </View>
                                  <Image source={require('../../Assets/Flag.png')} style={{ height: 27, width: 35 }} resizeMode="contain" />
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
                                              uri: wishListData[imageData].productImages[modalImage].imageURL,
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
                                          wishListData[imageData].productImages.map((img, i) => {
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
                                          }
                                          )
                                        }
                                      </ScrollView>
                                    </View>
                                  </View>
                                </SafeAreaView>

                              </Modal >
                            </View>
                          )
                        })
                      }
                    </ScrollView>
                }
              </View>
            </View >
        }
        <Text></Text>
      </LinearGradient >
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    padding: "4%",
  },
  description: {
    color: "#000000",
    fontSize: 15,
    fontFamily: "HelveticaNeue Medium"
  },
  title: {
    color: "#F8810A",
    fontSize: 11,
    fontFamily: "HelveticaNeue Medium"
  },
  flatListSubContainer: {
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'transparent',
    marginTop: "2%",
    shadowColor: " black"
  },
  flatListItemContainer: {
    display: "flex",
    flexDirection: "row",
    padding: "3%",
    justifyContent: "space-between",
  },
  image: {
    height: 85,
    width: 85,
    marginTop: "5%"
  },
  modalImage: {
    width: "100%",
    height: "100%"
  },
  slideImage: {
    height: 100,
    width: 100,
  }
});

export default WishList