import {useColorScheme} from 'nativewind';
import React, {createContext, PropsWithChildren} from 'react';
import {themes, themeColorSets, ThemeName} from '@styles/themes';
import {View} from 'react-native';
import {Colors} from '@styles/types';

interface ThemeContext {
  name: ThemeName;
  colors: Colors;
  colorScheme: 'light' | 'dark';
  setThemeName: (name: ThemeName) => void;
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
  name: ThemeName;
};

function ThemeProvider({
  name,
  children,
}: PropsWithChildren<ThemeProviderProps>) {
  const [themeName, setThemeName] = React.useState<ThemeName>(name);
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
