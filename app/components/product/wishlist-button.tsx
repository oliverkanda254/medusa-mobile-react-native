import React from 'react';
import MaterialIcon from '@react-native-vector-icons/material-design-icons';
import {TouchableOpacity} from 'react-native';
import {useColors} from '@styles/hooks';
import {StoreProduct} from '@medusajs/types';

type WishlistButtonProps = {
  product: StoreProduct;
  containerClassName?: string;
  iconColor?: string;
  bgColor?: string;
};

const WishlistButton = ({
  containerClassName,
  bgColor,
  iconColor,
}: WishlistButtonProps) => {
  const colors = useColors();
  const isWishlisted = false;
  return (
    <TouchableOpacity
      className={`w-8 h-8 rounded-full justify-center items-center ${containerClassName}`}
      style={{backgroundColor: bgColor ?? 'rgba(0,0,0,0.5)'}}>
      <MaterialIcon
        name={isWishlisted ? 'heart' : 'heart-outline'}
        size={14}
        color={iconColor ?? colors.contentSecondary}
      />
    </TouchableOpacity>
  );
};

export default WishlistButton;
