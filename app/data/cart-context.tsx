import React, {createContext, useContext, useEffect, useState} from 'react';
import {HttpTypes} from '@medusajs/types';
import {useRegion} from './region-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@api/client';

type CartContextType = {
  cart?: HttpTypes.StoreCart;
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >;
  refreshCart: () => void;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({children}: CartProviderProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const {region} = useRegion();

  useEffect(() => {
    if (cart || !region) {
      return;
    }

    AsyncStorage.getItem('cart_id').then(cartId => {
      if (!cartId) {
        // create a cart
        apiClient.store.cart
          .create({region_id: region.id})
          .then(async ({cart: dataCart}) => {
            await AsyncStorage.setItem('cart_id', dataCart.id);
            setCart(dataCart);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // retrieve cart
        apiClient.store.cart.retrieve(cartId).then(({cart: dataCart}) => {
          setCart(dataCart);
        });
      }
    });
  }, [cart, region]);

  const refreshCart = async () => {
    await AsyncStorage.removeItem('cart_id');
    setCart(undefined);
  };

  const addToCart = async (variantId: string, quantity: number) => {
    if (!cart) {
      return;
    }

    try {
      const {cart: dataCart} = await apiClient.store.cart.createLineItem(
        cart.id,
        {
          variant_id: variantId,
          quantity,
        },
      );
      setCart(dataCart);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        refreshCart,
        addToCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
