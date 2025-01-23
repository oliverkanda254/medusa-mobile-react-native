import {useColorScheme} from 'nativewind';
import React, {PropsWithChildren} from 'react';
import themes from './themes';
import {View} from 'react-native';

type ThemeProviderProps = {
  name: string;
};

function ThemeProvider(props: PropsWithChildren<ThemeProviderProps>) {
  const {colorScheme} = useColorScheme();
  const themeStyle = themes[props.name][colorScheme || 'light'];
  return (
    <View className="flex-1" style={themeStyle}>
      {props.children}
    </View>
  );
}

export default ThemeProvider;
