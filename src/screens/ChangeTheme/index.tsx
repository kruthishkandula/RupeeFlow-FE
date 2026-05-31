import AppText, { nf } from '@/components/AppText';
import MainBG from '@/components/Backgrounds/MainBG';
import DynamicHeader from '@/components/Header/DynamicHeader';
import Icon from '@/components/Icon';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useTheme from '@/hooks/useTheme';
import { useThemeStore } from '@/store/theme/themeStore';
import { useThemeContextActions } from '@/Themes';
import { Themes } from '@/Themes/theme-config';
import { upperFirst } from 'lodash';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const THEME_META: Record<string, { emoji: string; description: string; palette: string[] }> = {
  'System Default': {
    emoji: '🌗',
    description: 'Follows your device setting',
    palette: ['#FFFFFF', '#121212'],
  },
  light: {
    emoji: '☀️',
    description: 'Clean, bright look',
    palette: ['#2F7E79', '#FFFFFF', '#F5F5F5', '#8AD93B'],
  },
  dark: {
    emoji: '🌙',
    description: 'Easy on the eyes at night',
    palette: ['#2F7E79', '#121212', '#1E1E1E', '#A0E65C'],
  },
  xmas: {
    emoji: '🎄',
    description: 'Festive holiday vibes',
    palette: ['#BB2528', '#146B3A', '#D4AF37', '#FFF8E7'],
  },
};

const ChangeTheme = () => {
  const { isDefaultTheme } = useThemeStore();
  const { handleThemeSwitch, theme } = useThemeContextActions();
  const { colors, isDark } = useTheme();

  const allThemes = [['System Default', 'System Default'], ...Object.entries(Themes)];

  return (
    <MainBG>
      <SafeAreaContainer>
        <DynamicHeader title='Themes' />
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          <AppText style={{ color: colors.textSecondary, fontSize: nf(13), marginBottom: 16, marginLeft: 4 }}>
            Choose how RupeeFlow looks to you
          </AppText>
          {allThemes.map(([t]) => {
            const isSelected = (t === 'System Default' && isDefaultTheme) || (t === theme && !isDefaultTheme);
            const meta = THEME_META[t] ?? { emoji: '🎨', description: '', palette: ['#2F7E79'] };

            return (
              <TouchableOpacity
                key={t}
                activeOpacity={0.75}
                onPress={() => {
                  if (t === 'System Default') {
                    handleThemeSwitch('light', true);
                  } else {
                    handleThemeSwitch(t as any, false);
                  }
                }}
                style={{
                  backgroundColor: isSelected
                    ? (isDark ? '#2F7E7925' : '#2F7E7912')
                    : colors.surfaceBase,
                  borderRadius: 20,
                  padding: 18,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : colors.borderSubtle,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}>
                {/* Emoji */}
                <View style={{
                  width: 52, height: 52, borderRadius: 16,
                  backgroundColor: colors.surfaceElevated,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <AppText style={{ fontSize: nf(26) }}>{meta.emoji}</AppText>
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <AppText style={{ color: colors.textPrimary, fontSize: nf(16), fontWeight: '700' }}>
                    {upperFirst(t)}
                  </AppText>
                  <AppText style={{ color: colors.textSecondary, fontSize: nf(12), marginTop: 2 }}>
                    {meta.description}
                  </AppText>
                  {/* Color palette dots */}
                  <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                    {meta.palette.map((c, i) => (
                      <View key={i} style={{
                        width: 16, height: 16, borderRadius: 8,
                        backgroundColor: c,
                        borderWidth: 1, borderColor: colors.borderDefault,
                      }} />
                    ))}
                  </View>
                </View>

                {/* Checkmark */}
                <View style={{
                  width: 28, height: 28, borderRadius: 14,
                  backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: isSelected ? 0 : 1.5,
                  borderColor: colors.borderDefault,
                }}>
                  {isSelected && <Icon name='Check' size={16} color='#fff' />}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaContainer>
    </MainBG>
  );
};

export default ChangeTheme;