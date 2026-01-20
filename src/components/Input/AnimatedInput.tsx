import React, { useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

interface Props {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  keyboardType?: any;
}

export default function AnimatedInput({
  label,
  value,
  onChange,
  onBlur,
  error,
  keyboardType,
}: Props) {
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
      outputRange: ['#9CA3AF', '#2F7E79'],
    }),
  };

  return (
    <View style={styles.wrapper}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
      </Animated.Text>

      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        keyboardType={keyboardType}
        style={[
          styles.input,
          error && { borderColor: '#EF4444' },
        ]}
      />

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
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  input: {
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
});
