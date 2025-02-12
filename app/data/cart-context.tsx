import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {HttpTypes} from '@medusajs/types';
import {useRegion} from './region-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@api/client';

const CART_KEY = 'cart_id';

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
  region_id: string;
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
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: (code: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

type CartProviderProps = {
  children: React.ReactNode;
};

export const CartProvider = ({children}: CartProviderProps) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart>();
  const {region} = useRegion();

  const additionalFields = '+shipping_methods.name';

  const resetCart = async () => {
    await AsyncStorage.removeItem(CART_KEY);
    setCart(undefined);
  };

  const updateCart = useCallback(
    async (data: CartUpdateData) => {
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
    },
    [cart?.id],
  );

  const updateCartRegion = useCallback(
    async (regionId: string) => {
      try {
        await updateCart({
          region_id: regionId,
        });
      } catch (err) {
        console.log('Failed to update cart region:', err);
        // If updating region fails, fallback to reset
        resetCart();
      }
    },
    [updateCart],
  );

  useEffect(() => {
    // Don't do anything if region is not set
    if (!region) {
      return;
    }

    // If cart exists, check if region matches, if not update the cart region
    if (cart) {
      if (cart.region_id !== region.id) {
        updateCartRegion(region.id);
      }
      return;
    }

    // No cart exists, try to restore from storage or create new one
    AsyncStorage.getItem(CART_KEY).then(cartId => {
      if (!cartId) {
        // create a cart
        apiClient.store.cart
          .create({region_id: region.id})
          .then(async ({cart: dataCart}) => {
            await AsyncStorage.setItem(CART_KEY, dataCart.id);
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
  }, [cart, region, updateCartRegion]);

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

  const setShippingMethod = async (shippingMethodId: string) => {
    const {cart: updatedCart} = await apiClient.store.cart.addShippingMethod(
      cart?.id || '',
      {
        option_id: shippingMethodId,
      },
      {
        fields: additionalFields,
      },
    );
    setCart(updatedCart);
    return updatedCart;
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!cart?.id) {
      throw new Error('No cart found');
    }

    try {
      const existingCodes =
        cart.promotions
          ?.filter(p => !p.is_automatic && p.code)
          .map(p => p.code!) || [];

      const {cart: updatedCart} = await apiClient.store.cart.update(cart.id, {
        promo_codes: [...existingCodes, code],
      });
      setCart(updatedCart);
      // check if updatedCart has the promo code
      const updatedCartPromoCodes = updatedCart.promotions
        ?.filter(p => p.code)
        .map(p => p.code);
      if (updatedCartPromoCodes?.includes(code)) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const removePromoCode = async (code: string) => {
    if (!cart?.id) {
      throw new Error('No cart found');
    }

    try {
      const existingCodes =
        cart.promotions
          ?.filter(p => !p.is_automatic && p.code !== code)
          .map(p => p.code!) || [];

      const {cart: updatedCart} = await apiClient.store.cart.update(cart.id, {
        promo_codes: existingCodes,
      });
      setCart(updatedCart);
    } catch (err) {
      throw err;
    }
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
        applyPromoCode,
        removePromoCode,
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
