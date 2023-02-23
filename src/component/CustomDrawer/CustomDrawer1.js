import { View, Text, SafeAreaView, TouchableOpacity, Image, BackHandler } from 'react-native'
import React from 'react'
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Homee from 'react-native-vector-icons/FontAwesome';
import RNExitApp, { exitApp } from 'react-native-exit-app';
import AsyncStorage from '@react-native-async-storage/async-storage';

function CustomDrawer1() {
    const navigation = useNavigation();

    const exitApp = () => {
        AsyncStorage.clear();
        RNExitApp.exitApp();
    }

    return (
        <SafeAreaView>
            <View style={{ height: "100%", backgroundColor: "#284B46" }}>
                <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "95%" }}>
                    <View>
                        <TouchableOpacity style={{ backgroundColor: "#132C29", height: 68 }}
                            onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
                        >
                            <View style={{ position: "absolute", bottom: 10, left: 10 }}>
                                <Text style={{ color: "white", fontSize: 16, fontFamily: "Poppins-Regular" }}>HideMenu</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => navigation.navigate("Product")}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Products.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Products</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.3, borderColor: "#FFFFFF" }}></View>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => navigation.navigate("WishList")}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Wishlist.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Wishlist</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.3, borderColor: "#FFFFFF" }}></View>
                        <TouchableOpacity style={{ height: 110, alignItems: "center", justifyContent: "center" }}
                            onPress={() => navigation.navigate("ShortListed")}
                        >
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image source={require('../Assets/Shortlist.png')} />
                                <Text style={{ color: "white", top: 5, fontFamily: "Poppins-Regular" }}>Shortlisted</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ borderWidth: 0.3, borderColor: "#FFFFFF" }}></View>
                    </View>
                    <View>
                        {/* <TouchableOpacity style={{}} onPress={() => navigation.navigate("SelectOption")}>
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Homee name="home" color={"white"} size={55} />
                            </View>
                        </TouchableOpacity> */}
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

export default CustomDrawer1