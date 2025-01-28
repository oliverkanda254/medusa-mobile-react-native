export type ThemeColorSet = {
  light: Colors;
  dark: Colors;
};

export type ThemeColorSets = {
  [key: string]: ThemeColorSet;
};

export type Theme = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

export type Themes = {
  [key: string]: Theme;
};

export type Colors = {
  primary: string;
  background: string;
  content: string;
  contentInverse: string;
  backgroundSecondary: string;
};
