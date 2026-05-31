import { ALLOW_FONT_SCALING } from '@/utility/config';
import React from 'react';
import { Dimensions, PixelRatio, Text as RNText, TextProps } from 'react-native';

const { height } = Dimensions.get('screen');

// Utility to normalize font size based on device pixel ratio and user settings
export function nf(size: number | string): number {
    const scale = Math.min(1.4, PixelRatio.getFontScale());
    const parsedSize = typeof size === 'string' ? Number.parseInt(size, 10) : size;
    return parsedSize * scale;
}

interface AppTextProps extends TextProps {
    children: React.ReactNode;
    style?: any;
    fontSize?: number | string;
}

const AppText: React.FC<AppTextProps> = ({
    children,
    style,
    fontSize,
    allowFontScaling = ALLOW_FONT_SCALING,
    ...rest
}) => {
    return (
        <RNText
            allowFontScaling={allowFontScaling}
            style={[style, fontSize ? { fontSize: fontSize } : {}]}
            numberOfLines={2}
            ellipsizeMode={'tail'}
            {...rest}
        >
            {children}
        </RNText>
    );
};

export default AppText;
