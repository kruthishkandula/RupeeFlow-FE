import MainWalletCard from '@/components/Cards/MainWallet'
import TranscationCard from '@/components/Cards/TranscationCard'
import DynamicHeader2 from '@/components/Header/DynamicHeader2'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { useExpenseStore } from '@/store/useExpenseStore'
import { gpsw } from '@/style/theme'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useMemo } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated from 'react-native-reanimated'
import MainBG from '../../components/Backgrounds/MainBG'
import Empty from '@/components/Organisms/Empty'


const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Home() {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);
  const { navigate } = useNavigation<any>();
  const { expenses, getStoreExpenses } = useExpenseStore();

  const { balance, income, expense } = useMemo(() => {
    let income = 0, expense = 0;
    expenses.forEach((t) => {
      if (t.type === 'income') income += t.amount;
      else if (t.type === 'expense') expense += t.amount;
    });
    console.log('balance caluclated')
    return {
      balance: income - expense,
      income,
      expense,
    }
  }, [expenses.length]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getStoreExpenses()
    setRefreshing(false);
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

  useEffect(() => {
    getStoreExpenses();
  }, [expenses.length])

  return (
    <MainBG>
      <SafeAreaContainer className='mt-8 flex'>
        <DynamicHeader2 title='Good Morning,' subtitle='Kruthish Kandula' rightComponent={<NotificationIcon count={0} />} />
        <View className='flex-0.5 px-6 mt-10' >
          <MainWalletCard balance={balance} income={income} expense={expense} />
        </View>
        <View className='flex-1 px-4 gap-4 mb-2' >
          {/* Transaction History Title */}
          <View className='flex-row items-center justify-between mt-10 border-b-[0.5px] border-textPrimary pb-2'>
            <Text style={{ color: colors?.textPrimary, fontSize: gpsw(18), fontWeight: '700' }} >Transaction History</Text>
            <Pressable onPress={() => navigate('Transactions')} >
              <Text style={{ color: colors?.textSecondary, fontSize: gpsw(14), fontWeight: '400' }} className='mt-2' >See All</Text>
            </Pressable>
          </View>
          {/* Transactions List */}
          <FlatList
            contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
            style={{ flex: 1, flexGrow: 1 }}
            data={expenses?.slice(0, 4)}
            showsVerticalScrollIndicator={false}
            contentContainerClassName='gap-4'
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }: any) => {
              return (
                <TranscationCard key={`transaction-${item.id}`} data={item} />
              )
            }}
            ListEmptyComponent={<Empty />}
            keyExtractor={({ id }) => id}
          />
        </View>

        {/* add expense btn */}
        <AnimatedPressable
          activeOpacity={0.8}
          onPress={() => {
            navigate('AddExpense');
          }}
          style={[styles.floatingButton, { backgroundColor: `${colors.overlay}1A` }]}
        >
          <Icon name="Plus" size={32} color={colors.surfaceElevated} strokeWidth={3} />
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
    borderRadius: 50,
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})