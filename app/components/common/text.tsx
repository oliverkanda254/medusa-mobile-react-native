import React, {PropsWithChildren} from 'react';
import {Text} from 'react-native';
import {tv, type VariantProps} from 'tailwind-variants';

const text = tv({
  variants: {
    type: {
      display: 'text-display font-display',
      content: 'text-content font-content',
    },
  },
  defaultVariants: {
    type: 'content',
  },
});

type TextProps = VariantProps<typeof text> & {
  className?: string;
};

const CommonText = ({
  type,
  className,
  children,
}: PropsWithChildren<TextProps>) => {
  return (
    <Text
      className={text({
        type,
        className,
      })}>
      {children}
    </Text>
  );
};

export default CommonText;
