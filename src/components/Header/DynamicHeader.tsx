import useTheme from '@/hooks/useTheme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText, { nf } from '../AppText';
import Icon from '../Icon';

type Variant = 'default' | 'back' | 'search' | 'custom';

interface DynamicHeaderProps {
  title?: string;
  variant?: Variant;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  style?: any;
}

export default function DynamicHeader({
  title,
  variant = 'back',
  onBack,
  rightComponent,
  leftComponent,
  style,
}: DynamicHeaderProps) {
  const { colors } = useTheme()
  const { goBack, canGoBack, navigate } = useNavigation<any>();

  return (
    <View className="flex-row items-center justify-evenly px-4 py-3" style={[{
    }, style]}>
      {/* Left */}
      <View className="flex-row items-center">
        {variant === 'back' && (
          <TouchableOpacity onPress={() => {
            if (onBack) {
              onBack();
              return;
            }
            canGoBack() ? goBack() : navigate('homescreen')
          }} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="ArrowLeft" size={24} color={colors?.textPrimary} />
          </TouchableOpacity>
        )}
        {leftComponent}
      </View>

      {/* Title */}
      <AppText className="text-lg font-bold flex-1 text-start" numberOfLines={2} ellipsizeMode="tail" style={{ maxWidth: '100%', textAlign: 'center', fontWeight: '700', fontSize: nf(16), color: colors?.textPrimary }}>
        {title}
      </AppText>

      {/* Right */}
      <View className="flex-row items-center">
        {variant === 'search' && (
          <TouchableOpacity>
            <Icon name="Search" size={22} color={colors?.textPrimary} />
          </TouchableOpacity>
        )}
        {rightComponent}
      </View>
    </View >
  );
}