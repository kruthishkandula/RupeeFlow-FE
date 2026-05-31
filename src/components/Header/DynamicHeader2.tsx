import useTheme from '@/hooks/useTheme';
import { gpsh } from '@/style/theme';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText, { nf } from '../AppText';
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
}: Readonly<DynamicHeaderProps>) {
  const { colors } = useTheme()


  return (
    <View className="flex-row items-start justify-between px-4 py-3" style={[{
    }, style]}>
      <View className="flex-col items-start">
        <AppText className="text-sm font-bold text-start" numberOfLines={2} ellipsizeMode="tail" style={{ maxWidth: '100%', textAlign: 'center', fontWeight: '500', fontSize: nf(24), color: colors?.white, lineHeight: nf(32) }}>
          {title}
        </AppText>
        <AppText className="text-md font-bold text-start" numberOfLines={2} ellipsizeMode="tail" style={{ maxWidth: '100%', textAlign: 'center', fontWeight: '700', fontSize: nf(32), color: colors?.white, lineHeight: nf(38) }}>
          {subtitle}
        </AppText>
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