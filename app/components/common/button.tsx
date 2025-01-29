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
      primary: 'text-content-inverse',
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
  onClick?: () => void;
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
  onClick,
  loading,
  disabled,
  variant,
  children,
}: Props) => {
  const colors = useColors();
  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="small" color={colors.contentInverse} />;
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
      onPress={loading ? () => {} : onClick}
      disabled={disabled || loading}
      className={button({disabled, variant})}>
      {renderContent()}
    </TouchableOpacity>
  );
};

export default CommonButton;
