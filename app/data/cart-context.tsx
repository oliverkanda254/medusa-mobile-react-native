import React, {createContext, useContext, useEffect, useState} from 'react';
import {HttpTypes} from '@medusajs/types';
import {useRegion} from './region-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@api/client';

type AddressFields = {
  first_name: string;
  last_name: string;
  address_1: string;
  company?: string;
  postal_code: string;
  city: string;
  country_code: string;
  province?: string;
  phone: string;
};

type CartUpdateData = Partial<{
  email: string;
  shipping_address: AddressFields;
  billing_address: AddressFields;
}>;

type CartContextType = {
  cart?: HttpTypes.StoreCart;
  setCart: React.Dispatch<
    React.SetStateAction<HttpTypes.StoreCart | undefined>
  >;
  resetCart: () => Promise<void>;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  updateLineItem: (lineItemId: string, quantity: number) => Promise<void>;
  updateCart: (data: CartUpdateData) => Promise<HttpTypes.StoreCart>;
  linkCartToCustomer: () => Promise<void>;
  setShippingMethod: (shippingMethodId: string) => Promise<HttpTypes.StoreCart>;
};

const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({children}: CartProviderProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const {region} = useRegion();

  const additionalFields = '+shipping_methods.name';

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
        fetchCart(cartId);
      }
    });
  }, [cart, region]);

  const resetCart = async () => {
    await AsyncStorage.removeItem('cart_id');
    setCart(undefined);
  };

  const fetchCart = async (cartId: string) => {
    return apiClient.store.cart
      .retrieve(cartId, {
        fields: additionalFields,
      })
      .then(({cart: dataCart}) => {
        setCart(dataCart);
      });
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

  const updateLineItem = async (lineItemId: string, quantity: number) => {
    if (!cart) {
      return;
    }

    try {
      if (quantity === 0) {
        await apiClient.store.cart.deleteLineItem(cart.id, lineItemId);
        await fetchCart(cart.id);
      } else {
        const {cart: dataCart} = await apiClient.store.cart.updateLineItem(
          cart.id,
          lineItemId,
          {
            quantity,
          },
        );
        setCart(dataCart);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const linkCartToCustomer = async () => {
    const {cart: dataCart} = await apiClient.store.cart.transferCart(
      cart?.id || '',
    );
    setCart(dataCart);
  };

  const updateCart = async (data: CartUpdateData) => {
    if (!cart?.id) {
      throw new Error('No cart found');
    }

    const {cart: updatedCart} = await apiClient.store.cart.update(
      cart.id,
      data,
      {
        fields: additionalFields,
      },
    );
    setCart(updatedCart);
    return updatedCart;
  };

  const setShippingMethod = async (shippingMethodId: string) => {
    const {cart: updatedCart} = await apiClient.store.cart.addShippingMethod(
      cart?.id || '',
      {
        option_id: shippingMethodId,
      },
    );
    setCart(updatedCart);
    return updatedCart;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        resetCart,
        addToCart,
        updateLineItem,
        updateCart,
        linkCartToCustomer,
        setShippingMethod,
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

// Export types for reuse in other components
export type {AddressFields, CartUpdateData};
