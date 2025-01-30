import {useCart} from './cart-context';
import {useRegion} from './region-context';
import {CheckoutStep} from '../types/checkout';

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

export const useCartQuantity = () => {
  const {cart} = useCart();

  const quantity = cart?.items?.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  return quantity || 0;
};

type Country = {
  label: string;
  value: string;
};

export const useCountries = (): Country[] => {
  const {region} = useRegion();

  return (
    region?.countries
      ?.map(country => ({
        label: country.display_name || country.iso_2,
        value: country.iso_2,
      }))
      .filter((country): country is Country =>
        Boolean(country.label && country.value),
      ) || []
  );
};

export const useCurrentCheckoutStep = (): CheckoutStep => {
  const {cart} = useCart();

  if (!cart?.shipping_address?.address_1 || !cart?.email) {
    return 'address';
  }
  if (!cart?.shipping_methods?.[0]?.shipping_option_id) {
    return 'delivery';
  }
  if (cart?.total === 0) {
    return 'payment';
  }
  return 'review';
};

export const useActivePaymentSession = () => {
  const {cart} = useCart();

  return cart?.payment_collection?.payment_sessions?.find(
    session => session.status === 'pending',
  );
};
