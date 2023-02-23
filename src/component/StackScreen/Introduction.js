import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '../ApiConfigs/baseUrl';


const Introduction = () => {

    const navigation = useNavigation();
    const [getQuotsData, setQuotsData] = useState("");
    const [loader, setLoader] = useState(true);


    useEffect(() => {
        getQuots();
        setInterval(() => {
            getQuots();
        }, 10000);
        // setInterValue(inter);
        // return () => clearInterval(inter);
    }, [])

    let currentCount = 0;

    const getQuots = async () => {
        await axios.get(baseUrl + "Product/GetRandomQuotes")
            .then((response) => {
                var data = response.data;
                if (data) {
                    setQuotsData(data);
                    setLoader(false);
                } else {
                    setLoader(true);
                }
            })
    }

    const gotoAuthScreen = () => {
        if (currentCount < 2) {
            currentCount += 1;
        } else {
            navigation.navigate("OtpScreen");
        }
    }
    return (
        <SafeAreaView>
            <LinearGradient colors={['#FFFFFF', '#F2FDFB']}>
                {
                    loader ? <View style={{ justifyContent: 'center', height: "100%", alignItems: "center" }}>
                        <ActivityIndicator size="large" />
                    </View>
                        :
                        <View style={{ justifyContent: "center", height: "100%", paddingLeft: "7%", alignSelf: "center", padding: "3%" }}>
                            <View style={{}}>
                                <Text style={{ fontSize: 34, fontFamily: "HelveticaNeue Medium", color: "#000000" }} adjustsFontSizeToFit={true}>{getQuotsData.quote}</Text>
                            </View>
                            <TouchableOpacity onPress={gotoAuthScreen} style={{ marginTop: "3%" }}>
                                <Text style={{ color: "#284B46", fontSize: 24, fontFamily: "Inter-Regular" }}>~ {getQuotsData.quoteBy}</Text>
                            </TouchableOpacity>
                        </View>
                }
            </LinearGradient>
        </SafeAreaView>
    )
}

export default Introduction