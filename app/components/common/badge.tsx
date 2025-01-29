import React from 'react';
import {View} from 'react-native';
import Text from '@components/common/text';
import {tv, type VariantProps} from 'tailwind-variants';

const badge = tv({
  base: 'w-5 h-5 rounded-full justify-center items-center',
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-background border border-gray-300',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

const badgeText = tv({
  base: 'text-xs font-content-bold',
  variants: {
    variant: {
      primary: 'text-content-inverse',
      secondary: 'text-content',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

type BadgeProps = VariantProps<typeof badge> & {
  quantity: number;
  className?: string;
};

const Badge = ({quantity, className, variant}: BadgeProps) => {
  return (
    <View className={badge({variant, className})}>
      <Text className={badgeText({variant})}>
        {quantity}
      </Text>
    </View>
  );
};

export default Badge;
