import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../SplashScreen/SplashScreen';
import Introduction from '../StackScreen/Introduction';
import Product from '../StackScreen/Product/Product';
import Header from '../CustomHeader/Header';
import CustomDrawer from '../CustomDrawer/CustomDrawer';
import WishList from '../DrawerScreen/WishList/WishList';
import WishListHeader from '../DrawerScreen/WishList/WishListHeader';
import ShortListed from '../DrawerScreen/ShortListedList/ShortListed';
import ShortListedHeader from '../DrawerScreen/ShortListedList/ShortListedHeader';
import OtpScreen from '../StackScreen/AuthScreen/OtpScreen';
import SelectOption from '../StackScreen/SelectOption/SelectOption';
import GridView from '../GridView/GridView';
import Filter from '../StackScreen/Filter/Filter';
import Approved from '../DrawerScreen/ShortListedList/Approved';


import AdminProduct from '../Admin/AdminProduct';
import AdminShortListed from '../Admin/AdminShortListed';
import AdminWishList from '../Admin/AdminWishList';
import AdminWishListGrid from '../Admin/AdminWishListGrid';
import AdminFilter from '../Admin/AdminFilter';


const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();
const WishListDrawer = createDrawerNavigator();
const WishListGridDrawer = createDrawerNavigator();
const ShortListDrawer = createDrawerNavigator();


const AdminDrawer = createDrawerNavigator();
const AdminWishListDrawer = createDrawerNavigator();
const AdminWishListGridDrawer = createDrawerNavigator();
const AdminShortListDrawer = createDrawerNavigator();
const AdminApprovedDrawer = createDrawerNavigator();

export function Navigation() {

    // const { filterId } = route.params;
    // console.log(filterId);

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="SplashScreen" component={SplashScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen name="Introduction" component={Introduction}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="OtpScreen" component={OtpScreen}
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="SelectOption" component={SelectOption}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen name="Product" component={ProductNavigator}
                    options={{
                        // header: (props) => <Header {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="WishList" component={WishListDrawerNavigator}
                    options={{
                        // header: (props) => <WishListHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="GridView" component={WishListGridDrawerNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="ShortListed" component={ShortListDrawerNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="AdminProduct" component={AdminProductNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="AdminWishList" component={AdminWishListNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="AdminShortListed" component={AdminShortListNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="AdminWishListGrid" component={AdminGridNavigator}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="Approved" component={ApprovedDrawerNavigator}
                    options={{
                        headerShown: false
                    }}
                />
                 <Stack.Screen name="Filter" component={Filter}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
                <Stack.Screen name="AdminFilter" component={AdminFilter}
                    options={{
                        // header: (props) => <ShortListedHeader {...props} />
                        headerShown: false
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

function ProductNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name="Product" component={Product}
                options={{
                    headerShown: false,
                }}
            />
        </Drawer.Navigator>
    );
}

function WishListDrawerNavigator() {
    return (
        <WishListDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <WishListDrawer.Screen name="WishList" component={WishList}
                options={{
                    headerShown: false,
                }}
            />
        </WishListDrawer.Navigator>
    );
}

function WishListGridDrawerNavigator() {
    return (
        <WishListGridDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <WishListGridDrawer.Screen name="GridView" component={GridView}
                options={{
                    headerShown: false,
                }}
            />
        </WishListGridDrawer.Navigator>
    );
}

function ShortListDrawerNavigator() {
    return (
        <ShortListDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <ShortListDrawer.Screen name="ShortListed" component={ShortListed}
                options={{
                    headerShown: false,
                }}
            />
        </ShortListDrawer.Navigator>
    );
}

function AdminProductNavigator() {
    return (
        <AdminDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <AdminDrawer.Screen name="AdminProduct" component={AdminProduct}
                options={{
                    headerShown: false,
                }}
            />
        </AdminDrawer.Navigator>
    );
}

function AdminWishListNavigator() {
    return (
        <AdminWishListDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <AdminWishListDrawer.Screen name="AdminWishList" component={AdminWishList}
                options={{
                    headerShown: false,
                }}
            />
        </AdminWishListDrawer.Navigator>
    );
}

function AdminGridNavigator() {
    return (
        <AdminWishListGridDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <AdminWishListGridDrawer.Screen name="AdminWishListGrid" component={AdminWishListGrid}
                options={{
                    headerShown: false,
                }}
            />
        </AdminWishListGridDrawer.Navigator>
    );
}

function AdminShortListNavigator() {
    return (
        <AdminWishListGridDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <AdminWishListGridDrawer.Screen name="AdminShortListed" component={AdminShortListed}
                options={{
                    headerShown: false,
                }}
            />
        </AdminWishListGridDrawer.Navigator>
    );
}

function ApprovedDrawerNavigator() {
    return (
        <AdminApprovedDrawer.Navigator
            screenOptions={{
                drawerPosition: 'right',
                drawerStyle: {
                    width: 100,
                },
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <AdminApprovedDrawer.Screen name="Approved" component={Approved}
                options={{
                    headerShown: false,
                }}
            />
        </AdminApprovedDrawer.Navigator>
    );
}