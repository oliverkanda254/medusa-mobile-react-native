import React from 'react';
import {View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Navbar from '@components/common/navbar';
import ProductsList from '@components/product/product-list';
import Loader from '@components/common/loader';
import ErrorUI from '@components/common/error-ui';
import apiClient from '@api/client';

type CollectionDetailRouteParams = {
  route: {
    params: {
      collectionId: string;
    };
  };
};

export default function CollectionDetail({route}: CollectionDetailRouteParams) {
  const {collectionId} = route.params;

  const {data, isPending, error} = useQuery({
    queryKey: ['collection', collectionId],
    queryFn: () => apiClient.store.collection.retrieve(collectionId),
  });

  if (isPending) {
    return <Loader />;
  }

  if (error || !data?.collection) {
    return <ErrorUI />;
  }

  const collection = data.collection;

  return (
    <View className="flex-1 bg-background">
      <Navbar title={collection.title} />
      <View className="flex-1 mt-4">
        <ProductsList
          queryKey={['products', 'collection', collection.id]}
          additionalParams={{
            collection_id: collection.id,
          }}
        />
      </View>
    </View>
  );
}
