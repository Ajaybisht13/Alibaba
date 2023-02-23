import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating from 'react-native-star-rating';

import { useNavigation } from '@react-navigation/native';

const Filter = ({ route }) => {

    const navigation = useNavigation();

    const [dataValue, setDataValue] = useState();
    const [checkedValue, setCheckedValue] = useState();
    const [selectFilter, setSelectFilter] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [countryPrevData, setCountryPrevData] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    const [supplierPrevData, setSupplierPrevData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [clickedValue, setClickedValue] = useState("");
    const [lengthError, setLengthError] = useState(false);
    const [lengthErrorMax, setLengthErrorMax] = useState(false);
    const [PriceMinError, setPriceMinError] = useState(true);
    const [PriceMaxError, setPriceMaxError] = useState(true);

    const [YearMinError, setYearMinError] = useState(true);
    const [YearMaxError, setYearMaxError] = useState(true);
    const [lengthError1, setLengthError1] = useState(false);
    const [lengthError1Max, setLengthError1Max] = useState(false);
    const [QtyMinError, setQtyMinError] = useState(true);
    const [QtyMaxError, setQtyMaxError] = useState(true);
    const [lengthError2, setLengthError2] = useState(false);
    const [lengthError2Max, setLengthError2Max] = useState(false);
    const [objValue, setObjValue] = useState();
    const [customValue, setCustomValue] = useState();
    const [customName, setCustomName] = useState();
    const [selectValueData, setSelectValueData] = useState();
    const [minValuedata, setMinValueData] = useState("");
    const [maxValuedata, setMaxValueData] = useState("");
    const [minYearsValue, setMinYearsValue] = useState("");
    const [maxYearsValue, setMaxYearsValue] = useState("");
    const [minQtyValue, setMinQtyValue] = useState("");
    const [maxQtyValue, setMaxQtyValue] = useState("");



    const [supplierCheck, setSupplierCheck] = useState();

    const [checked, setChecked] = useState({});
    const [checkedSupplier, setCheckedSupplier] = useState({});
    const [checkedCategory, setCheckedCategory] = useState({});
    const [checkedFilter, setCheckedFilter] = useState({});



    const data = require("../../DummyJson/data.json");
    const pageNumber = useRef(1);
    const categoryListRef = useRef([]);
    const supplierListRef = useRef([]);
    const countryListRef = useRef([]);
    const minMax = useRef();

    useFocusEffect(
        React.useCallback(() => {
            pageNumber.current = 1;
            setDataValue(data[0].id);
            getCountryList();
            getSupplierList();
            getCategoryList();
            clearStorage();
            navigationData();

            // AsyncStorage.setItem("navigationId",route.params.productFilterId.toString());
        }, [])
    )

    const setMinPriceData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthError(false);
            setPriceMinError(false);

        }
        else {
            setLengthError(true);
            setPriceMinError(true);
        }
    }

    const setPriceMaxValueData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthErrorMax(false);
            setPriceMaxError(false);

        }
        else { setLengthErrorMax(true); setPriceMaxError(true); }
    }

    const setMinYearData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthError1(false);
            setYearMinError(false);

        }
        else { setLengthError1(true); setYearMinError(true); }
    }

    const setMaxYearData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthError1(false);
            setYearMaxError(false);

        }
        else { setLengthError1(true); setYearMaxError(true); }
    }


    const setMinQtyData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthError2(false);
            setQtyMinError(false);

        }
        else { setLengthError2(true); setQtyMinError(true); }
    }

    const setMaxQtyData = (text) => {
        console.log(text);
        if (text.length > 0) {
            setLengthError2(false);
            setQtyMaxError(false);

        }
        else { setLengthError2(true); setQtyMaxError(true); }
    }


    const navigationData = async () => {
        console.log("navigation id", route.params.productFilterId);
        const navigationValue = await AsyncStorage.getItem("navigationId");
        if (navigationValue == null || navigationValue != route.params.productFilterId) {
            onClearButton();
        }
        AsyncStorage.setItem("navigationId", route.params.productFilterId.toString());
        console.log("navigation id", navigationValue);
    }
    const getCountryList = () => {
        axios.get(baseUrl + "Product/GetCountry")
            .then((response) => {
                countryListRef.current = response.data.data;
                setCountryList(response.data.data);
                setCountryPrevData(response.data.data);
            })
    }

    const getSupplierList = () => {
        axios.get(baseUrl + "Product/GetSuppliers")
            .then((response) => {
                supplierListRef.current = response.data.data;
                setSupplierList(response.data.data);
                setSupplierPrevData(response.data.data);
            })
    }

    const getCategoryList = () => {
        axios.get(baseUrl + "Product/GetCategories")
            .then((response) => {
                categoryListRef.current = response.data.data;
                setCategoryList(response.data.data);

            })
    }

    const clearStorage = async () => {
        await AsyncStorage.removeItem("filterText");
        await AsyncStorage.removeItem("filterValue");
        await AsyncStorage.removeItem("countryName");
        await AsyncStorage.removeItem("categoryId");
        await AsyncStorage.removeItem("supplierId");
        const minData = await AsyncStorage.getItem("minValue");
        setMinValueData(minData);
        const maxData = await AsyncStorage.getItem("maxValue");
        setMaxValueData(maxData);
        const minYearsValue = await AsyncStorage.getItem("minYearsValue");
        setMinYearsValue(minYearsValue);
        const maxYearsValue = await AsyncStorage.getItem("maxYearsValue");
        setMaxYearsValue(maxYearsValue);
        const minQtyValue = await AsyncStorage.getItem("minQtyValue");
        setMinQtyValue(minQtyValue);
        const maxQtyValue = await AsyncStorage.getItem("maxQtyValue");
        setMaxQtyValue(maxQtyValue);
    }

    const onClearButton = async () => {
        setMinValueData("");
        setMaxValueData("");
        setMinYearsValue("");
        setMaxYearsValue("");
        setMinQtyValue("");
        setMaxQtyValue("")
        setCheckedCategory(false);
        setCheckedSupplier(false);
        setChecked(false);
        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data[i].subItem.length; j++) {
                if (data[i].subItem[j].isSelected == true) {
                    data[i].subItem[j].isSelected = false;
                    setSelectValueData(data[i].subItem[j].isSelected);
                }
            }
        }
        await AsyncStorage.removeItem("filterText");
        await AsyncStorage.removeItem("filterValue");
        await AsyncStorage.removeItem("countryName");
        await AsyncStorage.removeItem("categoryId");
        await AsyncStorage.removeItem("supplierId");
        await AsyncStorage.removeItem("minValue");

        await AsyncStorage.removeItem("maxValue");

        await AsyncStorage.removeItem("minYearsValue");

        await AsyncStorage.removeItem("maxYearsValue");

        await AsyncStorage.removeItem("minQtyValue");

        await AsyncStorage.removeItem("maxQtyValue");


    }

    const selectValue = (id) => {
        setDataValue(id);
    }

    const selectFilterValue = (itemPrice, index, id, ind, newValue) => {
        for (let i = 0; i < data.length - 1; i++) {

            for (let j = 0; j < data[i].subItem.length; j++) {
                if (data[i].id == id) {
                    if (i == ind && j == index) {
                        data[i].subItem[j].isSelected = !data[i].subItem[j].isSelected;
                        setSelectValueData(itemPrice.isSelected);
                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 1) {
                            console.log("check value", itemPrice.isSelected);
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError(true);
                                setLengthErrorMax(true);
                            }
                            else {
                                setLengthError(false);
                                setLengthErrorMax(false);
                                setPriceMinError(true);
                                setPriceMaxError(true);
                                setMinValueData("");
                                setMaxValueData("");

                            }
                        }
                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 3) {
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError1(true);
                                setLengthError1Max(true);
                            }
                            else {
                                setLengthError1(false);
                                setLengthError1Max(false);
                                setYearMinError(true);
                                setYearMaxError(true);
                                setMinYearsValue("");
                                setMaxYearsValue("");
                            }
                        }
                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 5) {
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError2(true);
                                setLengthError2Max(true);
                            }
                            else {
                                setLengthError2(false);
                                setLengthError2Max(false);
                                setQtyMinError(true);
                                setQtyMaxError(true);
                                setMinQtyValue("");
                                setMaxQtyValue("")
                            }
                        }
                        setObjValue(itemPrice.filterName);
                        setCustomValue(itemPrice.filterValue);
                        setCustomName(itemPrice.name);
                    }
                    else {
                        data[i].subItem[j].isSelected = false;
                    }
                }
            }
        }
    }

    const categoryValues = async (itemCategoryList, index, newValue) => {
        setCheckedCategory({ ...checkedCategory, [itemCategoryList.id]: newValue });
        if (itemCategoryList.isSelected == false) {
            itemCategoryList.isSelected = true;
        }
        else {
            itemCategoryList.isSelected = false;
        }
        let categoryData = categoryList;

        for (let i = 0; i < categoryData.length; i++) {
            for (let j = 0; j < categoryData[i].subItem; j++) {
                if (j == index) {
                    categoryData[i].subItem[j].isSelected = itemCategoryList.isSelected;
                }
            }

        }

        setCategoryList(categoryData);
        categoryListRef.current = categoryData;

    }

    const countryValues = async (item, index, newValue) => {
        setChecked({ ...checked, [item.name]: newValue });

        if (item.isSelected == false) {
            item.isSelected = true;

        }
        else {
            item.isSelected = false;
        }
        var data = countryList;
        for (let i = 0; i < data.length; i++) {
            if (i == index) {
                data[i] = item;
                break;
            }
        }

        setCountryList(data);
    }

    const supplierValues = async (item, index, newValue) => {
        setCheckedSupplier({ ...checked, [item.name]: newValue });
        if (item.isSelected == false) {
            item.isSelected = true;
            setSupplierCheck(item.isSelected);
        }
        else {
            item.isSelected = false;
            setSupplierCheck(item.isSelected);
        }
        var data = supplierList;
        for (let i = 0; i < data.length; i++) {
            if (i == index) {
                data[i] = item;
                break;
            }
        }

        setSupplierList(data);

    }

    const applyFilter = async () => {

        var FilterJson = [];
        for (let i = 1; i < data.length - 1; i++) {
            if (i != 4) {
                for (let j = 0; j < data[i].subItem.length; j++) {
                    if (data[i].subItem[j].isSelected == true) {
                        if (data[i].subItem[j].filterName == "Custom") {
                            if (dataValue === 1) {
                                await AsyncStorage.setItem("minValue", minValuedata);
                                await AsyncStorage.setItem("maxValue", maxValuedata);
                                minMax.current = minValuedata.toString() + "-" + maxValuedata.toString();
                            } else if (dataValue === 3) {
                                await AsyncStorage.setItem("minYearsValue", minYearsValue);
                                await AsyncStorage.setItem("maxYearsValue", maxYearsValue);
                                minMax.current = minYearsValue.toString() + "-" + maxYearsValue.toString();
                            } else if (dataValue === 5) {
                                await AsyncStorage.setItem("minQtyValue", minQtyValue);
                                await AsyncStorage.setItem("maxQtyValue", maxQtyValue);
                                minMax.current = minQtyValue.toString() + "-" + maxQtyValue.toString();
                            }
                            let objCustom = {
                                "name": data[i].subItem[j].name,
                                "filterValue": minMax.current,
                            }
                            FilterJson.push(objCustom);
                        }
                        else {
                            let obj = {
                                "name": data[i].subItem[j].name,
                                "filterValue": data[i].subItem[j].filterValue,
                            }
                            FilterJson.push(obj);
                        }
                    }
                }
            }
        }

        var countryData = countryList;
        var countryFilterData = [];
        for (let index = 0; index < countryData.length; index++) {
            if (countryData[index].isSelected == true) {
                countryFilterData.push(countryData[index].name);
            }

        }


        let supplierData = supplierList;
        let supplierFilterData = [];
        for (let index = 0; index < supplierData.length; index++) {
            if (supplierData[index].isSelected == true) {
                supplierFilterData.push(supplierData[index].id);
            }

        }

        let categoryData = categoryList;
        let categoryFilterData = [];
        for (let index = 0; index < categoryData.length; index++) {
            for (let j = 0; j < categoryData[index].lstSubCategories.length; j++) {
                if (categoryData[index].lstSubCategories[j].isSelected) {
                    categoryFilterData.push(categoryData[index].lstSubCategories[j].id);
                }

            }

            if (categoryData[index].isSelected == true) {
                categoryFilterData.push(categoryData[index].id);
            }

        }

        AsyncStorage.setItem("countryName", JSON.stringify(countryFilterData));
        AsyncStorage.setItem("supplierId", JSON.stringify(supplierFilterData));
        AsyncStorage.setItem("categoryId", JSON.stringify(categoryFilterData));
        AsyncStorage.setItem("filterValue", JSON.stringify(FilterJson));
        AsyncStorage.setItem("filterText", route.params.categoryName);
        if (route.params.productFilterId == 1) {
            navigation.navigate("Product");
        } else if (route.params.productFilterId == 2) {
            navigation.navigate("WishList");
        } else if (route.params.productFilterId == 3) {
            navigation.navigate("ShortListed");
        } else if (route.params.productFilterId == 4) {
            navigation.navigate("GridView");
        }
    }


    const searchData = (text) => {
        if (dataValue == 4) {
            const newData = supplierList.filter(item => {
                const itemData = item.name.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            if (text.length > 0) {
                setSupplierList(newData);
            } else {
                setSupplierList(supplierPrevData);
            }
        }
        if (dataValue == 6 && text) {
            const newData = countryList.filter(item => {

                const itemData = item.name.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1
            });
            if (text.length > 0) {
                setCountryList(newData);
            } else {
                setCountryList(countryPrevData);
            }
        }
    }



    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior='padding'>
                <View style={{ height: "100%", backgroundColor: "white" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "96%", alignSelf: "center", alignItems: "center", height: 50 }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => {
                                // debugger;
                                if (route.params.productFilterId == 1) {
                                    navigation.navigate("Product");
                                } else if (route.params.productFilterId == 2) {
                                    navigation.navigate("WishList");
                                } else if (route.params.productFilterId == 3) {
                                    navigation.navigate("ShortListed");
                                } else if (route.params.productFilterId == 4) {
                                    navigation.navigate("GridView");
                                }
                            }

                            } style={{ marginTop: "-1%" }}>
                                <FontAwesome name='long-arrow-left' size={22} color="#000000" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: "black", fontFamily: "Poppins-Medium", marginLeft: "5%" }}> {route.params.categoryName ? route.params.categoryName : "All"}</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#284B46", height: 30, width: "16%", alignItems: "center", justifyContent: "center", borderRadius: 2 }}
                            onPress={() => onClearButton()}
                        >
                            <Text style={{ fontSize: 14, color: "white", fontFamily: "Poppins-Medium" }}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderWidth: 0.5, borderColor: "gray" }}></View>
                    <View style={{ height: "100%", display: "flex", flexDirection: "row" }}>
                        <ScrollView style={{ backgroundColor: "#284B46", width: "40%" }}>
                            <View style={{ marginTop: "3%" }}>
                                {
                                    data.map((item, index) => {
                                        return (
                                            <TouchableOpacity style={{ width: "96%", alignSelf: "flex-end" }} onPress={() => selectValue(item.id)}>
                                                <View style={{ backgroundColor: item.id == dataValue ? "white" : "#284B46", padding: "2%", borderBottomWidth: 0.5, borderBottomColor: "white", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                                    <View style={{ justifyContent: "center", marginTop: "8%" }}>
                                                        <Text style={{ fontSize: 16, color: item.id == dataValue ? "black" : "white", fontFamily: "Poppins-Medium", marginLeft: "5%", marginBottom: Platform.OS == "android" ? "5%" : "6%" }}>{item.category}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </ScrollView>
                        <ScrollView style={{ width: "70%" }} contentContainerStyle={{ paddingBottom: "42%" }}>
                            {
                                dataValue == 4 || dataValue == 6 ?
                                    <View>
                                        <View style={{ flexDirection: "row", alignItems: "center", width: "80%", marginTop: "2%", marginLeft: "1%" }}>
                                            <TouchableOpacity style={{ borderLeftColor: "transparent", height: 40, alignItems: "center", justifyContent: "center", width: 40 }}>
                                                <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                            <TextInput placeholder={dataValue == 4 ? 'Supplier' : "Country"}
                                                placeholderTextColor={"#A2A2A2"}
                                                onChangeText={(text) => searchData(text)}
                                                style={{ borderRightColor: "transparent", height: 40, width: "85%", borderBottomColor: "#A2A2A2" }}
                                            // value={search}
                                            />
                                        </View>
                                        <View style={{ width: "87%", borderWidth: 0.5, borderColor: "#A2A2A2", marginLeft: "6%" }}></View>
                                    </View>
                                    : null
                            }

                            {
                                data.map((item, ind) => {
                                    return (
                                        <View>
                                            {
                                                item.subItem.map((itemPrice, index) => {
                                                    return (
                                                        <View>
                                                            {
                                                                item.id == dataValue ?
                                                                    <View style={{ justifyContent: "center", marginTop: "5%", marginLeft: "6%" }}>
                                                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "2%" }}>
                                                                            {
                                                                                itemPrice.isSelected === false ?
                                                                                    <TouchableOpacity onPress={() => { selectFilterValue(itemPrice, index, item.id, ind) }}>
                                                                                        <Image source={require('../../Assets/uncheck.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                                                    </TouchableOpacity>
                                                                                    :
                                                                                    <TouchableOpacity onPress={() => { selectFilterValue(itemPrice, index, item.id, ind) }}>
                                                                                        <Image source={require('../../Assets/check.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                                                    </TouchableOpacity>
                                                                            }
                                                                            <TouchableOpacity style={{ marginLeft: Platform.OS == "android" ? "10%" : "4%", display: "flex", flexDirection: "row", alignItems: "center" }}
                                                                                onPress={() => { selectFilterValue(itemPrice, index, item.id, ind) }}>
                                                                                {
                                                                                    item.id == 2 &&
                                                                                    <StarRating
                                                                                        disabled={true}
                                                                                        maxStars={5}
                                                                                        rating={itemPrice.rating}
                                                                                        // selectedStar={() => selectFilterValue(itemPrice)}
                                                                                        starSize={15}
                                                                                        fullStarColor={"#FEDE12"}
                                                                                        starStyle={{ marginLeft: "3%" }}
                                                                                        emptyStarColor={"#FEDE12"}
                                                                                    />
                                                                                }
                                                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                                    {
                                                                                        item.id == 1 && itemPrice.filterName !== "Custom" ? <FontAwesome name='dollar' style={Platform.OS == " android" ? { fontSize: 14, marginLeft: "3%", marginBottom: "5%" } : { fontSize: 14, marginLeft: "3%" }} /> : null
                                                                                    }
                                                                                    <Text style={itemPrice.filterName == "Custom" ? { fontSize: 18, color: "black", fontFamily: "Poppins-Medium", marginLeft: "5%" } :
                                                                                        { fontSize: 16, color: "black", fontFamily: "Poppins-Medium", marginLeft: "5%" }
                                                                                    }>{itemPrice.filterName}</Text>
                                                                                </View>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                    </View> : null
                                                            }
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    )
                                })
                            }
                            {
                                data[1].id == dataValue && dataValue == 1 || dataValue == 3 || dataValue == 5 ?

                                    <View>
                                        <View style={{ display: "flex", marginTop: "5%" }}>
                                            {
                                                dataValue == 1 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError == false && dataValue == 1 ? (PriceMinError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> From :</Text>
                                                        <FontAwesome name='dollar' style={{ fontSize: 16, marginLeft: "3%" }} />
                                                    </View>

                                                    <TextInput
                                                        value={minValuedata ? minValuedata : minValuedata}
                                                        placeholder={minValuedata ? minValuedata : "1"}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="phone-pad"
                                                        onChangeText={(text) => {
                                                            setMinPriceData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMinValueData(text);
                                                            }
                                                        }
                                                        }
                                                        maxLength={4}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 3 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError1 == false && dataValue == 3 ? (YearMinError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> From :</Text>
                                                    </View>
                                                    <TextInput
                                                        value={minYearsValue ? minYearsValue : minYearsValue}
                                                        placeholder={minYearsValue ? minYearsValue : '1'}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="phone-pad"
                                                        onChangeText={(text) => {
                                                            setMinYearData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMinYearsValue(text);
                                                            }
                                                        }
                                                        }
                                                        maxLength={4}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 5 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError2 == false && dataValue == 5 ? (QtyMinError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> From :</Text>
                                                    </View>

                                                    <TextInput
                                                        value={minQtyValue ? minQtyValue : minQtyValue}
                                                        placeholder={minQtyValue ? minQtyValue : '1'}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="phone-pad"
                                                        onChangeText={(text) => {
                                                            setMinQtyData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMinQtyValue(text);
                                                            }
                                                        }
                                                        }
                                                        maxLength={4}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 1 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthError == false && dataValue == 1 ? (PriceMaxError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> To      :</Text>
                                                        <FontAwesome name='dollar' style={{ fontSize: 16, marginLeft: "3%" }} />

                                                    </View>


                                                    <TextInput
                                                        value={maxValuedata ? maxValuedata : maxValuedata}
                                                        placeholder={maxValuedata ? maxValuedata : '20'}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="numeric"
                                                        onChangeText={(text) => {
                                                            setPriceMaxValueData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMaxValueData(text);
                                                                console.log(maxValuedata);
                                                            }
                                                        }}
                                                        maxLength={4}
                                                    />


                                                </View>
                                            }
                                            {
                                                dataValue == 3 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthError1 == false && dataValue == 3 ? (YearMaxError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> To      :</Text>
                                                    </View>
                                                    <TextInput
                                                        value={maxYearsValue ? maxYearsValue : maxYearsValue}
                                                        placeholder={maxYearsValue ? maxYearsValue : '20'}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="numeric"
                                                        onChangeText={(text) => {
                                                            setMaxYearData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMaxYearsValue(text);
                                                            }
                                                        }}
                                                        maxLength={4}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 5 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthError2 == false && dataValue == 5 ? (QtyMaxError == false) ? "green" : "black" : "red" }}>
                                                    <View style={{ borderWidth: 0, height: 30, alignItems: "center", justifyContent: "space-between", display: "flex", flexDirection: "row" }}>
                                                        <Text style={{ color: "black", fontFamily: "Poppins-Medium", marginLeft: "2%" }} adjustsFontSizeToFit={true}> To      :</Text>
                                                    </View>
                                                    <TextInput
                                                        value={maxQtyValue ? maxQtyValue : maxQtyValue}
                                                        placeholder={maxQtyValue ? maxQtyValue : '20'}
                                                        placeholderTextColor={"#A2A2A2"}
                                                        style={{ borderWidth: 0, width: "60%", height: 40, paddingLeft: "2%" }}
                                                        keyboardType="numeric"
                                                        onChangeText={(text) => {
                                                            setMaxQtyData(text);
                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMaxQtyValue(text);
                                                            }
                                                        }}
                                                        maxLength={4}
                                                    />
                                                </View>
                                            }
                                        </View>
                                    </View>
                                    : null
                            }
                            {
                                dataValue == 0 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        categoryList.map((item, ind) => {
                                            return (
                                                <View style={{ marginLeft: "3%" }}>
                                                    <View style={{ marginTop: "3%", display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <TouchableOpacity style={{ display: "flex", flexDirection: "row" }} onPress={() => {
                                                            setClickedValue(item.name);
                                                        }}>
                                                            <Text style={{ fontSize: 16, color: "black", fontFamily: "Poppins-Medium", marginLeft: "5%" }}>{item.name}</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    {
                                                        item.name == clickedValue ?
                                                            <View style={{ marginTop: "5%" }}>
                                                                {
                                                                    item.lstSubCategories.map((itemCategoryList, index) => {

                                                                        return (
                                                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "80%", marginLeft: Platform.OS == "android" ? 0 : "2%" }}>
                                                                                <CheckBox
                                                                                    disabled={false}
                                                                                    value={checkedCategory[itemCategoryList.id]}
                                                                                    onValueChange={(newValue) => categoryValues(itemCategoryList, index, newValue)}
                                                                                />
                                                                                <View style={{ display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "8%" : "5%" }}>
                                                                                    <Text style={{ fontSize: 16, color: "black", fontFamily: "Poppins-Medium" }}>{itemCategoryList.name}</Text>
                                                                                </View>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View> : null

                                                    }

                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }
                            {
                                dataValue == 4 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        supplierList.map((item, i) => {
                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "2%", width: "80%" }}>
                                                    <CheckBox
                                                        disabled={false}
                                                        value={checkedSupplier[item.name]}
                                                        onValueChange={(newValue) => supplierValues(item, i, newValue)}
                                                    />
                                                    <View style={{ marginTop: Platform.OS == "android" ? "3%" : 0, display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "10%" : "5%" }}>
                                                        <Text style={{ fontSize: 12, color: "black", fontFamily: "Poppins-Medium" }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }

                            {
                                dataValue == 6 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        countryList.map((item, i) => {

                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "30%", marginLeft: "2%" }}>
                                                    <CheckBox
                                                        disabled={false}
                                                        value={checked[item.name]}
                                                        onValueChange={(newValue) => countryValues(item, i, newValue)}
                                                    />
                                                    <View style={{ marginTop: Platform.OS == "android" ? "3%" : 0, display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "30%" : "10%" }}>
                                                        <Text style={{ fontSize: 16, color: "black", fontFamily: "Poppins-Medium" }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }
                        </ScrollView>
                        <View style={{ position: "absolute", bottom: 0, backgroundColor: "white", width: "100%", height: "14%" }}>
                            <View style={{ width: "100%", alignSelf: "center", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <View style={{ marginLeft: "4%" }}>
                                    <Text style={{ fontSize: 13, color: "black", fontFamily: "Poppins-Medium" }}>{route.params.totalCount}</Text>
                                    <Text style={{ fontSize: 13, color: "black", fontFamily: "Poppins-Regular" }}>Product Count</Text>
                                </View>
                                {
                                    // lengthError == true && minValue.length == 0 && maxValue.length == 0 || lengthError1 == true && minValue1.length == 0 && maxValue1.length == 0 || lengthError2 == true && minValue2.length == 0 && maxValue2.length == 0 ?
                                    // <View style={{ backgroundColor: "#284B46", justifyContent: "center", width: 150, height: 60, alignItems: "center" }}
                                    //     onPress={() => applyFilter()}
                                    // >
                                    //     <Text style={{ fontSize: 20, color: "white", fontFamily: "Poppins-Medium" }}>Apply</Text>
                                    // </View>
                                    // :
                                    <TouchableOpacity style={{ backgroundColor: "#284B46", justifyContent: "center", width: 150, height: 60, alignItems: "center" }}
                                        onPress={() => applyFilter()}
                                    >
                                        <Text style={{ fontSize: 20, color: "white", fontFamily: "Poppins-Medium" }}>Apply</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView >
        </SafeAreaView >
    )
}

export default Filter