import DynamicHeader2 from '@/components/Header/DynamicHeader2'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import MainWalletCard from '@/components/Wallets/MainWallet'
import useTheme from '@/hooks/useTheme'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import MainBG from '../../components/Backgrounds/MainBG'

export default function Home() {
  const { colors, theme} = useTheme();

  const NotificationIcon = ({ count }: { count?: number | string }) => {
    count = count ? Number(count) > 9 ? '9+' : count : undefined;

    return (<TouchableOpacity>
      {count && <Text style={{
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: colors?.focusRing,
        color: colors?.textInverse,
        borderRadius: 24,
        padding: 2,
        zIndex: 2,
        width: 24,
        height: 24,
        fontSize: 14,
        textAlign: 'center',
      }} >{count || 0}</Text>}
      <Icon name="Bell" size={32} color={colors?.textInverse} />
    </TouchableOpacity>)
  }

  return (
    <MainBG>
      <SafeAreaContainer className='mt-8'>
        <DynamicHeader2 title='Good Morning,' subtitle='Kruthish Kandula' rightComponent={<NotificationIcon count={8} />} />
        <View className='flex px-6 mt-10' >
          <MainWalletCard balance={23000} income={12000} expense={13000} />
        </View>
        <View className='flex px-4' >
          <View className='flex-row items-center justify-between mt-10'>
            <Text style={{ color: colors?.textPrimary, fontSize: 18, fontFamily: 'Inter-SemiBold' }} >Transactions</Text>
            <Text style={{ color: colors?.textSecondary }} className='mt-2' >See All</Text>
          </View>
        </View>
      </SafeAreaContainer>
    </MainBG>
  )
}