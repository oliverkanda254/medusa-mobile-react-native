import React from 'react';
import RoundedButton from '@components/common/rounded-button';
import {useCartQuantity, useLoggedIn} from '@data/hooks';
import Icon from '@react-native-vector-icons/ant-design';
import {TabActions, useNavigation} from '@react-navigation/native';
import {useColors} from '@styles/hooks';
import {TouchableOpacity, View} from 'react-native';
import Text from '@components/common/text';
import Badge from '@components/common/badge';

const Header = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const loggedIn = useLoggedIn();
  return (
    <View className="flex-row h-14 justify-between items-center">
      <RoundedButton
        onPress={() => {
          if (loggedIn) {
            navigation.dispatch(TabActions.jumpTo('Profile'));
          } else {
            navigation.navigate('SignIn');
          }
        }}>
        <Icon name="user" size={18} color={colors.primary} />
      </RoundedButton>
      <Text type="display" className="text-content">
        M-Store
      </Text>
      <CartButton />
    </View>
  );
};

const CartButton = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const itemCount = useCartQuantity();
  const navigateToCart = () => {
    navigation.navigate('Cart');
  };
  return (
    <TouchableOpacity
      onPress={navigateToCart}
      className="w-12 h-12 justify-center items-center bg-primary rounded-full elevation-sm">
      <View>
        <Icon name="shopping-cart" size={18} color={colors.contentInverse} />
        {itemCount > 0 && (
          <View className="absolute -top-2 -right-3">
            <Badge variant="secondary" quantity={itemCount} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Header;
