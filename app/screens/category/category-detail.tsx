import React from 'react';
import {View} from 'react-native';
import Navbar from '@components/common/navbar';
import ProductsList from '@components/product/product-list';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import apiClient from '@api/client';
import {useQuery} from '@tanstack/react-query';

type CategoryDetailRouteParams = {
  route: {
    params: {
      categoryId: string;
    };
  };
};

export default function CategoryDetail({route}: CategoryDetailRouteParams) {
  const {categoryId} = route.params;

  const {data, isPending, error} = useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => apiClient.store.category.retrieve(categoryId),
  });

  if (isPending) {
    return <Loader />;
  }

  if (error || !data?.product_category) {
    return <ErrorUI />;
  }

  const category = data.product_category;

  return (
    <View className="flex-1 bg-background p-safe">
      <Navbar title={category.name} />
      <View className="flex-1 mt-4">
        <ProductsList
          queryKey={['products', 'category', category.id]}
          additionalParams={{
            category_id: category.id,
          }}
          hideTitle
        />
      </View>
    </View>
  );
}
