import React from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import Text from './text';
import {tv, type VariantProps} from 'tailwind-variants';
import {useColors} from '@styles/hooks';

const button = tv({
  base: 'justify-center items-center rounded-xl h-14',
  variants: {
    variant: {
      primary: 'bg-primary',
      secondary: 'bg-background border border-gray-300',
    },
    disabled: {
      true: 'bg-gray-300',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});

const buttonText = tv({
  base: 'font-content-bold block mx-4',
  variants: {
    disabled: {
      true: 'text-gray-400',
      false: '',
    },
    variant: {
      primary: 'text-content-secondary',
      secondary: 'text-content',
    },
  },
  defaultVariants: {
    variant: 'primary',
    disabled: false,
  },
});

type BaseProps = VariantProps<typeof button> & {
  className?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
};

type WithTitle = BaseProps & {
  title: string;
  children?: never;
};

type WithChildren = BaseProps & {
  title?: never;
  children: React.ReactNode;
};

type Props = WithTitle | WithChildren;

const CommonButton = ({
  title,
  onPress,
  loading,
  disabled,
  variant,
  children,
}: Props) => {
  const colors = useColors();
  const renderContent = () => {
    if (loading) {
      const color =
        variant === 'secondary' ? colors.content : colors.contentSecondary;
      return <ActivityIndicator size="small" color={color} />;
    }

    if (children) {
      return children;
    }
    return (
      <Text className={buttonText({disabled, variant})} numberOfLines={1}>
        {title}
      </Text>
    );
  };
  return (
    <TouchableOpacity
      onPress={loading ? () => {} : onPress}
      disabled={disabled || loading}
      className={button({disabled, variant})}>
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CommonButton;
