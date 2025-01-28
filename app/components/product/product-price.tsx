import React from 'react';
import {View} from 'react-native';
import {getProductPrice} from '../../utils/product-price';
import {HttpTypes} from '@medusajs/types';
import Text from '@components/common/text';

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct;
  variant?: HttpTypes.StoreProductVariant;
}) {
  const {cheapestPrice, variantPrice} = getProductPrice({
    product,
    variantId: variant?.id,
  });

  const selectedPrice = variant ? variantPrice : cheapestPrice;

  if (!selectedPrice) {
    return <View className="w-32 h-9 bg-gray-100 animate-pulse" />;
  }

  return (
    <View className="flex flex-col">
      <Text
        className={
          selectedPrice.price_type === 'sale'
            ? 'text-primary font-medium text-xl'
            : ' font-medium text-xl'
        }>
        {!variant && 'From '}
        <Text
          testID="product-price"
          accessibilityValue={{
            text: selectedPrice.calculated_price_number.toString(),
          }}>
          {selectedPrice.calculated_price}
        </Text>
      </Text>

      {selectedPrice.price_type === 'sale' && (
        <>
          <Text className="text-gray-600">
            <Text>Original: </Text>
            <Text
              className="line-through"
              testID="original-product-price"
              accessibilityValue={{
                text: selectedPrice.original_price_number.toString(),
              }}>
              {selectedPrice.original_price}
            </Text>
          </Text>
          <Text className="text-primary">
            -{selectedPrice.percentage_diff}%
          </Text>
        </>
      )}
    </View>
  );
}
