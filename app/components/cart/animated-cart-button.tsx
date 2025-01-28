import Button from '@components/common/button';
import Text from '@components/common/text';
import React, {useEffect} from 'react';
import Icon from '@react-native-vector-icons/ant-design';
import {View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useColors} from '@styles/hooks';
import {useCart} from '../../data/cart-context';
import {useProductQuantity} from '../../data/hooks';

type AnimatedCartButtonProps = {
  productId: string;
  selectedVariantId?: string;
  disabled?: boolean;
  inStock?: boolean;
};

const AnimatedCartButton = ({
  productId,
  selectedVariantId,
  disabled = false,
  inStock,
}: AnimatedCartButtonProps) => {
  const {addToCart} = useCart();
  const [adding, setAdding] = React.useState(false);
  const productQuantityInCart = useProductQuantity(productId);
  const showViewCart = useSharedValue(productQuantityInCart > 0);
  const viewCartWidth = 192;

  useEffect(() => {
    if (productQuantityInCart > 0) {
      showViewCart.value = true;
    }
  }, [productQuantityInCart, showViewCart]);

  const rowStyles = useAnimatedStyle(() => {
    return {
      gap: withTiming(showViewCart.value ? 8 : 0),
    };
  });

  const viewCartStyles = useAnimatedStyle(() => {
    return {
      width: withTiming(showViewCart.value ? viewCartWidth : 0),
      opacity: withTiming(showViewCart.value ? 1 : 0),
    };
  });

  const addToCartHandler = async () => {
    if (!selectedVariantId || disabled || !inStock) {
      return;
    }
    setAdding(true);
    await addToCart(selectedVariantId, 1);
    setAdding(false);
  };

  return (
    <Animated.View className="p-4 flex-row" style={[rowStyles]}>
      <Animated.View style={[viewCartStyles]}>
        <ViewCart quantity={productQuantityInCart} />
      </Animated.View>
      <View className="flex-1">
        <Button
          title={selectedVariantId && !inStock ? 'Out of stock' : 'Add to cart'}
          onClick={addToCartHandler}
          disabled={disabled}
          loading={adding}
        />
      </View>
    </Animated.View>
  );
};

const ViewCart = ({quantity}: {quantity: number}) => {
  const colors = useColors();
  return (
    <Button variant="secondary" disabled={quantity === 0}>
      <View>
        <View className="flex-row gap-1 items-center">
          <Icon name="shopping-cart" size={18} color={colors.content} />
          <Text className="text-content font-content-bold" numberOfLines={1}>
            View cart
          </Text>
          <Badge quantity={quantity} />
        </View>
      </View>
    </Button>
  );
};

const Badge = ({quantity}: {quantity: number}) => {
  const colors = useColors();
  return (
    <View
      className="w-5 h-5 bg-primary rounded-full justify-center items-center"
      style={{backgroundColor: colors.primary}}>
      <Text className="text-sm text-content-inverse font-content-bold">
        {quantity}
      </Text>
    </View>
  );
};

export default AnimatedCartButton;
