import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {HttpTypes} from '@medusajs/types';
import {useColors} from '@styles/hooks';
import Text from '@components/common/text';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import {getProductPrice} from '@utils/product-price';
import {formatImageUrl} from '@utils/image-url';
import PreviewPrice from '@components/product/preview-price';
import apiClient from '@api/client';

const LIMIT = 10;

type ProductListParams = {
  limit: number;
  offset: number;
  fields?: string;
  region_id?: string;
  category_id?: string;
  collection_id?: string;
};

type ProductListRes = {
  products: HttpTypes.StoreProduct[];
  count: number;
  offset: number;
  limit: number;
};

type ProductsListProps = {
  queryKey?: string[];
  additionalParams?: Partial<ProductListParams>;
};

export const ProductItem = ({product}: {product: HttpTypes.StoreProduct}) => {
  const {cheapestPrice} = getProductPrice({
    product,
  });
  const navigation = useNavigation();
  const navigateToProduct = () => {
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

const ProductsList = ({
  queryKey = ['products'],
  additionalParams = {},
}: ProductsListProps) => {
  const colors = useColors();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({pageParam}) => {
      const params: ProductListParams = {
        limit: LIMIT,
        offset: pageParam,
        fields: '*variants.calculated_price',
        region_id: 'reg_01JF9V7C1KZ7A46B4ZJ4KT5M70',
        ...additionalParams,
      };
      return apiClient.store.product.list(params);
    },
    getNextPageParam: (lastPage: ProductListRes, pages) => {
      if (lastPage.products.length < LIMIT) {
        return undefined;
      }
      return pages.length * LIMIT;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorUI />;
  }

  const products = data?.pages.flatMap(page => page.products) ?? [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <FlatList
      contentContainerClassName="gap-4 px-5 pb-10"
      columnWrapperClassName="gap-4"
      data={products}
      numColumns={2}
      renderItem={({item}) => <ProductItem product={item} />}
      keyExtractor={item => item.id ?? ''}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      refreshing={isRefetching}
      refreshControl={
        <RefreshControl
          colors={[colors.primary]}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      }
      onRefresh={refetch}
    />
  );
};

export default ProductsList;
