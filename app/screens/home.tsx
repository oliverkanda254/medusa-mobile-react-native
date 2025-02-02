import React from 'react';
import {View, StatusBar, TouchableOpacity} from 'react-native';
import Icon from '@react-native-vector-icons/ant-design';
import {useColors, useTheme} from '@styles/hooks';
import Header from '@components/home/header';
import ProductsList from '@components/product/product-list';
import HeroCarousel from '@components/home/hero-carousel';
import FeaturedCollection from '@components/home/featured-collection';

const Home = () => {
  const {name, setThemeName} = useTheme();
  const switchTheme = () => {
    setThemeName(name === 'default' ? 'vintage' : 'default');
  };
  const colors = useColors();
  return (
    <View className="bg-background flex-1">
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header />
      <View className="flex-1 mt-4">
        <ProductsList
          headerComponent={
            <>
              <HeroCarousel />
              <FeaturedCollection />
            </>
          }
        />
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

export default Home;
