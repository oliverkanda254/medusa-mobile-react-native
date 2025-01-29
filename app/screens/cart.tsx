import React from 'react';
import LineItemUnitPrice from '@components/cart/line-item-price';
import LineItemQuantity from '@components/cart/line-item-quantity';
import Navbar from '@components/common/navbar';
import Text from '@components/common/text';
import {useCart} from '@data/cart-context';
import {HttpTypes, StoreCart} from '@medusajs/types';
import {convertToLocale} from '@utils/product-price';
import {Image, ScrollView, View} from 'react-native';
import Button from '@components/common/button';
import {useNavigation} from '@react-navigation/native';

const Cart = () => {
  const {cart} = useCart();
  const isEmptyCart = !cart?.items || cart.items.length === 0;

  const navigation = useNavigation();

  //   const goToCheckout = () => {
  //     navigation.navigate('Checkout');
  //   };

  const goHome = () => {
    navigation.navigate('Home');
  };
  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <Navbar title="Cart" />
        {!isEmptyCart ? (
          <View className="p-4">
            <CartItems cart={cart} />
            <View className="mt-4">
              <CartSummary cart={cart} />
            </View>
          </View>
        ) : (
          <EmptyCart />
        )}
      </ScrollView>
      <View className="p-4">
        {!isEmptyCart ? (
          <Button title="Checkout" />
        ) : (
          <Button title="Go Home" onClick={goHome} />
        )}
      </View>
    </View>
  );
};

const CartItems = ({cart}: {cart?: StoreCart}) => {
  return (
    <View>
      {cart?.items?.map(item => (
        <CartItem key={item.id} item={item} currencyCode={cart.currency_code} />
      ))}
    </View>
  );
};

type CartItemProps = {
  item: HttpTypes.StoreCartLineItem;
  currencyCode: string;
};

const CartItem = ({item, currencyCode}: CartItemProps) => {
  return (
    <View className="flex flex-row gap-2 p-2 mb-2 bg-gray-100 rounded-lg items-center">
      <Image source={{uri: item.thumbnail}} className="w-20 h-20" />
      <View className="flex-1">
        <Text className="text-base font-content-bold">
          {item.product_title}
        </Text>
        {!!item.variant_title && (
          <Text className="text-base opacity-80">
            Variant: {item.variant_title}
          </Text>
        )}
        <View className="mt-2 flex-1 flex-row justify-between">
          <LineItemQuantity quantity={item.quantity} lineItemId={item.id} />
          <LineItemUnitPrice item={item} currencyCode={currencyCode} />
        </View>
      </View>
    </View>
  );
};

const EmptyCart = () => {
  return (
    <View className="px-8 mt-20">
      <Text className="text-lg text-center">
        You don't have anything in your cart. Let's change that, use the link
        below to start browsing our products.
      </Text>
    </View>
  );
};

type SummaryItem = {
  name: string;
  key: keyof StoreCart;
};

const CartSummary = ({cart}: {cart?: StoreCart}) => {
  if (!cart) {
    return null;
  }
  const summaryItems: SummaryItem[] = [
    {
      name: 'Subtotal',
      key: 'subtotal',
    },
    {
      name: 'Shipping',
      key: 'shipping_total',
    },
    {
      name: 'Taxes',
      key: 'tax_total',
    },
  ];
  return (
    <View>
      <Text className="text-2xl mb-4">Summary</Text>
      <View className="border-t border-gray-300 py-4">
        {summaryItems.map(item => (
          <View
            className="flex-row justify-between items-center"
            key={item.key}>
            <Text className="opacity-80">{item.name}</Text>
            <Text className="text-base">
              {convertToLocale({
                amount: cart[item.key] as number,
                currency_code: cart.currency_code,
              })}
            </Text>
          </View>
        ))}
      </View>
      <View className="border-t border-b border-gray-300 py-4">
        <View className="flex-row justify-between items-center">
          <Text className="opacity-80">Total</Text>
          <Text className="text-lg font-content-bold">
            {convertToLocale({
              amount: cart.total,
              currency_code: cart.currency_code,
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Cart;
