import MainWalletCard from '@/components/Cards/MainWallet'
import TranscationCard from '@/components/Cards/TranscationCard'
import DynamicHeader2 from '@/components/Header/DynamicHeader2'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import { TransactionsData } from '@/fixtures/data'
import useTheme from '@/hooks/useTheme'
import { gpsw } from '@/style/theme'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import MainBG from '../../components/Backgrounds/MainBG'


const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Home() {
  const { colors, theme } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const { navigate } = useNavigation<any>();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate a network request
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const NotificationIcon = ({ count }: { count?: number | string }) => {
    count = count ? Number(count) > 9 ? '9+' : count : undefined;

    return (<TouchableOpacity>
      {count && <Text style={{
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: colors?.focusRing,
        color: colors?.white,
        borderRadius: 24,
        padding: 2,
        zIndex: 2,
        width: 24,
        height: 24,
        fontSize: 14,
        textAlign: 'center',
      }} >{count || 0}</Text>}
      <Icon name="Bell" size={32} color={colors?.white} />
    </TouchableOpacity>)
  }

  return (
    <MainBG>
      <SafeAreaContainer className='mt-8'>
        <DynamicHeader2 title='Good Morning,' subtitle='Kruthish Kandula' rightComponent={<NotificationIcon count={8} />} />
        <View className='flex px-6 mt-10' >
          <MainWalletCard balance={23000} income={12000} expense={13000} />
        </View>
        <View className='flex px-4 gap-4' >
          {/* Transaction History Title */}
          <View className='flex-row items-center justify-between mt-10 border-b-[0.5px] border-textPrimary pb-2'>
            <Text style={{ color: colors?.textPrimary, fontSize: gpsw(18), fontWeight: '700' }} >Transaction History</Text>
            <Text style={{ color: colors?.textSecondary, fontSize: gpsw(14), fontWeight: '400' }} className='mt-2' >See All</Text>
          </View>
          {/* Transactions List */}
          <View className='w-full h-full' >
            {
              <FlatList
                data={TransactionsData}
                contentContainerClassName='gap-4'
                refreshing={refreshing}
                onRefresh={onRefresh}
                renderItem={({ item }: any) => {
                  return (
                    <TranscationCard key={`transaction-${item.id}`} data={item} />
                  )
                }}
                keyExtractor={({ id }) => id}
              />
            }
          </View>
        </View>

        {/* add expense btn */}
        <AnimatedPressable
          activeOpacity={0.8}
          onPress={() => {
            navigate('AddExpense');
          }}
          style={[styles.floatingButton, { backgroundColor: colors.focusRing }]}
        >
          <Icon name="Send" size={16} color={colors.white} />
          <AnimatedText entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={{ color: colors.white }}>
            Create
          </AnimatedText>
        </AnimatedPressable>
      </SafeAreaContainer>
    </MainBG>
  )
}


const styles = StyleSheet.create({
  floatingButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 120,
    right: 20,
    alignSelf: 'flex-end',
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    zIndex: 10,
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
})