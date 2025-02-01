import {useNavigation, StackActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import Text from '@components/common/text';

const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      // Temporary navigation to the home screen
      navigation.dispatch(StackActions.replace('Home'));
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
        <Text
          type="display"
          className="text-content-inverse text-5xl text-center">
          MEDUSA{'\n'}MOBILE
        </Text>
      </View>
    </>
  );
};

export default Splash;
