import { useThemeStore } from '@/store/theme/themeStore';
import { createContext, useCallback, useContext, useEffect } from 'react';
import { StatusBar, useColorScheme, View, ViewProps } from 'react-native';
import { StatusBarTheme, Themes, ThemesVariant } from './theme-config';


type ThemeContextValues = {
  theme: ThemesVariant;
};

const ThemeProviderValues = createContext<ThemeContextValues>({
  theme: 'light',
});

export function useThemeContextValues() {
  return useContext(ThemeProviderValues);
}

type ThemeContextActions = {
  theme: ThemesVariant;
  handleThemeSwitch: (newTheme: ThemesVariant, isDefault?: boolean) => void;
};

const ThemeProviderActions = createContext<ThemeContextActions>(
  {} as ThemeContextActions
);

export function useThemeContextActions() {
  return useContext(ThemeProviderActions);
}

type ThemeProps = ViewProps;

export function Theme(props: ThemeProps) {
  const { theme, setTheme, isDefaultTheme, setIsDefaultTheme } = useThemeStore();
  const colorScheme = useColorScheme();

  const handleThemeSwitch = useCallback((newTheme: ThemesVariant, isDefault?: boolean) => {
    setTheme(newTheme);
    if (isDefault) {
      setIsDefaultTheme(true);
    } else {
      setIsDefaultTheme(false);
    }
  }, []);

  useEffect(() => {
    if (colorScheme && isDefaultTheme) {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme, isDefaultTheme]);

  return (
    <View style={Themes[theme]} className={'flex-1' + ' ' + props.className}>
      <ThemeProviderValues.Provider value={{ theme }}>
        <ThemeProviderActions.Provider value={{ handleThemeSwitch, theme }}>
          <StatusBar
            backgroundColor={StatusBarTheme[theme].background}
          />
          {props.children}
        </ThemeProviderActions.Provider>
      </ThemeProviderValues.Provider>
    </View>
  );
}