import { Images } from '@/assets/images';
import useTheme from '@/hooks/useTheme';
import React from 'react';
import { ImageBackground } from 'react-native';

export default function MainBG({ children }: { children: React.ReactNode }) {
    const { colors } = useTheme();
    let bgImage = Images[colors.bgType || 'Background'];


    return (
        <ImageBackground
            source={bgImage}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </ImageBackground>
    )
}