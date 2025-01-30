import React from 'react';
import {View} from 'react-native';
import Text from '@components/common/text';
import {HttpTypes} from '@medusajs/types';
import CartContent from '@components/cart/cart-content';
import {PAYMENT_PROVIDER_DETAILS_MAP} from '../../../types/checkout';

type ReviewStepProps = {
  cart: HttpTypes.StoreCart;
};

const ReviewStep = ({cart}: ReviewStepProps) => {
  // Find the selected shipping option
  const selectedShippingMethod = cart.shipping_methods?.at(-1);

  const selectedPaymentMethodId =
    cart.payment_collection?.payment_sessions?.find(
      (paymentSession: any) => paymentSession.status === 'pending',
    )?.provider_id || '';

  return (
    <View>
      <CartContent cart={cart} mode="checkout" />
      <View className="mt-6 space-y-4">
        {/* Selected Shipping Method */}
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="font-content-bold mb-2">Shipping Method</Text>
          <Text className="text-gray-700">
            {selectedShippingMethod?.name ||
              selectedShippingMethod?.id ||
              'No shipping method selected'}
          </Text>
        </View>

        {/* Selected Payment Method */}
        <View className="p-4 bg-gray-50 rounded-lg">
          <Text className="font-content-bold mb-2">Payment Method</Text>
          <Text className="text-gray-700">
            {selectedPaymentMethodId
              ? PAYMENT_PROVIDER_DETAILS_MAP[selectedPaymentMethodId]?.name ||
                selectedPaymentMethodId
              : 'No payment method selected'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewStep;
