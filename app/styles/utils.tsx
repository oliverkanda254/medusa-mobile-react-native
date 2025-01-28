import {Themes, ThemeColorSets, Colors} from './types';
import {vars} from 'nativewind';

export const applyThemes = (themeColorSets: ThemeColorSets): Themes => {
  const themes: Themes = {};
  for (const themeName in themeColorSets) {
    const themeColorSet = themeColorSets[themeName];
    themes[themeName] = {
      light: getVars(themeColorSet.light),
      dark: getVars(themeColorSet.dark),
    };
  }
  return themes;
};

const getVars = (colors: Colors) => {
  return vars(
    Object.entries(colors).reduce(
      (acc: Record<string, string>, [key, value]) => {
        // convert key from camelcase to kebab-case
        const kebabKey = key
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
          .toLowerCase();
        acc[`--color-${kebabKey}`] = value;
        return acc;
      },
      {},
    ),
  );
};
