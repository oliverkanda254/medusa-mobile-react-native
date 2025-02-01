import React from 'react';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ThemeProvider from '@styles/theme-provider';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Splash from '@screens/splash';
import Home from '@screens/home';
import ProductDetail from '@screens/product-detail';
import Cart from '@screens/cart';
import Checkout from '@screens/checkout';
import Profile from '@screens/profile/profile';
import SignIn from '@screens/auth/sign-in';
import Register from '@screens/auth/register';
import Orders from '@screens/order/orders';
import OrderDetail from '@screens/order/order-detail';
import ProfileDetail from '@screens/profile/profile-detail';
import {CartProvider} from '@data/cart-context';
import {RegionProvider} from '@data/region-context';
import {CustomerProvider} from '@data/customer-context';
import AddressForm from '@screens/address/address-form';
import AddressList from '@screens/address/address-list';

import '@styles/global.css';

export type RootStackParamList = StaticParamList<typeof RootStack>;

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider name="default">
      <RegionProvider>
        <CartProvider>
          <CustomerProvider>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView>
                <Navigation />
              </GestureHandlerRootView>
            </QueryClientProvider>
          </CustomerProvider>
        </CartProvider>
      </RegionProvider>
    </ThemeProvider>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Splash: {
      screen: Splash,
      options: {
        headerShown: false,
      },
    },
    Home,
    ProductDetail,
    Cart,
    Checkout,
    Profile,
    SignIn,
    Register,
    Orders,
    OrderDetail,
    ProfileDetail,
    AddressList,
    AddressForm,
  },
});

const Navigation = createStaticNavigation(RootStack);
