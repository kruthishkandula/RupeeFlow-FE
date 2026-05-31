import { Images } from '@/assets/images'
import AppText from '@/components/AppText'
import useTheme from '@/hooks/useTheme'
import { StatusBarTheme } from '@/Themes/theme-config'
import {
    APP_NAME,
    APP_SUBTITLE,
    APP_VERSION,
    SPLASH_DURATION_MS,
    SPLASH_GLOW_ANIMATION_DURATION,
    SPLASH_GLOW_SCALE_MAX,
    SPLASH_OPACITY_DURATION,
    SPLASH_ROTATE_DURATION,
    SPLASH_SCALE_FRICTION,
    SPLASH_SCALE_TENSION,
    SPLASH_TRANSLATEY_DURATION,
} from '@/utility/config'
import React, { useEffect, useRef } from 'react'
import {
    Animated,
    Dimensions,
    Easing,
    StatusBar,
    StyleSheet,
    View
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const { width } = Dimensions.get('window')

type Props = {
    onFinish?: () => void
    delay?: number
}

const SplashScreen = ({
    onFinish,
    delay = SPLASH_DURATION_MS,
}: Props) => {
    const opacity = useRef(new Animated.Value(0)).current
    const scale = useRef(new Animated.Value(0.8)).current
    const translateY = useRef(new Animated.Value(40)).current
    const glowScale = useRef(new Animated.Value(1)).current
    const rotate = useRef(new Animated.Value(0)).current
    const { colors, theme } = useTheme()

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: SPLASH_OPACITY_DURATION,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),

            Animated.spring(scale, {
                toValue: 1,
                friction: SPLASH_SCALE_FRICTION,
                tension: SPLASH_SCALE_TENSION,
                useNativeDriver: true,
            }),

            Animated.timing(translateY, {
                toValue: 0,
                duration: SPLASH_TRANSLATEY_DURATION,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
        ]).start()

        Animated.loop(
            Animated.sequence([
                Animated.timing(glowScale, {
                    toValue: SPLASH_GLOW_SCALE_MAX,
                    duration: SPLASH_GLOW_ANIMATION_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(glowScale, {
                    toValue: 1,
                    duration: SPLASH_GLOW_ANIMATION_DURATION,
                    useNativeDriver: true,
                }),
            ])
        ).start()

        Animated.loop(
            Animated.timing(rotate, {
                toValue: 1,
                duration: SPLASH_ROTATE_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start()

        const t = setTimeout(() => {
            onFinish?.()
        }, delay)

        return () => clearTimeout(t)
    }, [])

    const rotateInterpolate = rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    })

    const statusBarBg = StatusBarTheme[theme]?.background || colors.surfaceBase;
    return (
        <LinearGradient
            colors={[colors.surfaceBase, colors.surfaceOverlay, colors.surfaceElevated]}
            style={styles.container}
        >
            <StatusBar
                barStyle={colors.isDark ? 'light-content' : 'dark-content'}
                backgroundColor={statusBarBg}
                translucent={false}
            />

            {/* Background Glow */}
            <Animated.View
                style={[
                    styles.glow,
                    { backgroundColor: colors.primary },
                    {
                        opacity: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.1, 0.9],
                        }),
                        transform: [
                            { scale: glowScale },
                            { rotate: rotateInterpolate },
                        ],
                    },
                ]}
            />

            {/* Floating Circles */}
            <View style={[styles.circle1, { backgroundColor : colors.accent + '80',}]} />
            <View style={[styles.circle2, { backgroundColor : colors.secondary + '1A',}]} />

            {/* Logo */}
            <Animated.Image
                source={Images.Splash1}
                resizeMode="contain"
                style={[
                    styles.logo,
                    {
                        opacity,
                        transform: [{ scale }, { translateY }],
                    },
                ]}
            />

            {/* Text */}
            <Animated.View
                style={[
                    styles.textWrap,
                    {
                        opacity,
                        transform: [{ translateY }],
                    },
                ]}
            >
                <AppText className='text-textInverse' style={styles.title}>{APP_NAME}</AppText>

                <AppText style={[styles.subtitle, { color: colors.textInverse + '80'}]}>
                    {APP_SUBTITLE}
                </AppText>
            </Animated.View>
            {/* Version - Bottom Right */}
            <View style={{ position: 'absolute', right: 20, bottom: 40 }} pointerEvents="none">
                <AppText style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600', opacity: 0.7 }}>
                    v{APP_VERSION}
                </AppText>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    glow: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width,
    },

    circle1: {
        position: 'absolute',
        top: 140,
        left: -40,
        width: 140,
        height: 140,
        borderRadius: 100,
    },

    circle2: {
        position: 'absolute',
        bottom: 180,
        right: -50,
        width: 180,
        height: 180,
        borderRadius: 120,
        // backgroundColor: 'rgba(16,185,129,0.12)',
    },

    logo: {
        width: 240,
        height: 240,
        zIndex: 5,
    },

    textWrap: {
        marginTop: 10,
        alignItems: 'center',
        zIndex: 5,
    },

    title: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: 1,
    },

    subtitle: {
        marginTop: 10,
        fontSize: 15,
        color: '#94A3B8',
        letterSpacing: 1,
    },
})

export default SplashScreen