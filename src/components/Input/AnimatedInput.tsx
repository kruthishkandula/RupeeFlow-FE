import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from '@/components/Icon';
import useTheme from '@/hooks/useTheme';
import AppText, { nf } from '../AppText';
import { ALLOW_FONT_SCALING } from '@/utility/config';

interface Props extends Omit<TextInputProps, 'onChange' | 'onBlur' | 'value' | 'keyboardType'> {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  keyboardType?: any;
  amount?: boolean;
  currency?: string;
  isDark?: boolean;
  bgColor?: string;
  inputHeight?: number;
}

function formatAmount(raw: string): string {
  let cleaned = raw.replaceAll(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  let intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const grouped = rest.replaceAll(/\B(?=(\d{2})+(?!\d))/g, ' ');
    intPart = grouped + ' ' + last3;
  }
  return intPart + decPart;
}

function getRawValue(formatted: string): string {
  return formatted.replaceAll(' ', '');
}

export default function AnimatedInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  keyboardType,
  amount,
  currency = '₹',
  isDark = false,
  secureTextEntry,
  search = false,
  onClear,
  inputHeight,
  ...rest
}: Readonly<Props & { search?: boolean; onClear?: () => void }>) {
  // Single animated value drives both label float AND border color
  const floatAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;
  const { colors } = useTheme();

  // Only used for eye icon color — does NOT affect TextInput rendering
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isFocusedRef = useRef(false);

  const inputRef = useRef<TextInput>(null);

  const bgColor = rest?.bgColor || (isDark ? '#1E1E2E' : '#FFFFFF');
  const textColor = isDark ? '#F0F0F0' : '#000000';
  const maxLines = rest.multiline ? rest.numberOfLines : undefined;

  useEffect(() => {
    Animated.timing(floatAnim, {
      toValue: isFocusedRef.current || !!value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handleFocus = (e: any) => {
    isFocusedRef.current = true;
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
    }).start();
    rest.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    isFocusedRef.current = false;
    if (!value) {
      Animated.timing(floatAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    }
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
    onBlur?.();
  };

  const labelTop = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [18, -8] });
  const labelFontSize = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [nf(14), nf(10)] });
  const labelColor = error
    ? '#EF4444'
    : floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDark ? '#9E9E9E' : '#757575', colors?.primary],
      });

  const animatedBorderColor = error
    ? '#EF4444'
    : borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDark ? '#3A3A4A' : '#E5E7EB', colors?.primary],
      });

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
      <View style={styles.wrapper}>
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.label,
            { top: labelTop, fontSize: labelFontSize, color: labelColor, backgroundColor: bgColor, maxWidth: '90%', flexShrink: 1 },
          ]}
          allowFontScaling={ALLOW_FONT_SCALING}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Animated.Text>

        <Animated.View
          style={[
            styles.input,
            styles.inputRow,
            rest.multiline && styles.inputRowMultiline,
            { borderColor: animatedBorderColor, backgroundColor: bgColor, height: inputHeight || 56 },
          ]}>
          <TextInput
            ref={inputRef}
            value={amount ? formatAmount(value ?? '') : value}
            allowFontScaling={ALLOW_FONT_SCALING}
            onChangeText={(text) => {
              if (amount) {
                const filtered = text.replaceAll(',', '');
                const raw = getRawValue(filtered);
                const dotIndex = raw.indexOf('.');
                if (dotIndex !== -1 && raw.length - dotIndex - 1 > 2) return;
                onChange?.(raw);
              } else {
                if (maxLines && text.split(/\r\n|\r|\n/).length > maxLines) return;
                onChange?.(text);
              }
            }}
            keyboardType={amount ? 'decimal-pad' : keyboardType}
            style={[
              styles.innerInput,
              rest.multiline && styles.innerInputMultiline,
              { color: textColor },
            ]}
            cursorColor={colors?.textPrimary}
            selectionColor={colors?.textPrimary}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            {...rest}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmitEditing={rest?.onSubmitEditing}
          />
           {search && value?.length == 0 && (
            <Icon name="Search" size={16} color={'#9CA3AF'} style={{ marginRight: 8 }} />
          )}
          {search && (value?.length ?? 0) > 0 && (
            <TouchableOpacity onPress={onClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="CircleX" size={20} color="#9CA3AF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          )}
          {amount && <AppText style={[styles.currency, { color: textColor }]}>{currency}</AppText>}
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible((v) => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.eyeButton}>
              <Icon
                name={isPasswordVisible ? 'EyeOff' : 'Eye'}
                size={20}
                color={isDark ? '#6B7280' : '#9CA3AF'}
              />
            </TouchableOpacity>
          )}
        </Animated.View>

        {error && <AppText style={styles.error}>{error}</AppText>}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  label: {
    position: 'absolute',
    left: 16,
    marginHorizontal: 10,
    zIndex: 10,
    paddingHorizontal: 2,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 14,
    paddingBottom: 10,
  },
  currency: {
    fontSize: nf(16),
    marginRight: 4,
  },
  innerInput: {
    flex: 1,
    height: 56,
    fontSize: nf(16),
  },
  innerInputMultiline: {
    height: '100%',
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: nf(12),
  },
});

