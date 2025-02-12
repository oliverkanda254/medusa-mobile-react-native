import React, {useTransition} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import Text from '@components/common/text';
import {useColors} from '@styles/hooks';
import Icon from '@react-native-vector-icons/ant-design';
import {HttpTypes} from '@medusajs/types';
import {useRegion} from '@data/region-context';
import {useNavigation} from '@react-navigation/native';
import Loader from '@components/common/loader';
import apiClient from '@api/client';
import {useQuery} from '@tanstack/react-query';
import ErrorUI from '@components/common/error-ui';
import Navbar from '@components/common/navbar';

const RegionSelect = () => {
  const colors = useColors();
  const {region, setRegion} = useRegion();
  const [_, startTransition] = useTransition();
  const navigation = useNavigation();

  const onSelect = (selectedRegion: HttpTypes.StoreRegion) => {
    if (selectedRegion.id !== region?.id) {
      startTransition(() => {
        setRegion(selectedRegion);
      });
    }
    navigation.goBack();
  };

  const {data, isLoading, error} = useQuery({
    queryKey: ['regions'],
    queryFn: () => apiClient.store.region.list(),
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !data?.regions) {
    return <ErrorUI />;
  }

  const renderItem = ({item}: {item: HttpTypes.StoreRegion}) => (
    <TouchableOpacity
      onPress={() => onSelect(item)}
      className="flex-row items-center justify-between p-4 border-b border-gray-200">
      <View className="flex-1">
        <Text className="text-base font-medium">{item.name}</Text>
        <Text className="text-sm opacity-70">
          {item.currency_code.toUpperCase()}
        </Text>
      </View>
      {region?.id === item.id && (
        <Icon name="check" size={20} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background">
      <Navbar title="Select Region" />
      <FlatList
        data={data.regions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default RegionSelect;
