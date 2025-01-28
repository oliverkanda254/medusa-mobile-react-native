import React, {PropsWithChildren} from 'react';
import {useNavigation, type StaticScreenProps} from '@react-navigation/native';
import {TouchableOpacity, View} from 'react-native';
import AnimatedCartButton from '@components/cart/animated-cart-button';
import apiClient from '@api/client';
import {useQuery} from '@tanstack/react-query';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import ImageCarousel from '@components/product/image-carousel';
import Icon from '@react-native-vector-icons/ant-design';
import {ScrollView} from 'react-native-gesture-handler';
import Text from '@components/common/text';
import ProductPrice from '@components/product/product-price';

type Props = StaticScreenProps<{
  productId: string;
}>;

function ProductScreen({route}: Props) {
  const {productId} = route.params;
  const {data, error, isPending} = useQuery({
    queryKey: ['product', productId],
    queryFn: () =>
      apiClient.store.product.retrieve(productId, {
        region_id: 'reg_01JF9V7C1KZ7A46B4ZJ4KT5M70',
      }),
  });

  if (isPending) {
    return <Loader />;
  } else if (error) {
    return <ErrorUI />;
  }

  const {product} = data;

  console.log(product);

  return (
    <View className="flex-1 bg-background-secondary">
      <ScrollView className="flex-1" contentContainerClassName="flex-1">
        <View>
          <ImageCarousel data={product.images ?? []} />
          <View className="absolute w-full">
            <Header />
          </View>
        </View>
        <View className="p-4 -mt-8">
          <View className="p-4 bg-background min-h-8 rounded-lg">
            <Text className="font-content-bold text-lg">{product.title}</Text>
            <ProductPrice product={product} />
            <Text className="text-base opacity-80 mt-2">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      <AnimatedCartButton productId={productId} />
    </View>
  );
}

const Header = () => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View className="flex-row justify-between items-center p-4">
      <RoundedButton onPress={goBack}>
        <Icon name="left" size={14} />
      </RoundedButton>
    </View>
  );
};

type RoundedButtonProps = {
  onPress?: () => void;
};

const RoundedButton = ({
  children,
  onPress,
}: PropsWithChildren<RoundedButtonProps>) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-background h-12 w-12 rounded-full items-center justify-center elevation-sm">
      {children}
    </TouchableOpacity>
  );
};

export default ProductScreen;
