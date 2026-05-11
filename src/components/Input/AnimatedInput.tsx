import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

interface Props {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  keyboardType?: any;
  amount?: boolean;
  currency?: string;
}

// Formats a raw numeric string into "1 23 456.78" (Indian-style space grouping)
function formatAmount(raw: string): string {
  // Remove anything that's not digit or dot
  let cleaned = raw.replaceAll(/[^0-9.]/g, '');
  // Allow only one dot
  const parts = cleaned.split('.');
  let intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  // Indian grouping: last 3 digits, then groups of 2
  if (intPart.length > 3) {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const grouped = rest.replaceAll(/\B(?=(\d{2})+(?!\d))/g, ' ');
    intPart = grouped + ' ' + last3;
  }

  return intPart + decPart;
}

// Strips spaces to get the raw numeric value for onChange
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
}: Readonly<Props>) {
  const animated = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const labelStyle = {
    top: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animated.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['#000000', '#2F7E79'],
    }),
  };

  return (
    <View style={styles.wrapper}>
      <Animated.Text style={[styles.label, labelStyle, { color: error ? '#EF4444' : labelStyle.color }]}>
        {label}
      </Animated.Text>

      <View style={[styles.input, styles.inputRow, error ? { borderColor: '#EF4444' } : null]}>
        <TextInput
          value={amount ? formatAmount(value ?? '') : value}
          onChangeText={(text) => {
            if (amount) {
              // Block commas, allow only digits and single dot, max 2 decimals
              const filtered = text.replaceAll(',', '');
              const raw = getRawValue(filtered);
              // Restrict to 2 decimal places
              const dotIndex = raw.indexOf('.');
              if (dotIndex !== -1 && raw.length - dotIndex - 1 > 2) return;
              onChange?.(raw);
            } else {
              onChange?.(text);
            }
          }}
          onBlur={onBlur}
          keyboardType={amount ? 'decimal-pad' : keyboardType}
          style={styles.innerInput}
          cursorColor="#2F7E79"
          selectionColor="#2F7E79"
        />
        {amount && <Text style={styles.currency}>{currency}</Text>}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 22,
  },
  label: {
    position: 'absolute',
    left: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 6,
    zIndex: 10,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  currency: {
    fontSize: 16,
    color: '#000000',
    marginRight: 4,
  },
  innerInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: '#000000',
  },
  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
});
