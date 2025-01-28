import {useCart} from './cart-context';

export const useProductQuantity = (productId: string) => {
  const {cart} = useCart();

  const quantity = cart?.items?.reduce((acc, item) => {
    if (item.product_id === productId) {
      return acc + item.quantity;
    }
    return acc;
  }, 0);

  return quantity || 0;
};

export const useVariantQuantity = (variantId: string) => {
  const {cart} = useCart();

  const quantity = cart?.items?.reduce((acc, item) => {
    if (item.variant_id === variantId) {
      return acc + item.quantity;
    }
    return acc;
  }, 0);

  return quantity || 0;
};
