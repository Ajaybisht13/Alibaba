import { View, Text, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CheckBox from '@react-native-community/checkbox';
import { useFocusEffect } from '@react-navigation/native';
import { baseUrl } from '../ApiConfigs/baseUrl';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native'

const AdminFilter = ({ route }) => {

    const navigation = useNavigation();

    const [dataValue, setDataValue] = useState();
    const [isSelected, setSelection] = useState(false);
    const [checkedValue, setCheckedValue] = useState([]);
    const [user, setUser] = useState([]);
    const [total, setTotal] = useState();

    const data = require('../DummyJson/data.json');

    const pageNumber = useRef(1);

    useFocusEffect(
        React.useCallback(() => {
            pageNumber.current = 1;
            setDataValue(data[0].id);
            getFilterList()
        }, [])
    )



    const getFilterList = async () => {
        const filterType = await AsyncStorage.getItem("Ali");
        const roleId = await AsyncStorage.getItem("roleId");
        let dataObj = {
            "pageNumber": pageNumber.current,
            "pageSize": 10,
            "statusID": 1,
            "filterType": 0,
            "search": "",
            "userID": 0,
            "filtersList": []
        }
        axios.post(baseUrl + "Product/GetAdminProductsWithStatus", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (response) => {
            console.log("user data", response.data.data);
            setUser(response.data.data);
            var add = 0;

            for (var i = 0; i < user.length; i++) {
                for (var j = 0; j < user[i].users.length; j++) {
                    add += user[i].users.length
                }
            }
            console.log(add);
        })
    }

    const checkValue = (itemPrice, id) => {
        if (id == dataValue) {
            setCheckedValue(itemPrice);
            console.log(checkedValue);
        }
    }

    const selectValue = (id) => {
        setDataValue(id);
        console.log(dataValue);
    }

    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior='padding'>
                <View style={{ height: "100%", backgroundColor: "white" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "96%", alignSelf: "center", alignItems: "center", height: 50 }}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => navigation.navigate("AdminProduct")} style={{ marginTop: "-1%" }}>
                                <FontAwesome name='long-arrow-left' size={22} color="#000000" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 18, color: "black", fontFamily: "Poppins-Medium", marginLeft: "5%" }}> {route.params.categoryName}</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#284B46", padding: "3%", width: "30%", alignItems: "center" }}>
                            <Text style={{ fontSize: 15, color: "white", fontFamily: "Poppins-Medium" }}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderWidth: 0.5, borderColor: "gray" }}></View>
                    <View style={{ height: "100%", display: "flex", flexDirection: "row" }}>
                        <ScrollView style={{ backgroundColor: "#ededed", width: "40%" }}>
                            {
                                data.map((item, index) => {
                                    return (
                                        <View>
                                            <View style={{ backgroundColor: item.id == dataValue ? "white" : "#ededed", padding: "2%" }}>
                                                <TouchableOpacity style={{ justifyContent: "center", marginTop: "8%" }} onPress={() => selectValue(item.id)}>
                                                    <Text style={{ fontSize: 16, color: item.id == dataValue ? "#0096FF" : "black", fontFamily: "Poppins-Medium", marginLeft: "5%", marginBottom: Platform.OS == "android" ? "5%" : "6%" }}>{item.category}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                        <ScrollView style={{ width: "70%" }}>
                            {
                                data.map((item, index) => {
                                    return (
                                        <View>
                                            {
                                                item.subItem.map((itemPrice, index) => {
                                                    console.log(itemPrice);
                                                    return (
                                                        <View>
                                                            {
                                                                item.id == dataValue ?
                                                                    <View style={{ justifyContent: "center", padding: "5%" }}>
                                                                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "2%" }}>

                                                                            <CheckBox
                                                                                disabled={false}
                                                                                value={isSelected}
                                                                                boxType="square"
                                                                                onValueChange={(newValue) => checkValue(itemPrice, item.id)}
                                                                                tintColor="black"
                                                                                lineWidth={1}
                                                                            />

                                                                            <View style={{ marginLeft: Platform.OS == "android" ? "10%" : "5%", marginTop: Platform.OS == "android" ? 0 : "1%" }}>
                                                                                <Text style={{ fontSize: 15, color: "black", fontFamily: "Poppins-Regular" }}>{itemPrice.name}</Text>
                                                                            </View>
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
                                data[0].id == dataValue &&
                                <View style={{ display: "flex", flexDirection: "row", marginTop: "10%", alignSelf: "center", justifyContent: "space-between" }}>
                                    <View style={{ width: "41%", alignItems: "center" }}>
                                        <Text style={{ color: "black", fontFamily: "Poppins-Regular" }} adjustsFontSizeToFit={true}>Starting Price</Text>
                                        <TextInput placeholder=''
                                            style={{ borderWidth: 1, width: "80%", marginTop: "5%", textAlign: "center", height: "30%", borderRadius: 5 }}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <View style={{ width: "40%", alignItems: "center" }}>
                                        <Text style={{ color: "black", fontFamily: "Poppins-Regular" }}>Last Price</Text>
                                        <TextInput placeholder=''
                                            style={{ borderWidth: 1, width: "80%", marginTop: "5%", textAlign: "center", height: "30%", borderRadius: 5, color: "black", fontFamily: "Poppins-Regular" }}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={{ position: "absolute", bottom: 0, backgroundColor: "white", width: "100%", height: "12%" }}>
                    <View style={{ width: "90%", alignSelf: "center", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: Platform.OS == "android" ? "5%" : "3%" }}>
                        <View>
                            <Text style={{ fontSize: 13, color: "black", fontFamily: "Poppins-Medium" }}>{route.params.totalCount} Products</Text>
                            <Text style={{ fontSize: 13, color: "black", fontFamily: "Poppins-Regular" }}>Product Count</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: "#284B46", padding: "3%", width: "30%", alignItems: "center" }}>
                            <Text style={{ fontSize: 15, color: "white", fontFamily: "Poppins-Medium" }}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default AdminFilter