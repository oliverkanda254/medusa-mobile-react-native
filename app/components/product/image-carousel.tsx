import {HttpTypes} from '@medusajs/types';
import {formatImageUrl} from '@utils/image-url';
import {cssInterop} from 'nativewind';
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type CarouselProps = {
  data: HttpTypes.StoreProductImage[];
};

const PagiationTw = cssInterop(Pagination.Basic, {
  containerClassName: 'containerStyle',
  dotClassName: 'dotStyle',
  activeDotClassName: 'activeDotStyle',
});

const ImageCarousel = ({data}: CarouselProps) => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="bg-background-secondary">
      <Carousel
        ref={ref}
        width={width}
        height={height * 0.4}
        data={data}
        loop={false}
        onProgressChange={progress}
        renderItem={({index}) => {
          const uri = formatImageUrl(data[index].url);
          return (
            <Image
              source={{uri}}
              className="w-full h-full"
              resizeMode="cover"
            />
          );
        }}
      />
      {data.length > 1 && (
        <View className="absolute left-0 right-0 bottom-8">
          <PagiationTw
            progress={progress}
            data={data}
            onPress={onPressPagination}
            dotClassName="bg-gray-200 rounded-full"
            activeDotClassName="bg-gray-600"
            containerClassName="gap-2"
            size={8}
          />
        </View>
      )}
    </View>
  );
};

export default ImageCarousel;
