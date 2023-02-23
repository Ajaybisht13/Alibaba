import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const Header = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={{ height: 50, alignItems: "center", justifyContent: "center", paddingBottom:"5%"}}>
                <View style={{ display: "flex", flexDirection: "row", padding: "5%", justifyContent: "space-between", alignItems: "center", marginTop: "5%", width: "90%", alignSelf: "center" }}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ backgroundColor: 'white', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, borderTopWidth: 1, borderLeftWidth: 1, borderBottomWidth: 1, height: 38, justifyContent: "center", alignItems: "center", width: 35, borderLeftColor: "#D1D1D1", borderTopColor: "#D1D1D1", borderBottomColor: "#D1D1D1" }}>
                                <Image source={require('../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                            </View>
                            <TextInput
                                placeholder='Search Product'
                                placeholderTextColor={"#A2A2A2"}
                                style={{ backgroundColor: 'white', fontSize: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#D1D1D1", width: "87%", height: 38, borderLeftColor: "transparent", borderRightWidth: 1, borderTopRightRadius: 6, borderBottomRightRadius: 6 }} />
                        </View>
                    </View>
                    {/* onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} */}
                    <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                        <View style={{ width: 25, height: 25 }}>
                            <Image source={require("../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default Header