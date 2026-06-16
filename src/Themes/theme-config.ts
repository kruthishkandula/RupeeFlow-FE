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
  lavender: {
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    secondary: '#A78BFA',
    accent: '#C4B5FD',

    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#6366F1',

    surfaceBase: '#F8F6FF',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: '#F2EEFF',

    borderDefault: '#DDD6FE',
    borderSubtle: '#EDE9FE',

    textPrimary: '#312E81',
    textSecondary: '#6D5DB3',
    textTertiary: '#9A8FD1',
    textInverse: '#FFFFFF',

    focusRing: '#4C1D95',
    linkDefault: '#7C3AED',

    dark: commonColors.black,
    light: commonColors.white,

    isDark: false,
    bgType: 'LavendarBg'
  },
  mint: {
    primary: '#10B981',
    primaryHover: '#059669',
    secondary: '#6EE7B7',
    accent: '#A7F3D0',

    success: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',

    surfaceBase: '#F0FDF8',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: '#DCFCE7',

    borderDefault: '#BBF7D0',
    borderSubtle: '#D1FAE5',

    textPrimary: '#064E3B',
    textSecondary: '#047857',
    textTertiary: '#6B7280',
    textInverse: '#FFFFFF',

    focusRing: '#065F46',
    linkDefault: '#059669',

    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
    bgType: 'MintBg'
  },
  ocean: {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    success: '#059669',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0EA5E9',

    surfaceBase: '#F5FAFF',
    surfaceElevated: '#FFFFFF',
    surfaceOverlay: '#EAF4FF',

    borderDefault: '#BFDBFE',
    borderSubtle: '#DBEAFE',

    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#64748B',
    textInverse: '#FFFFFF',

    focusRing: '#1E3A8A',
    linkDefault: '#2563EB',

    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
    bgType: 'OceanBg'
  },
  royalpurple: {
    primary: '#A78BFA',
    primaryHover: '#8B5CF6',
    secondary: '#C4B5FD',
    accent: '#DDD6FE',

    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#818CF8',

    surfaceBase: '#1A1333',
    surfaceElevated: '#241B45',
    surfaceOverlay: '#2E225A',

    borderDefault: '#4C3F7A',
    borderSubtle: '#3B2F65',

    textPrimary: '#F5F3FF',
    textSecondary: '#D8CCFF',
    textTertiary: '#B8A9F0',
    textInverse: '#FFFFFF',

    focusRing: '#C4B5FD',
    linkDefault: '#A78BFA',

    dark: commonColors.black,
    light: commonColors.white,
    isDark: true,
    bgType: 'RoyalpurpleBg'
  }
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