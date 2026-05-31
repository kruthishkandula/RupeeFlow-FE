import useTheme from '@/hooks/useTheme';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppText from '../AppText';

export default function OverlayLoader({ open, text }: Readonly<{ open: boolean, text?: string }>) {
    const { colors } = useTheme();

    if (!open) return null;

    return (
        <View className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex-col items-center justify-center z-50'>
            <ActivityIndicator size="large" color={colors?.primary} />
            {!!(text) && <AppText className='text-textInverse mt-4 text-2xl font-poppins italic font-bold'>{text}</AppText>}
        </View>
    )
}