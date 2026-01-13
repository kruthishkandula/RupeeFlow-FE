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
import { ScrollView, Text, TouchableOpacity } from 'react-native';

const ChangeTheme = () => {
  const { isDefaultTheme } = useThemeStore();
  const { handleThemeSwitch, theme } = useThemeContextActions();
  const { colors } = useTheme();

  return (
    <MainBG>
      <SafeAreaContainer >
        <DynamicHeader title='Themes' />
        {/* list of themes */}
        <ScrollView contentContainerClassName='pb-12' className='flex px-4 flex-col gap-2 py-4'>
          {Object.entries({ 'System Default': 'System Default', ...Themes }).map(([t, v]: any) => {
            // System Default is selected if isDefaultTheme is true
            let isSelected = (t === 'System Default' && isDefaultTheme) || (t === theme && !isDefaultTheme);

            return (
              <TouchableOpacity
                activeOpacity={1}
                key={t}
                onPress={() => {
                  if (t === 'System Default') {
                    handleThemeSwitch('light', true); // true triggers system default
                  } else {
                    handleThemeSwitch(t, false); // false disables system default
                  }
                }}
                className={`bg-surfaceElevated flex-row gap-2 py-6 p-4 rounded-xl mt-2 elevation-md ${isSelected ? 'border-primary border-2 bg-surfaceOverlay' : 'border-black'}`}
              >
                <Icon name={isSelected ? 'Radio' : 'CloudRainWind'} size={24} color={colors.textPrimary} />
                <Text className='text-textPrimary'>{upperFirst(t)}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </SafeAreaContainer>
    </MainBG>
  );
};

export default ChangeTheme;