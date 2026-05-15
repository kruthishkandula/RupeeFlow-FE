import { Images } from '@/assets/images';
import React from 'react';
import { ImageBackground } from 'react-native';

export default function MainBG2({ children }: Readonly<{ children: React.ReactNode }>) {
    let bgImage = Images['Background'];


    return (
        <ImageBackground
            source={bgImage}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </ImageBackground>
    )
}