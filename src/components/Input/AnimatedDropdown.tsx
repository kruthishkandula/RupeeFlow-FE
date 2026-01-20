import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  value?: string;
  options: Option[];
  onChange?: (value: string) => void;
  error?: string;
}

const ITEM_HEIGHT = 48;
const MAX_VISIBLE_ITEMS = 4;

export default function DropdownInput({
  label,
  value,
  options,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const rotate = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setOpen(prev => !prev);

    Animated.timing(rotate, {
      toValue: open ? 0 : 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const arrowRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const selectedLabel =
    options.find(o => o.value === value)?.label || '';

  const dropdownHeight =
    Math.min(options.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;

  return (
    <View style={{ marginBottom: 22 }}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Unified input + list */}
      <View
        style={[
          styles.container,
          error && { borderColor: '#EF4444' },
        ]}
      >
        {/* Input */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.inputRow}
          onPress={toggle}
        >
          <Text
            style={[
              styles.value,
              !selectedLabel && { color: '#9CA3AF' },
            ]}
          >
            {selectedLabel || 'Select'}
          </Text>

          <Animated.Text
            style={[
              styles.arrow,
              { transform: [{ rotate: arrowRotate }] },
            ]}
          >
            ▼
          </Animated.Text>
        </TouchableOpacity>

        {/* Dropdown list */}
        {open && (
          <View style={{ height: dropdownHeight }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
            >
              {options.map(item => {
                const selected =
                  item.value === value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.option,
                      selected &&
                        styles.selectedOption,
                    ]}
                    onPress={() => {
                      onChange?.(item.value);
                      setOpen(false);
                      rotate.setValue(0);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected &&
                          styles.selectedText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: '#6B7280',
    fontSize: 13,
    marginLeft: 6,
  },

  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  inputRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  value: {
    fontSize: 16,
    color: '#111827',
  },

  arrow: {
    fontSize: 14,
    color: '#6B7280',
  },

  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },

  selectedOption: {
    backgroundColor: '#F3F4F6',
  },

  selectedText: {
    fontWeight: '600',
  },

  optionText: {
    fontSize: 15,
    color: '#111827',
  },

  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
});
