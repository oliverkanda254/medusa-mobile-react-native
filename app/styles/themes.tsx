import {vars} from 'nativewind';

interface Theme {
  light: Record<string, string>;
  dark: Record<string, string>;
}

interface Themes {
  [key: string]: Theme;
}

const themes: Themes = {
  default: {
    light: vars({
      '--color-primary': '#8e6cef',
      '--color-background': 'white',
      '--color-content': 'black',
      '--color-content-inverse': 'white',
    }),
    dark: {
      '--color-primary': '#8e6cef',
      '--color-background': 'black',
      '--color-content': 'white',
      '--color-content-inverse': 'black',
    },
  },
  vintage: {
    light: vars({
      //https://colorhunt.co/palette/c96868fadfa1fff4ea7eacb5
      '--color-primary': '#C96868',
      '--color-background': '#FFF4EA',
      '--color-content': 'black',
      '--color-content-inverse': 'white',
    }),
    dark: vars({
      //https://colorhunt.co/palette/3c552dca7373d7b26deee2b5
      '--color-primary': '#CA7373',
      '--color-background': '#3C552D',
      '--color-content': 'white',
      '--color-content-inverse': 'black',
    }),
  },
};

export default themes;
