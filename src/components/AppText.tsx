import React from 'react';
import { Text as RNText, TextProps, PixelRatio } from 'react-native';

// Utility to normalize font size based on device pixel ratio and user settings
export function normalizeFontSize(size: number) {
  const scale = PixelRatio.getFontScale();
  return size * scale;
}

interface AppTextProps extends TextProps {
  children: React.ReactNode;
  fontSize?: number; // base font size in px
  style?: any;
}

const AppText: React.FC<AppTextProps> = ({
  children,
  fontSize = 16,
  style,
  allowFontScaling = true,
  ...rest
}) => {
  return (
    <RNText
      allowFontScaling={allowFontScaling}
      style={[{ fontSize: normalizeFontSize(fontSize) }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default AppText;
