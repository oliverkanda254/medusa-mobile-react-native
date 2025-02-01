import React from 'react';
import Text from '@components/common/text';
import {View, Image, StatusBar, FlatList, TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/ant-design';
import {useColors, useTheme} from '@styles/hooks';
import apiClient from '@api/client';
import {useQuery} from '@tanstack/react-query';
import {getProductPrice} from '@utils/product-price';
import PreviewPrice from '@components/product/preview-price';
import {HttpTypes} from '@medusajs/types';
import {formatImageUrl} from '@utils/image-url';
import {useNavigation} from '@react-navigation/native';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import Header from '@components/home/header';

const Home = () => {
  const {name, setThemeName} = useTheme();
  const switchTheme = () => {
    setThemeName(name === 'default' ? 'vintage' : 'default');
  };
  const colors = useColors();
  return (
    <View className="bg-background flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View className="px-5">
        <Header />
      </View>
      <View className="flex-1 mt-4">
        <ProductsList />
      </View>
      <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          onPress={switchTheme}
          className="p-4 bg-primary rounded-full">
          <Icon className="" name="switcher" size={24} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ProductsList = () => {
  const {isPending, error, data} = useQuery({
    queryKey: ['products'],
    queryFn: () =>
      apiClient.store.product.list({
        fields: '*variants.calculated_price',
        region_id: 'reg_01JF9V7C1KZ7A46B4ZJ4KT5M70',
      }),
  });

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return <ErrorUI />;
  }

  return (
    <FlatList
      contentContainerClassName="gap-4 px-5 pb-10"
      columnWrapperClassName="gap-4"
      data={data.products}
      numColumns={2}
      renderItem={({item}) => <ProductItem product={item} />}
      keyExtractor={item => item.id ?? ''}
    />
  );
};

const ProductItem = ({product}: {product: HttpTypes.StoreProduct}) => {
  const {cheapestPrice} = getProductPrice({
    product,
  });
  const navigation = useNavigation();
  const navigateToProduct = () => {
    // Navigate to product
    navigation.navigate('ProductDetail', {productId: product.id});
  };
  return (
    <TouchableOpacity
      onPress={navigateToProduct}
      className="flex-1 max-w-[50%]">
      <View>
        <Image
          source={{uri: formatImageUrl(product.thumbnail)}}
          className="w-full h-48 rounded-2xl"
          resizeMode="cover"
        />
        <Text className="text-lg font-content-bold">{product.title}</Text>
        {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
      </View>
    </TouchableOpacity>
  );
};

export default Home;
