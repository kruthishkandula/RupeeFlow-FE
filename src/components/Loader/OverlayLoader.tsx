import React from 'react';
import { Text, View } from 'react-native';

export default function OverlayLoader({ open, text }: Readonly<{ open: boolean, text?: string }>) {

    if (!open) return null;

    return (
        <View className='absolute inset-0 bg-[rgba(0,0,0,0.4)] flex-col items-center justify-center z-50'>
            <View className='w-18 h-18 border-8 border-primary rounded-full animate-pulse duration-500' />
            {!!(text) && <Text className='text-textInverse mt-4 text-2xl font-bold'>{text}</Text>}
        </View>
    )
}