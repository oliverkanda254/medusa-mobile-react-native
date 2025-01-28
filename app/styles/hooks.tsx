import {useContext} from 'react';
import {ThemeContext} from '@styles/theme-provider';

export const useThemeName = () => {
  return useContext(ThemeContext).name;
};

export const useColorScheme = () => {
  return useContext(ThemeContext).colorScheme;
};

export const useColors = () => {
  return useContext(ThemeContext).colors;
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
