import useTheme from '@/hooks/useTheme';
import React from 'react';
import { ImageBackground, View } from 'react-native';

export default function MainBG({ children }: { children: React.ReactNode }) {
    const { colors } = useTheme();

    return (
        <ImageBackground
            source={require('../../assets/images/Background.png')}
            style={{ width: '100%', height: '100%' }}
        >
                {children}
        </ImageBackground>
    )
}