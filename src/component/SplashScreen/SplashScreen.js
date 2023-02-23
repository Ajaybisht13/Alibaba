import { Text, View, Image, SafeAreaView } from 'react-native'
import React, { Component, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import CopyRight from 'react-native-vector-icons/MaterialCommunityIcons'
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        AsyncStorage.clear();
        setTimeout(() => {
            gotoIntroduction()
        }, 1000);
    }, [])

    const gotoIntroduction = () => {
        navigation.navigate("Introduction");
    }
    return (
        <SafeAreaView>
            <LinearGradient colors={['#FFFFFF', '#F2FDFB']} style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
                <View style={{ height: 376, width: 376 }}>
                    <Image source={require('../Assets/Splash.png')} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                </View>
                <View style={{ position: "absolute", bottom: 20, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "52%" }}>
                    <CopyRight name='copyright' size={13} color="#284B46" />
                    <Text style={{ color: "#284B46", fontFamily: "Poppins-Regular", fontSize: 13, top: 1 }} adjustsFontSizeToFit={true}>2022. Nubiz Solutions Pvt. Ltd.</Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}

export default SplashScreen