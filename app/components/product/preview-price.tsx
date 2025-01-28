import React from 'react';
import Text from '@components/common/text';
import {VariantPrice} from 'types/global';

export default function PreviewPrice({price}: {price: VariantPrice}) {
  if (!price) {
    return null;
  }

  return (
    <>
      {price.price_type === 'sale' && (
        <Text className="line-through">{price.original_price}</Text>
      )}
      <Text>{price.calculated_price}</Text>
    </>
  );
}
