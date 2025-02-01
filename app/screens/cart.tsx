import React from 'react';
import Navbar from '@components/common/navbar';
import Text from '@components/common/text';
import {useCart} from '@data/cart-context';
import {ScrollView, View} from 'react-native';
import Button from '@components/common/button';
import {useNavigation} from '@react-navigation/native';
import CartContent from '@components/cart/cart-content';

const Cart = () => {
  const {cart} = useCart();
  const isEmptyCart = !cart?.items || cart.items.length === 0;

  const navigation = useNavigation();

  const goToCheckout = () => {
    navigation.navigate('Checkout');
  };

  const goHome = () => {
    navigation.navigate('Home');
  };
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <Navbar title="Cart" />
        <View className="p-4">
          {!isEmptyCart ? (
            <CartContent cart={cart} mode="cart" />
          ) : (
            <EmptyCart />
          )}
        </View>
      </ScrollView>
      <View className="p-4 bg-background-secondary">
        {!isEmptyCart ? (
          <Button title="Checkout" onPress={goToCheckout} />
        ) : (
          <Button title="Go Home" onPress={goHome} />
        )}
      </View>
    </View>
  );
};

const EmptyCart = () => {
  return (
    <View className="px-4 mt-20">
      <Text className="text-lg text-center">
        You don't have anything in your cart.{'\n'}Use the link below to start
        below to start browsing our products.
      </Text>
    </View>
  );
};

export default Cart;
