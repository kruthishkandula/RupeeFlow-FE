import useTheme from '@/hooks/useTheme';
import { gpsh } from '@/style/theme';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';

type Variant = 'default' | 'back' | 'search' | 'custom';

interface DynamicHeaderProps {
  title?: string;
  subtitle?: string;
  variant?: Variant;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  style?: any;
}

export default function DynamicHeader({
  title,
  subtitle,
  variant = 'back',
  onBack,
  rightComponent,
  leftComponent,
  style,
}: DynamicHeaderProps) {
  const { colors } = useTheme()
  const { goBack, canGoBack, navigate } = useNavigation<any>();

  

  return (
    <View className="flex-row items-start justify-between px-4 py-3" style={[{
    }, style]}>
      <View className="flex-col items-start">
        <Text className="text-sm font-bold text-start" numberOfLines={2} ellipsizeMode="tail" style={{ maxWidth: '100%', textAlign: 'center', fontWeight: '500', fontSize: gpsh(12), color: colors?.white }}>
          {title}
        </Text>
        <Text className="text-md font-bold text-start" numberOfLines={2} ellipsizeMode="tail" style={{ maxWidth: '100%', textAlign: 'center', fontWeight: '700', fontSize: gpsh(16), color: colors?.white }}>
          {subtitle}
        </Text>
      </View>

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