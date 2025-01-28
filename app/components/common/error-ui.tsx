import React from 'react';
import {View} from 'react-native';
import Text from '@components/common/text';

const ErrorUI = () => {
  return (
    <View className="p-4">
      <Text className="text-center">
        Something went wrong, Please try again later
      </Text>
    </View>
  );
};

export default ErrorUI;
