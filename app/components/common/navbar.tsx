import React from 'react';
import {View} from 'react-native';
import RoundedButton from '@components/common/rounded-button';
import Icon from '@react-native-vector-icons/ant-design';
import {useNavigation} from '@react-navigation/native';
import Text from '@components/common/text';

type NavbarProps = {
  title?: string;
  showBackButton?: boolean;
};

const Navbar = ({title, showBackButton = true}: NavbarProps) => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View className="p-4 h-14 flex-row justify-between items-center">
      <View className="flex-1">
        {showBackButton ? (
          <RoundedButton onPress={goBack}>
            <Icon name="left" size={14} />
          </RoundedButton>
        ) : (
          <View />
        )}
      </View>
      <View className="flex-1 items-center">
        <Text className="font-content-bold text-xl">{title}</Text>
      </View>
      <View className="flex-1" />
    </View>
  );
};

export default Navbar;
