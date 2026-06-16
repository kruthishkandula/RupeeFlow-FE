import AppText, { nf } from '@/components/AppText';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

export type TypeToggleOption<T extends string> = {
    value: T;
    label: string;
    activeColor: string;
};

type TypeToggleProps<T extends string> = {
    value: T;
    onChange: (v: T) => void;
    options: ReadonlyArray<TypeToggleOption<T>>;
    trackStyle?: StyleProp<ViewStyle>;
    textColor?: string;
    selectedTextColor?: string;
};

export default function TypeToggle<T extends string>({
    value,
    onChange,
    options,
    trackStyle,
    textColor = '#101010',
    selectedTextColor = '#fff',
}: Readonly<TypeToggleProps<T>>) {
    const selectedIndex = useMemo(() => Math.max(0, options.findIndex((option) => option.value === value)), [options, value]);
    const sliderAnim = useRef(new Animated.Value(selectedIndex)).current;

    useEffect(() => {
        Animated.timing(sliderAnim, {
            toValue: selectedIndex,
            duration: 220,
            useNativeDriver: false,
        }).start();
    }, [selectedIndex, sliderAnim]);

    const optionCount = Math.max(1, options.length);
    const sliderWidth: `${number}%` = `${100 / optionCount}%`;

    const interpolationInputRange = optionCount > 1 ? options.map((_, idx) => idx) : [0, 1];
    const sliderLeft = sliderAnim.interpolate({
        inputRange: interpolationInputRange,
        outputRange: optionCount > 1 ? options.map((_, idx) => `${(100 / optionCount) * idx}%`) : ['0%', '0%'],
    });

    const sliderColor = sliderAnim.interpolate({
        inputRange: interpolationInputRange,
        outputRange: optionCount > 1 ? options.map((option) => option.activeColor) : [options[0]?.activeColor ?? '#22C55E', options[0]?.activeColor ?? '#22C55E'],
    });

    return (
        <View style={[styles.toggleTrack, trackStyle]}>
            <Animated.View style={[styles.toggleSlider, { width: sliderWidth, left: sliderLeft, backgroundColor: sliderColor, }]} />
            {options.map((option) => {
                const selected = option.value === value;
                return (
                    <TouchableOpacity
                        key={option.value}
                        activeOpacity={0.8}
                        style={styles.toggleOption}
                        onPress={() => onChange(option.value)}
                    >
                        <AppText
                            style={[
                                styles.toggleText,
                                { color: textColor },
                                selected && [styles.toggleTextActive, { color: selectedTextColor }],
                            ]}
                        >
                            {option.label}
                        </AppText>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    toggleTrack: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 50,
        overflow: 'hidden',
        height: 48,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    toggleSlider: {
        position: 'absolute',
        height: '100%',
        borderRadius: 50,
    },
    toggleOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    toggleText: {
        fontSize: nf(14),
        fontWeight: '600',
    },
    toggleTextActive: {},
});
