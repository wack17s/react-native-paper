/* @flow */

export type Theme = {
  dark: boolean,
  roundness: number,
  colors: {
    primary: string,
    primaryDark: string,
    background: string,
    paper: string,
    accent: string,
    error: string,
    text: string,
    secondaryText: string,
    disabled: string,
    placeholder: string,
    helperText: string,
    errorText: string,
  },
  fonts: {
    regular: string,
    medium: string,
    light: string,
    thin: string,
  },
};
