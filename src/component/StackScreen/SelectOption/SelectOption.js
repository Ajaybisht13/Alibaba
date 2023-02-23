import { View, Text, TouchableOpacity, SafeAreaView, Image, BackHandler } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNExitApp from 'react-native-exit-app';

const SelectOption = ({ route }) => {

    const { status } = route.params;

    const [statusValue, setStatusValue] = useState();
    const [roleValue, setRoleIdValue] = useState();

    const navigation = useNavigation();


    useEffect(() => {
        setStatusValue(status);
        getToken();
        BackHandler.addEventListener("hardwareBackPress", backAction);
        const gestureEndListener = () => {
            console.log('iOS back gesture ended');
            RNExitApp.exitApp();
        };

        // You can also use the 'gestureStart' or 'gestureCancel' events
        navigation.addListener('gestureEnd', gestureEndListener);

        return () => {
            navigation.removeListener('gestureEnd', gestureEndListener);
            BackHandler.removeEventListener("hardwareBackPress", backAction);
        }

    }, [])

    // useEffect(() => {
    //     const gestureEndListener = () => {
    //       console.log('iOS back gesture ended');
    //       RNExitApp.exitApp();
    //     };

    //     // You can also use the 'gestureStart' or 'gestureCancel' events
    //     navigation.addListener('gestureEnd', gestureEndListener);

    //     return () => {
    //       navigation.removeListener('gestureEnd', gestureEndListener);
    //     };
    //   }, []);

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    };

    const getToken = async () => {
        const roleId = await AsyncStorage.getItem("roleId");
        setRoleIdValue(roleId);
        console.log("roleId", roleId);
    }

    const selectAlibaba = async () => {
        let filterType = 0;
        await AsyncStorage.setItem('Ali', filterType.toString());
        if (roleValue == 4) {
            navigation.navigate("Product");
        } else {
            navigation.navigate("Product");
        }
    }

    const selectAliExpress = async () => {
        let filterType = 1;
        await AsyncStorage.setItem('Ali', filterType.toString());
        navigation.navigate("Product");
    }

    return (
        <SafeAreaView>
            <View style={{ display: "flex", justifyContent: "center", alignSelf: "center", height: "100%" }}>
                <View>
                    <TouchableOpacity style={{ height: 50, width: 200, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "2%" }}
                        onPress={() => selectAlibaba()}
                    >
                        <Image
                            source={{ uri: "https://s.alicdn.com/@img/tfs/TB1pDDmmF67gK0jSZPfXXahhFXa-2814-380.png" }}
                            style={{ height: "100%", width: "80%" }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={{ alignSelf: "center", marginTop: "10%" }}>
                        <Text>OR</Text>
                    </View>
                    <View style={{ height: 50, width: 200, borderColor: "#284B46", borderWidth: 1, borderRadius: 60, justifyContent: "center", alignItems: "center", marginTop: "10%" }}
                        onPress={() => selectAliExpress()}
                    >
                        <Image
                            source={{ uri: "http://jiffygifts.com:8000/static/master/assets/images/users/AliExpress-logo-500x281.png" }}
                            style={{ height: 70, width: "100%" }}
                            resizeMode="contain"
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SelectOption