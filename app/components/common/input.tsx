import React from 'react';
import {TextInput, TextInputProps, View} from 'react-native';
import Text from './text';

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
};

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      required,
      containerClassName = '',
      className = '',
      onChangeText,
      ...props
    },
    ref,
  ) => {
    return (
      <View className={`mb-4 ${containerClassName}`}>
        {label && (
          <Text className="text-base mb-2">
            {label}
            {required && '*'}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={`border border-gray-300 rounded-lg p-4 text-base ${
            error ? 'border-red-500' : ''
          } ${className}`}
          onChangeText={text => {
            onChangeText?.(text);
          }}
          {...props}
        />
        {error ? <Text className="text-red-500 mt-2">{error}</Text> : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
