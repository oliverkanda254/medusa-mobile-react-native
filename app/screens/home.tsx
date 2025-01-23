import React from 'react';
import Text from '@components/common/text';
import {View, Image} from 'react-native';
import Icon from '@react-native-vector-icons/ant-design';

const Home = () => {
  return (
    <View className="bg-background flex-1 px-5">
      <View className="my-4">
        <Header />
      </View>
      <Text>Welcome to Medusa Native!</Text>
    </View>
  );
};

const Header = () => {
  // Header with profile pic on the left and cart icon on the right
  return (
    <View className="flex-row h-14 justify-between items-center">
      <Image
        source={{uri: 'https://randomuser.me/api/portraits/men/44.jpg'}}
        className="w-10 h-10 rounded-full"
      />
      <Text type="display">MN</Text>
      <View className="p-3 bg-primary rounded-full">
        <Icon name="shopping-cart" size={20} />
      </View>
    </View>
  );
};

export default Home;
