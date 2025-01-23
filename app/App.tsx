import * as React from 'react';
import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ThemeProvider from '@styles/theme-provider';

import '@styles/global.css';
import Splash from '@screens/splash';
import Home from '@screens/home';

export type RootStackParamList = StaticParamList<typeof RootStack>;

export default function App() {
  return (
    <ThemeProvider name="default">
      <Navigation />
    </ThemeProvider>
  );
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Splash',
  screens: {
    Splash: {
      screen: Splash,
      options: {
        headerShown: false,
      },
    },
    Home,
  },
});

const Navigation = createStaticNavigation(RootStack);
