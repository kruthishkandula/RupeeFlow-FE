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
  },
  ocean: {
    primary: '#0077BE',
    primaryHover: '#005A93',
    secondary: '#00BCD4',
    accent: '#FF6F00',
    success: '#26A69A',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#4FC3F7',
    surfaceBase: '#E0F7FA',
    surfaceElevated: '#B2EBF2',
    surfaceOverlay: '#80DEEA',
    borderDefault: '#4DD0E1',
    borderSubtle: '#80DEEA',
    textPrimary: '#004D40',
    textSecondary: '#00695C',
    textTertiary: '#00897B',
    textInverse: '#E0F7FA',
    focusRing: '#00BCD4',
    linkDefault: '#0097A7',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
  },
  sunset: {
    primary: '#FF6B6B',
    primaryHover: '#EE5A52',
    secondary: '#FFD93D',
    accent: '#6BCB77',
    success: '#95E1D3',
    warning: '#FFAA64',
    error: '#E63946',
    info: '#A8DADC',
    surfaceBase: '#FFF5E4',
    surfaceElevated: '#FFE5CA',
    surfaceOverlay: '#FFD4B0',
    borderDefault: '#FFC09F',
    borderSubtle: '#FFD7BA',
    textPrimary: '#2D3142',
    textSecondary: '#4F5D75',
    textTertiary: '#8B95A5',
    textInverse: '#FFF5E4',
    focusRing: '#FF6B6B',
    linkDefault: '#E63946',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
  },
  forest: {
    primary: '#2D5016',
    primaryHover: '#1F3810',
    secondary: '#6B8E23',
    accent: '#D4AF37',
    success: '#4A7C59',
    warning: commonColors.warning,
    error: '#C0392B',
    info: '#16A085',
    surfaceBase: '#F0F4E8',
    surfaceElevated: '#E3EBD5',
    surfaceOverlay: '#D6E3C2',
    borderDefault: '#A8C090',
    borderSubtle: '#C5D9AD',
    textPrimary: '#1A2E0A',
    textSecondary: '#3D5A1F',
    textTertiary: '#5C7A3D',
    textInverse: '#F0F4E8',
    focusRing: '#6B8E23',
    linkDefault: '#2D5016',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
  },
  midnight: {
    primary: '#6C63FF',
    primaryHover: '#5A52E0',
    secondary: '#A29BFE',
    accent: '#FD79A8',
    success: '#00B894',
    warning: '#FDCB6E',
    error: '#D63031',
    info: '#74B9FF',
    surfaceBase: '#0F0E17',
    surfaceElevated: '#1C1B29',
    surfaceOverlay: '#2A2938',
    borderDefault: '#3E3D4F',
    borderSubtle: '#2E2D3D',
    textPrimary: '#FFFFFE',
    textSecondary: '#A7A9BE',
    textTertiary: '#72747E',
    textInverse: '#0F0E17',
    focusRing: '#6C63FF',
    linkDefault: '#A29BFE',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: true,
  },
  candy: {
    primary: '#FF1493',
    primaryHover: '#E0127D',
    secondary: '#FF69B4',
    accent: '#00CED1',
    success: '#7FFF00',
    warning: '#FFD700',
    error: '#FF4500',
    info: '#87CEEB',
    surfaceBase: '#FFF0F5',
    surfaceElevated: '#FFE4F0',
    surfaceOverlay: '#FFD6E8',
    borderDefault: '#FFC0E0',
    borderSubtle: '#FFD8EC',
    textPrimary: '#4A0E2C',
    textSecondary: '#8B2E5A',
    textTertiary: '#B5568C',
    textInverse: '#FFF0F5',
    focusRing: '#FF1493',
    linkDefault: '#C71585',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
  },
  desert: {
    primary: '#D97706',
    primaryHover: '#B45309',
    secondary: '#F59E0B',
    accent: '#DC2626',
    success: '#059669',
    warning: '#F59E0B',
    error: '#991B1B',
    info: '#0891B2',
    surfaceBase: '#FEF3C7',
    surfaceElevated: '#FDE68A',
    surfaceOverlay: '#FCD34D',
    borderDefault: '#F59E0B',
    borderSubtle: '#FDE68A',
    textPrimary: '#78350F',
    textSecondary: '#92400E',
    textTertiary: '#B45309',
    textInverse: '#FEF3C7',
    focusRing: '#D97706',
    linkDefault: '#B45309',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
  },
  lavender: {
    primary: '#9333EA',
    primaryHover: '#7E22CE',
    secondary: '#C084FC',
    accent: '#EC4899',
    success: commonColors.successDark,
    warning: commonColors.warningDark,
    error: commonColors.errorDark,
    info: commonColors.infoDark,
    surfaceBase: '#FAF5FF',
    surfaceElevated: '#F3E8FF',
    surfaceOverlay: '#E9D5FF',
    borderDefault: '#D8B4FE',
    borderSubtle: '#E9D5FF',
    textPrimary: '#581C87',
    textSecondary: '#6B21A8',
    textTertiary: '#7E22CE',
    textInverse: '#FAF5FF',
    focusRing: '#9333EA',
    linkDefault: '#7E22CE',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
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
    focusRing: '#BB2528',
    linkDefault: '#146B3A',
    dark: commonColors.black,
    light: commonColors.white,
    isDark: false,
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