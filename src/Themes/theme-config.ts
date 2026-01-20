import { Images } from '@/assets/images';
import { vars } from 'nativewind';

export const commonColors = {
  // Semantic colors
  success: '#4CAF50',
  successDark: '#66BB6A',
  warning: '#FF9800',
  warningDark: '#FFA726',
  error: '#D91604',
  errorDark: '#EF5350',
  info: '#2196F3',
  infoDark: '#42A5F5',

  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#E0E0E0',
  gray300: '#BDBDBD',
  gray400: '#9E9E9E',
  gray500: '#757575',
  gray600: '#616161',
  gray700: '#424242',
  gray800: '#212121',
  gray900: '#121212',

  // Additional utility colors (add any new common colors here)
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardOverlayLight: 'rgba(255, 255, 255, 0.8)',
  cardOverlayDark: 'rgba(0, 0, 0, 0.8)',
};

type ThemeSpecificColors = {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  surfaceBase: string;
  surfaceElevated: string;
  surfaceOverlay: string;
  borderDefault: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  focusRing: string;
  linkDefault: string;
  dark: string;
  light: string;
  isDark: boolean;
  bgType?: keyof typeof Images;
};

type ThemeColors = ThemeSpecificColors & typeof commonColors;

// Theme-specific color overrides (only define colors unique to each theme)
const themeSpecificDefinitions: Record<string, ThemeSpecificColors> = {
  light: {
    primary: '#2F7E79',
    primaryHover: '#4E9905',
    secondary: '#8AD93B',
    accent: '#F28907',
    success: commonColors.success,
    warning: commonColors.warning,
    error: commonColors.error,
    info: commonColors.info,
    surfaceBase: commonColors.white,
    surfaceElevated: commonColors.gray100,
    surfaceOverlay: commonColors.gray50,
    borderDefault: commonColors.gray200,
    borderSubtle: '#F0F0F0',
    textPrimary: commonColors.gray800,
    textSecondary: commonColors.gray500,
    textTertiary: commonColors.gray400,
    textInverse: commonColors.white,
    focusRing: commonColors.info,
    linkDefault: '#1976D2',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
    bgType: 'Background'
  },
  dark: {
    primary: '#2F7E79',
    primaryHover: '#8FE033',
    secondary: '#A0E65C',
    accent: '#FFA726',
    success: commonColors.successDark,
    warning: commonColors.warningDark,
    error: commonColors.errorDark,
    info: commonColors.infoDark,
    surfaceBase: commonColors.gray900,
    surfaceElevated: '#1E1E1E',
    surfaceOverlay: '#2C2C2C',
    borderDefault: '#404040',
    borderSubtle: '#2C2C2C',
    textPrimary: '#E0E0E0',
    textSecondary: '#A0A0A0',
    textTertiary: '#707070',
    textInverse: commonColors.gray900,
    focusRing: commonColors.infoDark,
    linkDefault: '#64B5F6',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: true,
    bgType: 'DarkBg'
  },
  xmas: {
    primary: '#BB2528',
    primaryHover: '#991F22',
    secondary: '#146B3A',
    accent: '#D4AF37',
    success: '#0F7833',
    warning: '#F8B229',
    error: '#C41E3A',
    info: '#5BA8D9',
    surfaceBase: '#FFF8E7',
    surfaceElevated: '#FFFCF0',
    surfaceOverlay: '#FFF3D6',
    borderDefault: '#E8D4A0',
    borderSubtle: '#F5E8C8',
    textPrimary: '#1A3A1F',
    textSecondary: '#8B6914',
    textTertiary: '#A88932',
    textInverse: '#FFFFFF',
    focusRing: '#082A40',
    linkDefault: '#146B3A',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
    bgType: 'XmasBg'
  },
};

export const themeDefinitions: Record<string, ThemeColors> = Object.fromEntries(
  Object.entries(themeSpecificDefinitions).map(([name, colors]) => [
    name,
    { ...commonColors, ...colors }
  ])
);


const createThemeVars = (colors: ThemeColors) => {
  const themeVars: Record<string, string> = {};

  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    themeVars[cssVarName] = '' + value;
  });

  return vars(themeVars);
};

export const Themes = Object.fromEntries(
  Object.entries(themeDefinitions).map(([name, colors]) => [
    name,
    createThemeVars(colors)
  ])
) as Record<keyof typeof themeDefinitions, ReturnType<typeof vars>>;

export type ThemesVariant = keyof typeof themeDefinitions;

export const getThemeColors = (themeName: ThemesVariant): ThemeColors => {
  return themeDefinitions[themeName] || themeDefinitions.light;
};

export const getCommonColors = () => commonColors;





// ------ status bar themes -------

type StatusBarThemeConfig = {
  background: string;
};

const getStatusBarConfig = (surfaceBase: string): StatusBarThemeConfig => {
  return {
    background: surfaceBase,
  };
};

export const StatusBarTheme = Object.fromEntries(
  Object.entries(themeDefinitions).map(([name, colors]) => [
    name,
    getStatusBarConfig(colors.surfaceBase)
  ])
) as Record<ThemesVariant, StatusBarThemeConfig>;