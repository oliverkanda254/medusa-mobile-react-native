import React, {PropsWithChildren, useMemo, useState} from 'react';
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
import Card from '@components/common/card';
import utils from '../utils';
import OptionSelect from '@components/product/option-select';
import {HttpTypes} from '@medusajs/types';
import twColors from 'tailwindcss/colors';
import {useCart} from '../data/cart-context';
import {useColors} from '@styles/hooks';

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
        fields: '*variants.inventory_quantity',
      }),
  });

  if (isPending) {
    return <Loader />;
  } else if (error) {
    return <ErrorUI />;
  }

  const {product} = data;

  return <ProductContent product={product} />;
}

const ProductContent = ({product}: {product: HttpTypes.StoreProduct}) => {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    {},
  );

  const optionsAsKeymap = (
    variantOptions: HttpTypes.StoreProductVariant['options'],
  ) => {
    return variantOptions?.reduce(
      (acc: Record<string, string>, varopt: any) => {
        acc[varopt.option_id] = varopt.value;
        return acc;
      },
      {},
    );
  };

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return;
    }

    return product.variants.find(v => {
      const variantOptions = optionsAsKeymap(v.options);
      return utils.areEqualObjects(variantOptions, options);
    });
  }, [product.variants, options]);

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some(v => {
      const variantOptions = optionsAsKeymap(v.options);
      return utils.areEqualObjects(variantOptions, options);
    });
  }, [product.variants, options]);

  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true;
    }

    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true;
    }

    // If there is inventory available, we can add to cart
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true;
    }

    // Otherwise, we can't add to cart
    return false;
  }, [selectedVariant]);

  const setOptionValue = (optionId: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const {cart} = useCart();
  console.log('cart id', cart?.id);

  return (
    <View className="flex-1 bg-background-secondary">
      <ScrollView className="flex-1">
        <View>
          <ImageCarousel data={product.images ?? []} />
          <View className="absolute w-full">
            <Header />
          </View>
        </View>
        <View className="p-4 -mt-8">
          <Card>
            <Text className="font-content-bold text-xl">{product.title}</Text>
            <View className="mt-2">
              <RatingSummary />
            </View>
            <Text className="text-base opacity-80 mt-2">
              {product.description}
            </Text>
            <View className="mt-2">
              <ProductPrice product={product} variant={selectedVariant} />
            </View>
          </Card>
          <View className="mt-4">
            <Card>
              <SelectVariant
                product={product}
                setOptionValue={setOptionValue}
                options={options}
              />
            </Card>
          </View>
          <View className="mt-4">
            <Card>
              <Features />
            </Card>
          </View>
          <View className="mt-4">
            <Card>
              <ProductAttributes product={product} />
            </Card>
          </View>
        </View>
      </ScrollView>
      <View className="border-t border-gray-200">
        <AnimatedCartButton
          productId={product.id}
          selectedVariantId={selectedVariant?.id}
          disabled={!isValidVariant || !inStock}
          inStock={inStock}
        />
      </View>
    </View>
  );
};

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

type SelectVariantProps = {
  product: HttpTypes.StoreProduct;
  setOptionValue: (optionId: string, value: string) => void;
  // isAdding: boolean;
  options: Record<string, string | undefined>;
};

const SelectVariant = ({
  product,
  setOptionValue,
  // isAdding,
  options,
}: SelectVariantProps) => {
  return (
    <View className="flex flex-col gap-y-4">
      {product.options?.map(option => (
        <View key={option.id}>
          <OptionSelect
            option={option}
            current={options[option.id]}
            updateOption={setOptionValue}
            title={option.title ?? ''}
            disabled={false}
          />
        </View>
      ))}
      <View />
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

const ProductAttributes = ({product}: {product: any}) => {
  return (
    <View>
      <Text className="text-xl mb-6 opacity-75">Product Information</Text>
      <View className="flex flex-row justify-between gap-x-8">
        <View className="flex flex-col flex-1 gap-y-4">
          <View>
            <Text className="font-semibold opacity-75">Material</Text>
            <Text>{product.material ? product.material : '-'}</Text>
          </View>
          <View>
            <Text className="font-semibold opacity-75">Country of origin</Text>
            <Text>{product.origin_country ? product.origin_country : '-'}</Text>
          </View>
          <View>
            <Text className="font-semibold opacity-75">Type</Text>
            <Text>{product.type ? product.type.value : '-'}</Text>
          </View>
        </View>
        <View className="flex flex-col flex-1 gap-y-4">
          <View>
            <Text className="font-semibold opacity-75">Weight</Text>
            <Text>{product.weight ? `${product.weight} g` : '-'}</Text>
          </View>
          <View>
            <Text className="font-semibold opacity-75">Dimensions</Text>
            <Text>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : '-'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Features = () => {
  return (
    <View className="flex-row gap-2">
      <FeatureWrapper>
        <Icon name="swap" size={30} color={twColors.gray[500]} />
        <Text className="text-sm font-content-bold">7 days return</Text>
      </FeatureWrapper>
      <FeatureWrapper>
        <Icon name="dingding" size={30} color={twColors.gray[500]} />
        <Text className="text-sm font-content-bold">Fast Delivery</Text>
      </FeatureWrapper>
    </View>
  );
};

const FeatureWrapper = ({children}: PropsWithChildren<{}>) => {
  return (
    <View className="flex-1 bg-slate-100 gap-2 rounded-lg p-2 justify-center items-center">
      {children}
    </View>
  );
};

const RatingSummary = () => {
  const colors = useColors();
  return (
    <View className="flex-row items-center gap-1">
      <View className="flex-row items-center px-1 py-[1] bg-green-500 rounded-md">
        <Icon name="star" size={16} color={colors.contentInverse} />
        <Text className="text-base text-content-inverse opacity-80 ml-1">
          4.5
        </Text>
      </View>
      <Text className="text-sm opacity-50">(102)</Text>
    </View>
  );
};

export default ProductScreen;
