// import {vars} from 'nativewind';
import {ThemeColorSets} from '@styles/types';
import {applyThemes} from '@styles/utils';

export const themeColorSets: ThemeColorSets = {
  default: {
    light: {
      primary: '#8e6cef',
      background: 'white',
      backgroundSecondary: '#F0F3F8',
      content: '#120120',
      contentInverse: 'white',
    },
    dark: {
      primary: '#8e6cef',
      background: 'black',
      backgroundSecondary: '#F0F3F8',
      content: 'white',
      contentInverse: 'black',
    },
  },
  vintage: {
    light: {
      primary: '#C96868',
      background: '#FFF4EA',
      backgroundSecondary: '#F0F3F8',
      content: 'black',
      contentInverse: 'white',
    },
    dark: {
      primary: '#CA7373',
      background: '#3C552D',
      backgroundSecondary: '#F0F3F8',
      content: 'white',
      contentInverse: 'black',
    },
  },
};

export const themes = applyThemes(themeColorSets);

//https://colorhunt.co/palette/c96868fadfa1fff4ea7eacb5
//https://colorhunt.co/palette/3c552dca7373d7b26deee2b5
