import useTheme from '@/hooks/useTheme'
import React from 'react'
import { StatusBar, View, ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function SafeAreaContainer({ children, style, className }: { children: React.ReactNode, style?: ViewStyle, className?: string }) {
    const { top, bottom } = useSafeAreaInsets()
    const { isDark } = useTheme()


    return (
        <View className={className} style={[{ flex: 1, paddingTop: top + 2, paddingBottom: bottom }, style]}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
            {children}
        </View>
    )
}