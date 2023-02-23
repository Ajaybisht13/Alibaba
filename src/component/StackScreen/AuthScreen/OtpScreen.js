import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Keyboard, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import OTPTextView from 'react-native-otp-textinput'
import ArrowRight from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { baseUrl } from '../../ApiConfigs/baseUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpScreen = () => {

    const navigation = useNavigation();

    const [code, setEnterCode] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const enterCode = (text) => {
        AsyncStorage.setItem("authToken", text);
        setEnterCode(text);
    }

    const goToProductScreen = () => {

        let dataObj = {
            "authCode": code
        }
        axios.post(baseUrl + "Product/AuthUserV2", dataObj, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (response) => {
            console.log("otp data", response.data);
            if (response.data.succeeded == true) {
                setError(false);
                await AsyncStorage.setItem("authToken", response.data.data.userId.toString());
                await AsyncStorage.setItem("roleId", response.data.data.roleId.toString());
                navigation.navigate("SelectOption", {
                    status: response.data.data.userId.express,
                    roleId: response.data.data.roleId
                });

            } else {
                setError(true);
                setErrorMessage(response.data.message);
            }
        })
    }

    return (
        <SafeAreaView>
            <KeyboardAvoidingView behavior='padding'>
                <LinearGradient colors={['#FFFFFF', '#F2FDFB']} style={{ height: "100%" }}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ color: '#000000', fontSize: 36, fontFamily: 'HelveticaNeue Bold', marginLeft: "4%" }}>Verify Account</Text>
                        <Text style={{ textAlign: 'left', fontSize: 20, color: '#000000', fontFamily: 'HelveticaNeue Medium', marginTop: "3%", marginLeft: "4%" }}>Enter The Verification Code </Text>
                        <Text></Text>
                        <View style={{ width: "90%", alignSelf: "center" }}>
                            <OTPTextView
                                tintColor="black"
                                offTintColor="gray"
                                inputCount={6}
                                handleTextChange={(text) => enterCode(text)}
                            />
                        </View>
                        {
                            error ?
                                <View style={{ alignSelf: "center" }}>
                                    <Text style={{ color: "red", fontFamily: "Poppins-Medium" }}>{errorMessage}</Text>
                                </View> : null
                        }
                        <View style={{ alignItems: "center", top: "5%", alignSelf: "center" }}>
                            <TouchableOpacity style={{
                                width: 226,
                                height: 52,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                backgroundColor: "#000000",
                                paddingHorizontal: 10,
                                alignItems: 'center',
                                borderRadius: 30
                            }}
                                onPress={() => goToProductScreen()}
                            >
                                <Text style={{ color: "#ffffff", fontWeight: "bold", fontSize: 20, left: 25, fontSize: 20 }}>Continue</Text>
                                <View style={{ height: 30, width: 30, backgroundColor: "gray", borderRadius: 35, justifyContent: "center", alignItems: "center" }}>
                                    <ArrowRight name='keyboard-arrow-right' color={"#000000"} size={28} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

});

export default OtpScreen