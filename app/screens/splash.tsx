import React from 'react';
import {StatusBar, Text, View} from 'react-native';

const Splash = () => {
  return (
    <>
      <StatusBar
        barStyle="default"
        translucent={true}
        backgroundColor="transparent"
      />
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="font-display text-white text-5xl text-center">
          MEDUSA{'\n'}NATIVE
        </Text>
      </View>
    </>
  );
};

export default Splash;
