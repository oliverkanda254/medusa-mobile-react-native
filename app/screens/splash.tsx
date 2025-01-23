import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar, Text, View} from 'react-native';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      // Temporary navigation to the home screen
      navigation.navigate('Home');
    }, 500);
  }, [navigation]);
  return (
    <>
      <StatusBar
        barStyle="default"
        translucent={true}
        backgroundColor="transparent"
      />
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="font-display text-content-inverse text-5xl text-center">
          MEDUSA{'\n'}NATIVE
        </Text>
      </View>
    </>
  );
};

export default Splash;
