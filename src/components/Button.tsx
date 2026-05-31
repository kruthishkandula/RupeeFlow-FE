import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import AppText, { nf } from './AppText';

export type ButtonProps = {
    variant?: "primary" | "secondary" | "tertiary" | "danger" | "success";
    onPress?: () => void;
    title?: string;
    style?: object;
    textStyle?: object;
    className?: string;
    textClassName?: string;
    size?: "small" | "medium" | "large";
    loading?: boolean;
    disabled?: boolean;
}

export default function Button({
    variant = "primary",
    onPress,
    title = "Click Me",
    style,
    textStyle,
    className,
    textClassName = "text-white text-center",
    size = "medium",
    loading = false,
    disabled = false,
    ...props
}: Readonly<ButtonProps>) {
    let extraStyle: Record<string, string | number> = {};

    let borderRadis = 36

    // Default button primary class
    let ButtonClassName = `bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded-[${borderRadis}px]`;


    // Adjust variant classes
    if (variant === "secondary") {
        ButtonClassName = `bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-[${borderRadis}px]`;
    } else if (variant === "tertiary") {
        ButtonClassName = `bg-transparent text-green-800 font-bold py-2 px-4 rounded-[${borderRadis}px]`;
    } else if (variant === "danger") {
        ButtonClassName = `bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-[${borderRadis}px]`;
    } else if (variant === "success") {
        ButtonClassName = `bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-[${borderRadis}px]`;
    }


    // Adjust size classes
    if (size === "small") {
        extraStyle.fontSize = nf(12);
    } else if (size === "large") {
        extraStyle.fontSize = nf(14);
    } else {
        extraStyle.fontSize = nf(16);
    }

    return (
        <TouchableOpacity className={`min-h-12 justify-center ${ButtonClassName} ${className}`} onPress={onPress} style={[style, disabled && { backgroundColor: '#afafaf' }]} disabled={disabled}>
            {loading ? <ActivityIndicator size={'small'} className='text-text2' /> : <AppText className={`text-center ${textClassName}`} style={[textStyle, extraStyle]}>{title}</AppText>}
        </TouchableOpacity>
    )
}