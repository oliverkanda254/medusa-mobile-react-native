import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';

const Card = ({children}: PropsWithChildren) => {
  return (
    <View className="p-4 bg-background rounded-lg elevation-lg">
      {children}
    </View>
  );
};

export default Card;
