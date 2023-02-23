import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import ArrowLeft from 'react-native-vector-icons/FontAwesome'

const WishListHeader = () => {
    const navigation = useNavigation();


    const searchData = () => {
        
    }

    return (
        <SafeAreaView>
            <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={{ height: 60, alignItems: "center", justifyContent: "center" }}>
                <View style={{ display: "flex", flexDirection: "row", padding: "3%", justifyContent: "space-between", alignItems: "center", width: "96%" }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: "row", width: "60%", justifyContent: "space-between", alignItems: "center" }}>
                            {/* <Image source={require('../../Assets/icon-search.png')} style={{ height: 20, width: 20 }} resizeMode="contain" /> */}
                            <TouchableOpacity onPress={() => navigation.goBack("Product")}>
                                <ArrowLeft name='long-arrow-left' size={22} color="#000000" />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 24, color: "black", fontFamily: "Poppins-Medium" }}>Wishlist</Text>
                            <TextInput placeholder='Search'
                                onChangeText={(text) => searchData(text)}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", width: "18%", justifyContent: "space-between", alignItems: "center" }}>
                        <TouchableOpacity>
                            <Image source={require('../../Assets/icon-search1.png')} style={{ height: 20, width: 20 }} resizeMode="contain" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                            <View style={{ width: 25, height: 25 }}>
                                <Image source={require("../../Assets/Menu.png")} style={{ height: "100%", width: "100%", resizeMode: "contain" }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} */}
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default WishListHeader