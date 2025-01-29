import React from 'react';
import {View, Text} from 'react-native';
import {convertToLocale} from '@utils/product-price';
import {HttpTypes} from '@medusajs/types';

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem;
  style?: 'default' | 'tight';
  currencyCode: string;
};

const LineItemUnitPrice = ({
  item,
  style = 'default',
  currencyCode,
}: LineItemUnitPriceProps) => {
  const {total, original_total, unit_price} = item;

  const hasReducedPrice = total < original_total;

  const percentage_diff = Math.round(
    ((original_total - total) / original_total) * 100,
  );

  return (
    <View className="flex flex-col justify-center h-full">
      {hasReducedPrice && (
        <>
          <Text className="text-content">
            {style === 'default' && (
              <Text className="text-content">Original: </Text>
            )}
            <Text
              className="line-through text-content"
              testID="product-unit-original-price">
              {convertToLocale({
                amount: original_total / item.quantity,
                currency_code: currencyCode,
              })}
            </Text>
          </Text>
          {style === 'default' && (
            <Text className="text-primary">-{percentage_diff}%</Text>
          )}
        </>
      )}
      <Text
        className={`text-base ${
          hasReducedPrice ? 'text-primary' : 'text-content'
        }`}>
        {convertToLocale({
          amount: unit_price * item.quantity,
          currency_code: currencyCode,
        })}
      </Text>
    </View>
  );
};

export default LineItemUnitPrice;
