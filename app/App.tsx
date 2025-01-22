import * as React from 'react';
import {View, Text} from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  StaticParamList,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button} from '@react-navigation/elements';

import '../global.css';

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-6xl">Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Details Screen</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Home',
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

export type RootStackParamList = StaticParamList<typeof RootStack>;

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
