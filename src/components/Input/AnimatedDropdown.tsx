import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import useTheme from '@/hooks/useTheme';

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

const ITEM_HEIGHT = 56;
const MAX_VISIBLE_ITEMS = 4;

export default function DropdownInput({
  label,
  value,
  options,
  onChange,
  error,
}: Props) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(1);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const scrollIndicatorAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const hasMoreItems = options.length > MAX_VISIBLE_ITEMS;
  const dropdownHeight = Math.min(options.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT;
  const thumbHeight = Math.max(28, (dropdownHeight / contentHeight) * dropdownHeight);
  const maxThumbOffset = Math.max(0, dropdownHeight - thumbHeight);

  const startBounce = () => {
    bounceAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: 5, duration: 350, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ]),
      { iterations: 3 },
    ).start();
  };

  const openDropdown = () => {
    setOpen(true);
    scrollIndicatorAnim.setValue(0);
    Animated.timing(rotateAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    if (hasMoreItems) {
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start(() =>
        startBounce(),
      );
    }
  };

  const closeDropdown = () => {
    setOpen(false);
    fadeAnim.setValue(0);
    Animated.timing(rotateAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  const toggle = () => (open ? closeDropdown() : openDropdown());

  const arrowRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const selectedLabel = options.find(o => o.value === value)?.label ?? '';

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const maxScroll = contentSize.height - layoutMeasurement.height;

    if (maxScroll > 0) {
      const progress = contentOffset.y / maxScroll;
      scrollIndicatorAnim.setValue(progress * maxThumbOffset);

      const atBottom = progress >= 0.98;
      Animated.timing(fadeAnim, {
        toValue: atBottom ? 0 : 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={styles.label}>{label}</Text>

      {/* Outer wrapper carries shadow; inner clips border-radius children */}
      <View style={[styles.shadow, open && styles.shadowOpen, error && styles.shadowError]}>
        <View style={[styles.container, error && styles.containerError]}>

          {/* Trigger row */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.inputRow, open && styles.inputRowOpen]}
            onPress={toggle}
          >
            <Text style={[styles.value, !selectedLabel && styles.placeholder]}>
              {selectedLabel || 'Select'}
            </Text>
            <Animated.Text style={[styles.arrow, { transform: [{ rotate: arrowRotate }] }]}>
              ▼
            </Animated.Text>
          </TouchableOpacity>

          {/* Dropdown list */}
          {open && (
            <View style={{ height: dropdownHeight }}>
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                bounces={false}
                onContentSizeChange={(_, h) => setContentHeight(h || 1)}
              >
                {options.map((item, index) => {
                  const selected = item.value === value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      activeOpacity={0.65}
                      style={[
                        styles.option,
                        index === 0 && styles.optionFirst,
                        selected && styles.selectedOption,
                      ]}
                      onPress={() => {
                        onChange?.(item.value);
                        closeDropdown();
                      }}
                    >
                      <View style={styles.optionInner}>
                        <Text style={[styles.optionText, selected && styles.selectedText]}>
                          {item.label}
                        </Text>
                        {selected && <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Custom scroll indicator track + thumb */}
              {hasMoreItems && (
                <View pointerEvents="none" style={[styles.scrollTrack, { height: dropdownHeight }]}>
                  <Animated.View
                    style={[
                      styles.scrollThumb,
                      {
                        height: thumbHeight,
                        backgroundColor: colors.primary,
                        transform: [{ translateY: scrollIndicatorAnim }],
                      },
                    ]}
                  />
                </View>
              )}

              {/* Fade + bounce hint for more items */}
              {hasMoreItems && (
                <Animated.View pointerEvents="none" style={[styles.fadeOverlay, { opacity: fadeAnim }]}>
                  <Animated.Text
                    style={[styles.scrollHintArrow, { color: colors.primary, transform: [{ translateY: bounceAnim }] }]}
                  >
                    ↓
                  </Animated.Text>
                </Animated.View>
              )}
            </View>
          )}
        </View>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    color: '#6B7280',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },

  shadow: {
    borderRadius: 16,
    backgroundColor: '#fff',
  },

  shadowOpen: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  shadowError: {
    shadowColor: '#EF4444',
    shadowOpacity: 0.15,
  },

  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  containerError: {
    borderColor: '#EF4444',
  },

  inputRow: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputRowOpen: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },

  value: {
    fontSize: 16,
    color: '#111827',
  },

  placeholder: {
    color: '#9CA3AF',
  },

  arrow: {
    fontSize: 13,
    color: '#6B7280',
  },

  option: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 20, // leave space for scroll indicator
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  optionFirst: {
    borderTopWidth: 0,
  },

  optionInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedOption: {
    backgroundColor: '#F0FDF4',
  },

  selectedText: {
    fontWeight: '600',
  },

  checkmark: {
    fontSize: 16,
    fontWeight: '700',
  },

  optionText: {
    fontSize: 15,
    color: '#111827',
  },

  scrollTrack: {
    position: 'absolute',
    right: 4,
    top: 0,
    width: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },

  scrollThumb: {
    width: 4,
    borderRadius: 2,
  },

  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollHintArrow: {
    fontSize: 18,
    fontWeight: '600',
  },

  error: {
    marginTop: 6,
    color: '#EF4444',
    fontSize: 12,
  },
});
