import React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import Text from '@components/common/text';
import {HttpTypes} from '@medusajs/types';
import {tv} from 'tailwind-variants';

const optionButton = tv({
  base: 'border border-gray-200 h-10 rounded-lg py-2 px-6 flex-1 justify-center items-center',
  variants: {
    selected: {
      true: 'border-primary bg-primary',
      false: 'active:shadow-lg bg-background-secondary',
    },
  },
});

const optionButtonText = tv({
  base: 'text-base text-center',
  variants: {
    selected: {
      true: 'text-content-secondary',
      false: 'text-content',
    },
  },
});

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map(v => v.value);

  return (
    <View className="flex flex-col gap-y-3">
      <Text className="text-base">Select {title}</Text>
      <ScrollView horizontal={false} className="flex flex-row flex-wrap">
        <View className="flex flex-row flex-wrap gap-4">
          {filteredOptions.map(v => {
            return (
              <TouchableOpacity
                onPress={() => updateOption(option.id, v)}
                key={v}
                disabled={disabled}
                testID="option-button"
                className={optionButton({
                  selected: v === current,
                })}>
                <Text
                  className={optionButtonText({
                    selected: v === current,
                  })}>
                  {v}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default OptionSelect;
