import {useColorScheme} from 'nativewind';
import React, {createContext, PropsWithChildren} from 'react';
import {themes, themeColorSets} from '@styles/themes';
import {View} from 'react-native';
import {Colors} from '@styles/types';

interface ThemeContext {
  name: string;
  colors: Colors;
  colorScheme: 'light' | 'dark';
  setThemeName: (name: string) => void;
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContext>({
  name: 'default',
  colors: themeColorSets.default.light,
  colorScheme: 'light',
  setThemeName: () => {},
  isDarkMode: false,
});

type ThemeProviderProps = {
  name: string;
};

function ThemeProvider({
  name,
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  const [themeName, setThemeName] = React.useState(name);
  const {colorScheme = 'light'} = useColorScheme();
  const themeStyles = themes[themeName][colorScheme];
  const colors = themeColorSets[themeName][colorScheme];
  return (
    <ThemeContext.Provider
      value={{
        name: themeName,
        setThemeName,
        colors,
        colorScheme,
        isDarkMode: colorScheme === 'dark',
      }}>
      <View className="flex-1" style={themeStyles}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
