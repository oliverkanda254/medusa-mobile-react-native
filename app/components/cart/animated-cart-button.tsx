import Button from '@components/common/button';
import Text from '@components/common/text';
import React from 'react';
import Icon from '@react-native-vector-icons/ant-design';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useColors} from '@styles/hooks';

const AnimatedCartButton = ({}: {productId: string}) => {
  const showViewCart = useSharedValue(false);
  const viewCartWidth = 192;

  const showViewCartButton = () => {
    showViewCart.value = !showViewCart.value;
  };

  const rowStyles = useAnimatedStyle(() => {
    return {
      gap: withTiming(showViewCart.value ? 8 : 0),
    };
  });

  const viewCartStyles = useAnimatedStyle(() => {
    return {
      width: withTiming(showViewCart.value ? viewCartWidth : 0),
    };
  });

  return (
    <Animated.View className="p-4 flex-row" style={[rowStyles]}>
      <Animated.View style={[viewCartStyles]}>
        <ViewCart />
      </Animated.View>
      <View className="flex-1">
        <Button title="Add to cart" onClick={showViewCartButton} />
      </View>
    </Animated.View>
  );
};

const ViewCart = () => {
  const colors = useColors();
  return (
    <Button>
      <View className="flex-row gap-1">
        <Icon name="shopping-cart" size={18} color={colors.contentInverse} />
        <Text
          className="text-content-inverse font-content-bold"
          numberOfLines={1}>
          View cart
        </Text>
      </View>
    </Button>
  );
};

export default AnimatedCartButton;
