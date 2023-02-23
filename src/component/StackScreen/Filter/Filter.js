import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput, Image, Keyboard } from 'react-native'
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
    const [countryList, setCountryList] = useState([]);
    const [countryPrevData, setCountryPrevData] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
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
    const [customValue, setCustomValue] = useState();
    const [selectValueData, setSelectValueData] = useState();
    const [minValuedata, setMinValueData] = useState("");
    const [maxValuedata, setMaxValueData] = useState("");
    const [minYearsValue, setMinYearsValue] = useState("");
    const [maxYearsValue, setMaxYearsValue] = useState("");
    const [minQtyValue, setMinQtyValue] = useState("");
    const [maxQtyValue, setMaxQtyValue] = useState("");
    const [roleId, setRoleId] = useState("");
    const [userList, setUserList] = useState([]);
    const [selectValueUser, setSelectValueUser] = useState();
    const [userId, setUserId] = useState();
    const [userName, setUserName] = useState();
    const [fetchData, setFetchData] = useState(false);
    const [wishlistCategory, setWishlistCategory] = useState([]);


    const [categoryCheck, setCategoryCheck] = useState(false);
    const [supplierCheck, setSupplierCheck] = useState(false);
    const [countryCheck, setCountryCheck] = useState(false);
    const [wishlistCategoryId, setWishListCategoryId] = useState();
    const [wishlistCategoryCheck, setWishListCategoryCheck] = useState(false);


    const [errorGen1, setErrorGen] = useState(false);
    const [yearErrorGen, setYearErrorGen] = useState(false);
    const [qtyErrorGen, setQtyErrorGen] = useState(false);
    const [priceEdit, setPriceEdit] = useState(false);
    const [yearEdit, setYearEdit] = useState(false);
    const [qtyEdit, setQtyEdit] = useState(false);

    const [checkedCountry, setCheckedCountry] = useState({});
    const [checkedSupplier, setCheckedSupplier] = useState({});
    const [checkedCategory, setCheckedCategory] = useState({});
    const [checkedUser, setCheckedUser] = useState({});
    const [checkedWishList, setCheckedWishList] = useState({});



    var data = require("../../DummyJson/data.json");


    const pageNumber = useRef(1);
    const categoryListRef = useRef([]);
    const supplierListRef = useRef([]);
    const countryListRef = useRef([]);
    const searchRef = useRef("");
    const userListRef = useRef();


    const rMinValuedata = useRef("");
    const rMaxValuedata = useRef("");
    const rMinYearsValue = useRef("");
    const rMaxYearsValue = useRef("");
    const rMinQtyValue = useRef("");
    const rMaxQtyValue = useRef("");

    useFocusEffect(
        React.useCallback(() => {
            pageNumber.current = 1;
            setDataValue(data[0].id);
            getCountryList();
            getSupplierList();
            getCategoryList();
            navigationData();
            getSearchText();
            getUsersList();
            getWishListCategory();
        }, [])
    )

    const getSearchText = async () => {
        const filterValueData = await AsyncStorage.getItem("filterValueData");
        const roleId = await AsyncStorage.getItem("roleId");
        setRoleId(roleId);
    }

    const setMinPriceData = (text) => {
        rMinValuedata.current = text;
        if (text.length > 0) {
            setLengthError(false);
            setPriceMinError(false);
            if (maxValuedata != null && maxValuedata.length > 0) {
                setErrorGen(false);
            }
        }
        else {
            setLengthError(true);
            setPriceMinError(true);
            setErrorGen(true);
        }
        customeFilterValidation();

    }

    const setPriceMaxValueData = (text) => {
        rMaxValuedata.current = text;
        if (text.length > 0) {
            setLengthErrorMax(false);
            setPriceMaxError(false);
            setErrorGen(false);
            if (minValuedata == null || minValuedata.length == 0) {
                setErrorGen(true);
            }
        } else {
            setLengthErrorMax(true);
            setPriceMaxError(true);
            setErrorGen(true);
        }
        customeFilterValidation();

    }

    const setMinYearData = (text) => {
        rMinYearsValue.current = text;
        if (text.length > 0) {
            setLengthError1(false);
            setYearMinError(false);
            if (maxYearsValue != null && maxYearsValue.length > 0) {
                setYearErrorGen(false);
            }
        }
        else {
            setLengthError1(true);
            setYearMinError(true);
            setYearErrorGen(true);
        }
        customeFilterValidation();

    }

    const setMaxYearData = (text) => {
        rMaxYearsValue.current = text;
        if (text.length > 0) {
            setLengthError1Max(false);
            setYearMaxError(false);
            setYearErrorGen(false);
            if (minYearsValue == null || minYearsValue.length == 0) {
                setYearErrorGen(true);
            }
        }

        else {
            setLengthError1Max(true);
            setYearMaxError(true);
            setYearErrorGen(true);
        }
        customeFilterValidation();

    }


    const setMinQtyData = (text) => {
        rMinQtyValue.current = text;
        if (text.length > 0) {
            setLengthError2(false);
            setQtyMinError(false);
            if (maxQtyValue != null && maxQtyValue.length > 0) {
                setQtyErrorGen(false);
            }
        }
        else {
            setLengthError2(true);
            setQtyMinError(true);
            setQtyErrorGen(true);
        }
        customeFilterValidation();

    }

    const setMaxQtyData = (text) => {
        rMaxQtyValue.current = text;
        if (text.length > 0) {
            setLengthError2Max(false);
            setQtyMaxError(false);
            setQtyErrorGen(false);
            if (minQtyValue == null || minQtyValue.length == 0) {
                setQtyErrorGen(true);
            }
        }
        else {
            setLengthError2Max(true);
            setQtyMaxError(true);
            setQtyErrorGen(true);
        }
        customeFilterValidation();

    }


    const customeFilterValidation = () => {
        for (let i = 1; i < data.length - 1; i++) {
            if (i != 4) {
                for (let j = 0; j < data[i].subItem.length; j++) {

                    if (data[i].subItem[j].isSelected == true && data[i].subItem[j].filterName == "Custom" && data[i].id == 1) {

                        if (rMinValuedata.current.length == 0 || rMaxValuedata.current.length == 0 || parseInt(rMinValuedata.current) > parseInt(rMaxValuedata.current)) {
                            console.log("Price Error");
                            setErrorGen(true);
                        }
                    }
                    if (data[i].subItem[j].isSelected == true && data[i].subItem[j].filterName == "Custom" && data[i].id == 3) {
                        if (rMinYearsValue.current.length == 0 || rMaxYearsValue.current.length == 0 || parseInt(rMinYearsValue.current) > parseInt(rMaxYearsValue.current)) {
                            console.log("Year Error");
                            setYearErrorGen(true);
                        }
                    }
                    if (data[i].subItem[j].isSelected == true && data[i].subItem[j].filterName == "Custom" && data[i].id == 5) {

                        if (rMinQtyValue.current.length == 0 || rMaxQtyValue.current.length == 0 || parseInt(rMinQtyValue.current) > parseInt(rMaxQtyValue.current)) {
                            console.log("Qty Error");
                            setQtyErrorGen(true);
                        }
                    }
                }
            }
        }
    }

    const navigationData = async () => {
        const navigationValue = await AsyncStorage.getItem("navigationId");
        if (navigationValue == 2 || navigationValue == 4) {
            data = await AsyncStorage.getItem("jsonData");
            clearStorage();
        } else if (navigationValue == null || navigationValue != route.params.productFilterId) {

            await AsyncStorage.removeItem("jsonData");
            onClearButton();
        }
        AsyncStorage.setItem("navigationId", route.params.productFilterId.toString());
    }



    const getCountryList = () => {
        axios.get(baseUrl + "Product/GetCountry")
            .then(async (response) => {
                const countryDataList = await AsyncStorage.getItem("countryData");
                if (countryDataList == null) {
                    setCountryList(response.data.data);
                    setCountryPrevData(response.data.data);
                } else {
                    setCountryList(JSON.parse(countryDataList));
                    setCountryPrevData(JSON.parse(countryDataList));
                }
            })
    }

    const getSupplierList = () => {
        var pageNo = pageNumber.current;
        var searchInput = searchRef.current;

        axios.get(baseUrl + `Product/GetSuppliersWithSearch?pageNumber=${pageNo}&pageSize=20&search=${searchInput}`)
            .then(async (response) => {
                const categoryDataList = await AsyncStorage.getItem("supplierData");
                if (response.data.totalPages == 0) {
                    setFetchData(true);
                } else {
                    setFetchData(false);
                }
                pageNo = pageNo + 1;

                pageNumber.current = pageNo;

                if (categoryDataList == null) {
                    setSupplierList([...supplierList, ...response.data.data]);
                } else {
                    setSupplierList([...supplierList, ...JSON.parse(categoryDataList)]);
                }
            })
    }

    const getCategoryList = () => {
        axios.get(baseUrl + "Product/GetCategories")
            .then(async (response) => {
                const categoryDataList = await AsyncStorage.getItem("categoryData");
                if (categoryDataList == null) {
                    setCategoryList(response.data.data);
                } else {
                    setCategoryList(JSON.parse(categoryDataList));
                }
            })
    }

    const getUsersList = () => {
        axios.get(baseUrl + "Product/GetUsers")
            .then(async (response) => {
                userListRef.current = response.data.data;
                const userDataList = await AsyncStorage.getItem("userData");
                console.log(userDataList);
                if (userDataList == null) {
                    setUserList(response.data.data);
                } else {
                    setUserList(JSON.parse(userDataList));
                }
            })
    }

    const getWishListCategory = async () => {
        const token = await AsyncStorage.getItem("authToken");
        axios.post(baseUrl + `Product/GetWishlistByUser?userId=${token}`)
            .then(async (response) => {
                const wishListData = await AsyncStorage.getItem("wishListData");
                let data_ = response.data.data;
                for (let i = 0; i < data_.length; i++) {
                    data_[i].isSelected = false;
                }
                // data_[0].isSelected = true;
                if (wishListData == null) {
                    setWishlistCategory(data_);
                } else {
                    setWishlistCategory(JSON.parse(wishListData));
                }
            })
    }

    const onWishListCategory = (item, index, newValue) => {
        setCheckedWishList({ ...checkedWishList, [item.id]: newValue });
        if (item.isSelected == false) {
            item.isSelected = true;

        } else {
            item.isSelected = false;
        }

        var data = wishlistCategory;
        for (let i = 0; i < data.length; i++) {
            if (i == index) {
                data[i] = item;
                break;
            }
        }
        console.log(data);
        setWishlistCategory(data);
    }

    const clearStorage = async () => {
        await AsyncStorage.getItem("filterValue");
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


        for (let i = 0; i < data.length - 1; i++) {
            for (let j = 0; j < data[i].subItem.length; j++) {
                if (data[i].subItem[j].isSelected == true) {
                    data[i].subItem[j].isSelected = false;
                    setSelectValueData(data[i].subItem[j].isSelected);
                }
            }
        }


        for (let i = 0; i < categoryList.length; i++) {
            for (let j = 0; j < categoryList[i].lstSubCategories.length; j++) {
                if (categoryList[i].lstSubCategories[j].isSelected == true) {
                    categoryList[i].lstSubCategories[j].isSelected = false;
                    setCategoryCheck(categoryList[i].lstSubCategories[j].isSelected);
                }
            }
        }

        for (let i = 0; i < supplierList.length; i++) {
            if (supplierList[i].isSelected == true) {
                supplierList[i].isSelected = false;
                setSupplierCheck(supplierList[i].isSelected);
            }
        }

        for (let i = 0; i < countryList.length; i++) {
            if (countryList[i].isSelected == true) {
                countryList[i].isSelected = false;
                setCountryCheck(countryList[i].isSelected);
            }
        }


        for (let i = 0; i < wishlistCategory.length; i++) {
            if (wishlistCategory[i].isSelected == true) {
                wishlistCategory[i].isSelected = false;
                setWishListCategoryCheck(wishlistCategory[i].isSelected);
            }
        }

        for (let i = 0; i < userList.length; i++) {
            if (userList[i].isSelected == true) {
                userList[i].isSelected = false;
                setSelectValueUser(userList[i].isSelected);
            }
        }
        setUserList(userListRef.current);
        getUsersList();
        setMinValueData("");
        setMaxValueData("");
        setMinYearsValue("");
        setMaxYearsValue("");
        setMinQtyValue("");
        setMaxQtyValue("")
        setCheckedCategory(false);
        setCheckedSupplier(false);
        setCheckedCountry(false);
        setCheckedUser(false);
        setCheckedWishList(false);
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
        await AsyncStorage.removeItem("filterValueData");
        await AsyncStorage.removeItem("countryData");
        await AsyncStorage.removeItem("supplierData");
        await AsyncStorage.removeItem("categoryData");
        await AsyncStorage.removeItem("wishListData");
        await AsyncStorage.removeItem("wishListFilterData");
        await AsyncStorage.removeItem("userData");
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
                        setCustomValue(itemPrice);
                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 1) {
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError(true);
                                setLengthErrorMax(true);
                                setErrorGen(true);
                                setPriceEdit(true);
                            }
                            else {
                                setLengthError(false);
                                setLengthErrorMax(false);
                                setPriceMinError(true);
                                setPriceMaxError(true);
                                setMinValueData("");
                                setMaxValueData("");
                                setErrorGen(false);
                                setPriceEdit(false);
                            }

                        } else if (data[i].subItem[j].filterName != "Custom" && dataValue == 1 && data[i].subItem[j].isSelected == true) {
                            setLengthError(false);
                            setLengthErrorMax(false);
                            setPriceMinError(true);
                            setPriceMaxError(true);
                            setMinValueData("");
                            setMaxValueData("");
                            setErrorGen(false);
                            setPriceEdit(false);
                        }

                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 3) {
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError1(true);
                                setLengthError1Max(true);
                                setYearErrorGen(true);
                                setYearEdit(true);
                            }
                            else {
                                setLengthError1(false);
                                setLengthError1Max(false);
                                setYearMinError(true);
                                setYearMaxError(true);
                                setMinYearsValue("");
                                setMaxYearsValue("");
                                setYearErrorGen(false);
                                setYearEdit(false);
                            }
                        }
                        else if (data[i].subItem[j].filterName != "Custom" && dataValue == 3 && data[i].subItem[j].isSelected == true) {
                            setLengthError1(false);
                            setLengthError1Max(false);
                            setYearMinError(true);
                            setYearMaxError(true);
                            setMinYearsValue("");
                            setMaxYearsValue("");
                            setYearErrorGen(false);
                            setYearEdit(false);
                        }
                        if (data[i].subItem[j].filterName == "Custom" && dataValue == 5) {
                            if (data[i].subItem[j].isSelected == true) {
                                setLengthError2(true);
                                setLengthError2Max(true);
                                setQtyErrorGen(true);
                                setQtyEdit(true);
                            }
                            else {
                                setLengthError2(false);
                                setLengthError2Max(false);
                                setQtyMinError(true);
                                setQtyMaxError(true);
                                setMinQtyValue("");
                                setMaxQtyValue("");
                                setQtyErrorGen(false);
                                setQtyEdit(false);
                            }
                        }
                        else if (data[i].subItem[j].filterName != "Custom" && dataValue == 5 && data[i].subItem[j].isSelected == true) {
                            setLengthError2(false);
                            setLengthError2Max(false);
                            setQtyMinError(true);
                            setQtyMaxError(true);
                            setMinQtyValue("");
                            setMaxQtyValue("");
                            setQtyErrorGen(false);
                            setQtyEdit(false);
                        }
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

    }

    const countryValues = async (item, index, newValue) => {
        setCheckedCountry({ ...checkedCountry, [item.name]: newValue });

        if (item.isSelected == false) {
            item.isSelected = true;

        } else {
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
        setCheckedSupplier({ ...checkedSupplier, [item.name]: newValue });
        if (item.isSelected == false) {
            item.isSelected = true;
        }
        else {
            item.isSelected = false;
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

    const selectFilterUser = (item, index) => {
        for (let i = 0; i < userList.length; i++) {
            if (index == i) {
                // userList[i].isSelected = !userList[i].isSelected;
                item.isSelected = true;

            } else {
                userList[i].isSelected = false;
            }
            // setSelectValueUser(item.isSelected);
            setUserId(item.id);
            setUserName(item.name);
        }

        var data = userList;
        for (let i = 0; i < data.length; i++) {
            if (i == index) {
                data[i].isSelected = item.isSelected;
                break;
            }
        }

        console.log("data", data);

        setUserList(data);
    }



    const applyFilter = async () => {
        var FilterJson = [];
        let minMaxData = "";
        let errorGen = false;
        for (let i = 1; i < data.length - 1; i++) {
            if (i != 4) {
                for (let j = 0; j < data[i].subItem.length; j++) {

                    if (data[i].subItem[j].isSelected == true) {

                        if (data[i].subItem[j].filterName == "Custom") {
                            if (data[i].id == 1) {
                                if (minValuedata.length > 0 && maxValuedata.length > 0) {
                                    minMaxData = minValuedata.toString() + "-" + maxValuedata.toString();
                                    await AsyncStorage.setItem("minValue", minValuedata);
                                    await AsyncStorage.setItem("maxValue", maxValuedata);
                                    errorGen = false;
                                } else {
                                    errorGen = true;
                                    setErrorGen(true);
                                }
                            } else if (data[i].id == 3) {
                                if (minYearsValue.length > 0 && maxYearsValue.length > 0) {
                                    minMaxData = minYearsValue.toString() + "-" + maxYearsValue.toString();
                                    await AsyncStorage.setItem("minYearsValue", minYearsValue);
                                    await AsyncStorage.setItem("maxYearsValue", maxYearsValue);
                                    errorGen = false;
                                }
                                else {
                                    errorGen = true;
                                    setYearErrorGen(true);
                                }
                            } else if (data[i].id == 5) {
                                await AsyncStorage.setItem("minQtyValue", minQtyValue);
                                await AsyncStorage.setItem("maxQtyValue", maxQtyValue);
                                if (minQtyValue.length > 0 && maxQtyValue.length > 0) {
                                    minMaxData = minQtyValue.toString() + "-" + maxQtyValue.toString();
                                    errorGen = false;
                                }
                                else {
                                    errorGen = true;
                                    setQtyErrorGen(true);
                                }
                            }
                            if (errorGen == false) {
                                // setErrorGen(false);
                                let objCustom = {
                                    "name": data[i].subItem[j].name,
                                    "filterValue": minMaxData,
                                }
                                FilterJson.push(objCustom);
                            }
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

        let UserId = 0;
        for (let userindex = 0; userindex < userList.length; userindex++) {
            if (userList[userindex].isSelected == true) {
                UserId = userList[userindex].userId;
            }

        }


        let wishListData = wishlistCategory;
        var wishListFilterData = [];
        for (let index = 0; index < wishListData.length; index++) {
            if (wishListData[index].isSelected == true) {
                wishListFilterData.push(wishListData[index].id);
            }

        }

        AsyncStorage.setItem("userId", UserId.toString());
        AsyncStorage.setItem("countryName", JSON.stringify(countryFilterData));
        AsyncStorage.setItem("supplierId", JSON.stringify(supplierFilterData));
        AsyncStorage.setItem("categoryId", JSON.stringify(categoryFilterData));
        AsyncStorage.setItem("filterValue", JSON.stringify(FilterJson));
        AsyncStorage.setItem("categoryData", JSON.stringify(categoryData));
        AsyncStorage.setItem("supplierData", JSON.stringify(supplierData));
        AsyncStorage.setItem("countryData", JSON.stringify(countryData));
        AsyncStorage.setItem("wishListData", JSON.stringify(wishListData));
        AsyncStorage.setItem("userData", JSON.stringify(userList));
        AsyncStorage.setItem("wishListFilterData", JSON.stringify(wishListFilterData));
        AsyncStorage.setItem("filterText", route.params.categoryName);
        AsyncStorage.setItem("jsonData", JSON.stringify(data));
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

    // const searchVenderList = () => {
    //     if (searchText.length >= 3 || searchText.length == 0) {
    //         Keyboard.dismiss();
    //         pageNumber.current = 1;
    //         const emptArr = supplierList.splice(0, supplierList.length);
    //         setSupplierList(emptArr);
    //         getSupplierList();
    //     }
    // }


    const searchData = (text) => {
        if (dataValue == 4) {
            // setSearchText(text);
            searchRef.current = text;
            if (text.length >= 3 || text.length == 0) {
                pageNumber.current = 1;
                const emptArr = supplierList.splice(0, supplierList.length);
                setSupplierList(emptArr);
                getSupplierList();
            }
        }


        if (dataValue == 6) {
            const newDataList = countryPrevData;
            const newData = newDataList.filter(item => {
                const itemData = item.name.toUpperCase();
                const textData = text.toUpperCase();
                if (itemData.includes(textData)) {
                    return item.name;
                }
            });
            if (text.length > 0) {
                setCountryList(newData);
            } else {
                setCountryList(countryPrevData);
            }
        }
    }

    const onscrollUp = () => {
        if (dataValue == 4 && searchRef.current.length >= 3 || searchRef.current.length == 0) {
            getSupplierList();
        }
    }

    // const reload = () => {
    //     setSearchText('');
    //     Keyboard.dismiss();
    //     const emptArr = supplierList.splice(0, supplierList.length);
    //     setSupplierList(emptArr);
    //     setFetchData(false);
    //     pageNumber.current = 1;
    //     getSupplierList();
    // }



    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior='padding'>
                <View style={{ height: "100%", backgroundColor: "white" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "96%", alignSelf: "center", alignItems: "center", height: 50 }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => {
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
                                        if (item.id != 7 && item.id != 8) {
                                            return (
                                                <TouchableOpacity style={{ width: "96%", alignSelf: "flex-end" }} onPress={() => selectValue(item.id)}>
                                                    <View style={{ backgroundColor: item.id == dataValue ? "white" : "#284B46", padding: "2%", borderBottomWidth: 0.5, borderBottomColor: "white", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                                        <View style={{ justifyContent: "center", marginTop: "8%" }}>
                                                            <Text style={{ fontSize: 16, color: item.id == dataValue ? "black" : "white", fontFamily: "Poppins-Medium", marginLeft: "5%", marginBottom: Platform.OS == "android" ? "5%" : "6%" }}>{item.category}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        } else if ((roleId == 1 || roleId == 4) && item.id == 7 && route.params.productFilterId == 3) {
                                            return (
                                                <TouchableOpacity style={{ width: "96%", alignSelf: "flex-end" }} onPress={() => selectValue(item.id)}>
                                                    <View style={{ backgroundColor: item.id == dataValue ? "white" : "#284B46", padding: "2%", borderBottomWidth: 0.5, borderBottomColor: "white", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                                        <View style={{ justifyContent: "center", marginTop: "8%" }}>

                                                            <Text style={{ fontSize: 16, color: item.id == dataValue ? "black" : "white", fontFamily: "Poppins-Medium", marginLeft: "5%", marginBottom: Platform.OS == "android" ? "5%" : "6%" }}>{item.category}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                            // ((roleId != 1 && roleId != 4) && item.id == 8 && (route.params.productFilterId == 2 || route.params.productFilterId == 4))
                                        } else if (item.id == 8 && (route.params.productFilterId == 2 || route.params.productFilterId == 4)) {
                                            return (
                                                <TouchableOpacity style={{ width: "96%", alignSelf: "flex-end" }} onPress={() => selectValue(item.id)}>
                                                    <View style={{ backgroundColor: item.id == dataValue ? "white" : "#284B46", padding: "2%", borderBottomWidth: 0.5, borderBottomColor: "white", borderTopLeftRadius: 2, borderBottomLeftRadius: 2 }}>
                                                        <View style={{ justifyContent: "center", marginTop: "8%" }}>

                                                            <Text style={{ fontSize: 16, color: item.id == dataValue ? "black" : "white", fontFamily: "Poppins-Medium", marginLeft: "5%", marginBottom: Platform.OS == "android" ? "5%" : "6%" }}>{item.category}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    })
                                }
                            </View>
                        </ScrollView>
                        <ScrollView onScrollEndDrag={() => onscrollUp()} style={{ width: "70%" }} contentContainerStyle={{ paddingBottom: "42%" }}>
                            {
                                dataValue == 4 || dataValue == 6 ?
                                    <View>
                                        <View style={{ flexDirection: "row", alignItems: "center", width: "80%", marginTop: "2%", marginLeft: "1%" }}>
                                            <TouchableOpacity style={{ borderLeftColor: "transparent", height: 40, alignItems: "center", justifyContent: "center", width: 40 }}
                                            // onPress={() => searchVenderList()}
                                            >
                                                <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                            </TouchableOpacity>
                                            <TextInput placeholder={dataValue == 4 ? 'Supplier' : "Country"}
                                                placeholderTextColor={"#A2A2A2"}
                                                onChangeText={(text) => searchData(text)}
                                                style={{ borderRightColor: "transparent", height: 40, width: "85%", borderBottomColor: "#A2A2A2" }}
                                            // value={searchText}
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
                                                                                itemPrice.isSelected ?
                                                                                    <TouchableOpacity onPress={() => { selectFilterValue(itemPrice, index, item.id, ind) }}>
                                                                                        <Image source={require('../../Assets/check.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                                                    </TouchableOpacity>
                                                                                    :
                                                                                    <TouchableOpacity onPress={() => { selectFilterValue(itemPrice, index, item.id, ind) }}>
                                                                                        <Image source={require('../../Assets/uncheck.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
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
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError == false && dataValue == 1 && errorGen1 == false ? (PriceMinError == false) ? "green" : "black" : "red" }}>
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

                                                            if (text.match(/^([0-9]{1,})?(\.)?([0-9]{1,})?$/)) {
                                                                setMinValueData(text);
                                                            }
                                                            setMinPriceData(text);
                                                        }
                                                        }
                                                        maxLength={4}
                                                        editable={priceEdit == false ? false : true}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 3 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError1 == false && dataValue == 3 && yearErrorGen == false ? (YearMinError == false) ? "green" : "black" : "red" }}>
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
                                                        editable={yearEdit == false ? false : true}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 5 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, borderRadius: 5, borderColor: lengthError2 == false && dataValue == 5 && qtyErrorGen == false ? (QtyMinError == false) ? "green" : "black" : "red" }}>
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
                                                        editable={qtyEdit == false ? false : true}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 1 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthErrorMax == false && dataValue == 1 && errorGen1 == false ? (PriceMaxError == false) ? "green" : "black" : "red" }}>
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

                                                            }
                                                        }}
                                                        maxLength={4}
                                                        editable={priceEdit == false ? false : true}
                                                    />


                                                </View>
                                            }
                                            {
                                                dataValue == 3 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthError1Max == false && dataValue == 3 && yearErrorGen == false ? (YearMaxError == false) ? "green" : "black" : "red" }}>
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
                                                        editable={yearEdit == false ? false : true}
                                                    />
                                                </View>
                                            }
                                            {
                                                dataValue == 5 &&
                                                <View style={{ width: "70%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "18%", borderWidth: 1, marginTop: "5%", borderRadius: 5, borderColor: lengthError2Max == false && dataValue == 5 && qtyErrorGen == false ? (QtyMaxError == false) ? "green" : "black" : "red" }}>
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
                                                        editable={qtyEdit == false ? false : true}
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
                                                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "80%", marginLeft: Platform.OS == "android" ? 0 : "2%", marginTop: "3%" }}>
                                                                                <CheckBox
                                                                                    disabled={false}
                                                                                    value={itemCategoryList.isSelected == true ? itemCategoryList.isSelected : checkedCategory[itemCategoryList.id]}
                                                                                    // value={itemCategoryList.isSelected}
                                                                                    onValueChange={(newValue) => categoryValues(itemCategoryList, index, newValue)}
                                                                                    boxType="square"
                                                                                    style={{ height: 20, width: 20 }}
                                                                                    onTintColor="#000000"
                                                                                    onCheckColor="#000000"
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
                                    {/* {
                                        fetchData ?
                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90%" }}>
                                                <Text style={{ fontSize: 18 }}>No Record Found</Text>
                                                <TouchableOpacity onPress={() => reload()}
                                                    style={{ height: 30, width: 80, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                                                >
                                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                                        <Text>  Refresh</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <View> */}
                                    {
                                        supplierList.map((item, i) => {
                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "2%", width: "80%", marginTop: "3%" }}>
                                                    <CheckBox
                                                        disabled={false}
                                                        value={item.isSelected == true ? item.isSelected : checkedSupplier[item.name]}
                                                        // value={item.isSelected}
                                                        onValueChange={(newValue) => supplierValues(item, i, newValue)}
                                                        boxType="square"
                                                        style={{ height: 20, width: 20 }}
                                                        onTintColor="#000000"
                                                        onCheckColor="#000000"
                                                    />
                                                    <View style={{ marginTop: Platform.OS == "android" ? "3%" : 0, display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "10%" : "5%" }}>
                                                        <Text style={{ fontSize: 12, color: "black", fontFamily: "Poppins-Medium" }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                //     }
                                // </View>
                            }

                            {
                                dataValue == 6 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        countryList.map((item, i) => {

                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "30%", marginLeft: "2%", marginTop: "3%" }}>
                                                    <CheckBox
                                                        disabled={false}
                                                        value={item.isSelected == true ? item.isSelected : checkedCountry[item.name]}
                                                        // value={item.isSelected}
                                                        onValueChange={(newValue) => countryValues(item, i, newValue)}
                                                        boxType="square"
                                                        style={{ height: 20, width: 20 }}
                                                        onTintColor="#000000"
                                                        onCheckColor="#000000"
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
                            {
                                dataValue == 7 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        userList.map((item, index) => {
                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "2%", marginTop: "3%" }}>
                                                    {
                                                        item.isSelected === false ?
                                                            <TouchableOpacity onPress={() => { selectFilterUser(item, index) }}>
                                                                <Image source={require('../../Assets/uncheck.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                            </TouchableOpacity>
                                                            :
                                                            <TouchableOpacity onPress={() => { selectFilterUser(item, index) }}>
                                                                <Image source={require('../../Assets/check.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                                                            </TouchableOpacity>
                                                    }
                                                    <View style={{ marginTop: Platform.OS == "android" ? "1%" : 0, display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "5%" : "5%" }}>
                                                        <Text style={{ fontSize: 16, color: "black", fontFamily: "Poppins-Medium" }}>{item.name}</Text>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            }
                            {
                                dataValue == 8 &&
                                <View style={{ padding: "3%" }}>
                                    {
                                        wishlistCategory && wishlistCategory.map((item, index) => {
                                            return (
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "2%", marginTop: "3%" }}>
                                                    <CheckBox
                                                        disabled={false}
                                                        value={item.isSelected ? item.isSelected : checkedWishList[item.id]}
                                                        onValueChange={(newValue) => onWishListCategory(item, index, newValue)}
                                                        boxType="square"
                                                        style={{ height: 20, width: 20 }}
                                                        onTintColor="#000000"
                                                        onCheckColor="#000000"
                                                    />
                                                    <View style={{ marginTop: Platform.OS == "android" ? "1%" : 0, display: "flex", flexDirection: "row", marginLeft: Platform.OS == "android" ? "5%" : "5%" }}>
                                                        <Text style={{ fontSize: 16, color: "black", fontFamily: "Poppins-Medium" }}>{item.wishlistName}</Text>
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
                                    errorGen1 == true || yearErrorGen == true || qtyErrorGen == true ?
                                        <View style={{ backgroundColor: "#284B46", justifyContent: "center", width: 150, height: 60, alignItems: "center" }}
                                        // onPress={() => applyFilter()}
                                        >
                                            <Text style={{ fontSize: 20, color: "white", fontFamily: "Poppins-Medium" }}>Apply</Text>
                                        </View>
                                        :
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