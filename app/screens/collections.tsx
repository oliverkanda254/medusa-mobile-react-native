import React from 'react';
import {View, Text} from 'react-native';
import Navbar from '@components/common/navbar';

export default function Collections() {
  return (
    <View className="flex-1 bg-background">
      <Navbar title="Collections" showBackButton={false} />
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-gray-900">Collections Screen</Text>
      </View>
    </View>
  );
}
