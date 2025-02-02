import {formatImageUrl} from '@utils/image-url';
import {cssInterop} from 'nativewind';
import React from 'react';
import {Dimensions, Image, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;

type HeroCarouselItem = {
  type: 'product' | 'category' | 'collection';
  entityId: string;
  imageUrl: string;
};

const PagiationTw = cssInterop(Pagination.Basic, {
  containerClassName: 'containerStyle',
  dotClassName: 'dotStyle',
  activeDotClassName: 'activeDotStyle',
});

const HeroCarousel = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const navigation = useNavigation();
  const enableNavigation = false;

  const {data} = useQuery<HeroCarouselItem[]>({
    queryKey: ['hero-carousel'],
    queryFn: async () => {
      const response = await fetch(
        'https://dummyjson.com/c/9fd9-bd11-4526-8405',
      );
      return response.json();
    },
  });

  if (!data || data.length === 0) {
    return null;
  }

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const onPressItem = (index: number) => {
    if (!enableNavigation) {
      return;
    }
    const item = data[index];
    if (item.type === 'product') {
      navigation.navigate('ProductDetail', {productId: item.entityId});
    }
    if (item.type === 'category') {
      navigation.navigate('CategoryDetail', {categoryId: item.entityId});
    }
    if (item.type === 'collection') {
      navigation.navigate('CollectionDetail', {collectionId: item.entityId});
    }
  };

  return (
    <View className="items-center gap-2 mb-4">
      <Carousel
        ref={ref}
        width={width}
        height={115}
        data={data}
        loop={true}
        autoPlay={true}
        autoPlayInterval={4000}
        onProgressChange={progress}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.92,
          parallaxScrollingOffset: 0,
        }}
        renderItem={({index}) => {
          const uri = formatImageUrl(data[index].imageUrl);
          return (
            <TouchableWithoutFeedback onPress={() => onPressItem(index)}>
              <Image
                source={{uri}}
                className="w-full h-full rounded-lg border border-gray-200"
                resizeMode="cover"
              />
            </TouchableWithoutFeedback>
          );
        }}
      />
      {data.length > 1 && (
        <PagiationTw
          progress={progress}
          data={data}
          onPress={onPressPagination}
          dotClassName="bg-gray-200 rounded-full"
          activeDotClassName="bg-gray-500"
          containerClassName="gap-3"
          size={8}
        />
      )}
    </View>
  );
};

export default HeroCarousel;
