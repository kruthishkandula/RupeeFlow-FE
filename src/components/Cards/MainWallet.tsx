import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../Icon';
import AppText from '../AppText';

interface MainWalletCardProps {
  balance?: number;
  income?: number;
  expense?: number;
  currency?: string;
}

const formatAmount = (amount: number | undefined, currency: string) => {
  if (amount === undefined) return `${currency}0`;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-IN');
  return `${amount < 0 ? '-' : ''}${currency}${formatted}`;
}

export default function MainWalletCard({ balance = 0, income = 0, expense = 0, currency = '₹' }: MainWalletCardProps) {

  return (
    <View style={styles.container} >
      {/* header */}
      <View style={styles.header} >
        <AppText style={styles.headerTitle} >Main Wallet</AppText>
      </View>

      <View className='flex-row justify-between' >
        <AppText style={styles.title} >Total Balance</AppText>
        <Icon name='Ellipsis' size={24} color='white' />
      </View>
      <AppText style={styles.balance} >{formatAmount(balance, currency)}</AppText>
      <View className='flex-row justify-between mt-4' >
        <View className='items-start'>
          <View className='flex-row items-center gap-1' >
            <Icon name='ArrowDownLeft' size={16} color='white' />
            <AppText style={styles.income} >Income</AppText>
          </View>
          <AppText style={styles.incomeAmount} >{formatAmount(income, currency)}</AppText>
        </View>
        <View className='items-start' >
          <View className='flex-row items-center gap-1' >
            <Icon name='ArrowUpRight' size={16} color='white' />
            <AppText style={styles.expense} >Expense</AppText>
          </View>
          <AppText style={styles.expenseAmount} >{formatAmount(expense, currency)}</AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: '#2F7E79',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFAB7B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0000',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: 'white',
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  income: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  expense: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
})