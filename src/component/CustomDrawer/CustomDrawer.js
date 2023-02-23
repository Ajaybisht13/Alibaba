import { View, Text, SafeAreaView, TouchableOpacity, Image, BackHandler, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Homee from 'react-native-vector-icons/FontAwesome';
import RNExitApp, { exitApp } from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

function CustomDrawer({ route }) {

    const navigation = useNavigation();
    const [filterValue, setFilterValue] = useState();
    const [roleId, setRoleId] = useState();

    useFocusEffect(
        React.useCallback(() => {
            getToken();
        }, [])
    );


    const getToken = async () => {
        const token = await AsyncStorage.getItem("authToken");
        const filterType = await AsyncStorage.getItem("Ali");
        setRoleId(token);
        setFilterValue(filterType);
        console.log("Filter type", token);
    }

    // const exitApp = () => {
    //     AsyncStorage.clear();
    //     RNExitApp.exitApp();
    // }

    const exitApp = async () => {
        Alert.alert(
            "Confirmation",
            "Are you want to Exit ?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => pressDiscard() }
            ]
        );
    }

    const pressDiscard = () => {
        AsyncStorage.clear();
        RNExitApp.exitApp();
    }

    const gotoOption = () => {
        navigation.navigate("SelectOption");
        navigation.dispatch(DrawerActions.closeDrawer());
    }

    return (
        <SafeAreaView>
            <View style={{ height: "100%", backgroundColor: "#284B46" }}>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "95%" }}>
                    <View>
                        <TouchableOpacity style={{ backgroundColor: "#132C29", height: 70 }}
                            onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
                        >
                            <View style={{ position: "absolute", bottom: 13, left: 10 }}>
                                <Text style={{ color: "white", fontSize: 16, fontFamily: "Poppins-Regular" }}>Hide Menu</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                AsyncStorage.removeItem("filterText");
                                AsyncStorage.removeItem("filterValue");
                                AsyncStorage.removeItem("countryName");
                                AsyncStorage.removeItem("categoryId");
                                AsyncStorage.removeItem("supplierId");
                                navigation.navigate("Product");
                                navigation.dispatch(DrawerActions.closeDrawer());
                            }}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Products.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Products</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.5, borderColor: "#FFFFFF" }}></View>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                AsyncStorage.removeItem("filterText");
                                AsyncStorage.removeItem("filterValue");
                                AsyncStorage.removeItem("countryName");
                                AsyncStorage.removeItem("categoryId");
                                AsyncStorage.removeItem("supplierId");
                                navigation.navigate("WishList");
                                navigation.dispatch(DrawerActions.closeDrawer());
                            }}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Wishlist.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Wishlist</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.5, borderColor: "#FFFFFF" }}></View>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => {
                                AsyncStorage.removeItem("filterText");
                                AsyncStorage.removeItem("filterValue");
                                AsyncStorage.removeItem("countryName");
                                AsyncStorage.removeItem("categoryId");
                                AsyncStorage.removeItem("supplierId");
                                navigation.navigate("ShortListed");
                                navigation.dispatch(DrawerActions.closeDrawer());
                            }}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Shortlist.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Shortlisted</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.5, borderColor: "#FFFFFF" }}></View>
                        {
                            roleId == 7 ?
                                <View style={{ height: 110, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: "#FFFFFF" }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.dispatch(DrawerActions.closeDrawer());
                                            navigation.navigate("Approved", {
                                                roleId: roleId
                                            });
                                        }}
                                    >
                                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                                            {/* <Image source={require('../Assets/Shortlist.png')} /> */}
                                            <FontAwesome name='user-o' color={"white"} size={45} />
                                            <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Approved</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                null
                        }
                    </View>
                    <View>
                        {
                            filterValue == 0 ? null :
                                <TouchableOpacity style={{}} onPress={() => gotoOption()}>
                                    <View style={{ justifyContent: "center", alignItems: "center" }}>
                                        <Homee name="home" color={"white"} size={55} />
                                    </View>
                                </TouchableOpacity>
                        }
                        <TouchableOpacity style={{ marginTop: "15%" }} onPress={() => exitApp()}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/logout.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default CustomDrawer