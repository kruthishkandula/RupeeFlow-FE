import AppText from '@/components/AppText'
import TranscationCard from '@/components/Cards/TranscationCard'
import DynamicHeader2 from '@/components/Header/DynamicHeader2'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { useAuthStore } from '@/store/useAuthStore'
import { useExpenseStore } from '@/store/useExpenseStore'
import { TransactionType } from '@/typings/global'
import { useNavigation } from '@react-navigation/native'
import { capitalize } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import Animated from 'react-native-reanimated'
import MainBG from '../../components/Backgrounds/MainBG'
import BudgetTab from './BudgetTab'
import {
  CATEGORY_COLORS,
  fmt,
  fmtFull,
  ICON_MAP,
} from './walletConstants'

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
const OverviewSeparator = () => <View style={{ height: 14 }} />

// ── Section types for FlatList ────────────────────────────────────────────────
type SectionItem =
  | { type: 'walletCard' }
  | { type: 'quickStats' }
  | { type: 'categorySpending' }
  | { type: 'recentHeader' }
  | { type: 'transaction'; data: TransactionType }
  | { type: 'empty' }

export default function Wallet() {
  const { colors } = useTheme()
  const { navigate } = useNavigation<any>()
  const { expenses, getStoreExpenses } = useExpenseStore()
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'budget'>('overview')

  useEffect(() => {
    getStoreExpenses()
  }, [])

  const now = new Date()
  const monthName = now.toLocaleString('en', { month: 'long' })

  const currentMonth = useMemo(() => {
    return expenses.filter(e => {
      const d = new Date(e.date)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    })
  }, [expenses])

  const { totalIncome, totalExpense, categorySpend } = useMemo(() => {
    let totalIncome = 0, totalExpense = 0
    const categorySpend: Record<string, number> = {}
    currentMonth.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount
      else {
        totalExpense += t.amount
        const cat = capitalize(t.category)
        categorySpend[cat] = (categorySpend[cat] || 0) + t.amount
      }
    })
    return { totalIncome, totalExpense, categorySpend }
  }, [currentMonth])

  const allTimeBalance = useMemo(() => {
    let inc = 0, exp = 0
    expenses.forEach(t => {
      if (t.type === 'income') inc += t.amount
      else exp += t.amount
    })
    return inc - exp
  }, [expenses])

  const categories = useMemo(
    () => Object.keys(categorySpend).sort((a, b) => categorySpend[b] - categorySpend[a]),
    [categorySpend],
  )

  const recentTransactions = useMemo(
    () => [...currentMonth].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
    [currentMonth],
  )

  // Build flat section data for the overview FlatList
  const overviewData = useMemo((): SectionItem[] => {
    const items: SectionItem[] = [
      { type: 'walletCard' },
      { type: 'quickStats' },
    ]
    if (categories.length > 0) items.push({ type: 'categorySpending' })
    if (recentTransactions.length > 0) {
      items.push({ type: 'recentHeader' })
      recentTransactions.forEach(t => items.push({ type: 'transaction', data: t }))
    }
    if (currentMonth.length === 0) items.push({ type: 'empty' })
    return items
  }, [categories, recentTransactions, currentMonth])

  // ── Render helpers ──────────────────────────────────────────────────────────
  const renderWalletCard = () => (
    <View style={[styles.walletCard, { backgroundColor: colors.primary }]}>
      <View style={styles.walletCardBadge}>
        <AppText style={styles.walletCardBadgeText}>Main Wallet</AppText>
      </View>
      <AppText style={styles.walletLabel}>Total Balance</AppText>
      <AppText style={styles.walletBalance}>{allTimeBalance < 0 ? '-' : ''}{fmtFull(allTimeBalance)}</AppText>
      <View style={styles.walletRow}>
        <View style={styles.walletStat}>
          <Icon name="ArrowDownLeft" size={16} color="#fff" />
          <AppText style={styles.walletStatLabel}>Income</AppText>
          <AppText style={styles.walletStatGreen}>{fmt(totalIncome)}</AppText>
        </View>
        <View style={styles.walletDivider} />
        <View style={styles.walletStat}>
          <Icon name="ArrowUpRight" size={16} color="#fff" />
          <AppText style={styles.walletStatLabel}>Expense</AppText>
          <AppText style={styles.walletStatRed}>{fmt(totalExpense)}</AppText>
        </View>
      </View>
      <AppText style={styles.walletPeriod}>{monthName} {now.getFullYear()}</AppText>
    </View>
  )

  const renderQuickStats = () => (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {[
        { label: 'Transactions', value: String(currentMonth.length), icon: 'List' as const, color: colors.primary },
        { label: 'Avg / day', value: fmt(totalExpense / Math.max(1, now.getDate())), icon: 'CalendarDays' as const, color: '#FF6B6B' },
        { label: 'Categories', value: String(categories.length), icon: 'LayoutGrid' as const, color: '#4ECDC4' },
      ].map(s => (
        <View key={s.label} style={[styles.quickCard, { backgroundColor: colors.surfaceElevated, flex: 1 }]}>
          <Icon name={s.icon} size={18} color={s.color} />
          <AppText style={{ color: colors.textSecondary, fontSize: 10, marginTop: 4 }}>{s.label}</AppText>
          <AppText style={{ color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginTop: 2 }} numberOfLines={1}>{s.value}</AppText>
        </View>
      ))}
    </View>
  )

  const renderCategorySpending = () => (
    <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
      <AppText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Spending by Category</AppText>
      <View style={{ gap: 14 }}>
        {categories.map(cat => {
          const spent = categorySpend[cat]
          const color = CATEGORY_COLORS[cat] || '#999'
          const pct = spent / (totalExpense || 1)
          return (
            <View key={cat}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Icon name={(ICON_MAP[cat] || 'CircleEllipsis') as any} size={18} color={color} />
                <AppText style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600', marginLeft: 8, flex: 1 }}>{cat}</AppText>
                <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>{fmtFull(spent)}</AppText>
              </View>
              <View style={{ height: 6, backgroundColor: colors.borderDefault, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: color, width: `${Math.round(pct * 100)}%` }} />
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )

  const renderRecentHeader = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <AppText style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 0 }]}>Recent Transactions</AppText>
      <TouchableOpacity onPress={() => navigate('Transactions')}>
        <AppText style={{ color: colors.textSecondary, fontSize: 13 }}>See all</AppText>
      </TouchableOpacity>
    </View>
  )

  const renderTransaction = (item: TransactionType) => {
    return (
      <TranscationCard key={`transaction-${item.id}`} data={item} />
    )
  }

  const renderEmpty = () => (
    <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
      <Icon name="Wallet" size={56} color={colors.textTertiary} />
      <AppText style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>
        No transactions this month
      </AppText>
    </View>
  )

  const renderOverviewItem = ({ item }: { item: SectionItem }) => {
    switch (item.type) {
      case 'walletCard': return renderWalletCard()
      case 'quickStats': return renderQuickStats()
      case 'categorySpending': return renderCategorySpending()
      case 'recentHeader': return renderRecentHeader()
      case 'transaction': return renderTransaction(item.data)
      case 'empty': return renderEmpty()
      default: return null
    }
  }

  const greetingMessage = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    else if (hour < 18) return 'Good Afternoon'
    else return 'Good Evening'
  }, [])

  return (
    <MainBG>
      <SafeAreaContainer className="mt-8">
        <DynamicHeader2
          title={greetingMessage}
          subtitle={user?.displayName || 'RupeeFlow User'}
          rightComponent={
            <TouchableOpacity>
              <Icon name="Bell" size={32} color={colors.white} />
            </TouchableOpacity>
          }
        />

        {/* Tab Bar */}
        <View style={[styles.tabBar, { backgroundColor: colors.surfaceElevated }]}>
          {(['overview', 'budget'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && { backgroundColor: colors.primary }]}
              onPress={() => setActiveTab(tab)}
            >
              <AppText style={{ color: activeTab === tab ? '#fff' : colors.textSecondary, fontWeight: '600', fontSize: 14 }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'overview' ? (
          <>
            <FlatList
              data={overviewData}
              keyExtractor={(item, index) => `${item.type}-${index}`}
              renderItem={renderOverviewItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scroll}
              ItemSeparatorComponent={OverviewSeparator}
            />
            {/* add expense btn */}
            <AnimatedPressable
              activeOpacity={0.8}
              onPress={() => {
                navigate('AddExpense');
              }}
              style={[styles.floatingButton, { backgroundColor: `${colors.textPrimary}80` }]}
            >
              <Icon name="Plus" size={32} color={colors.textInverse} strokeWidth={3} />
            </AnimatedPressable>
          </>
        ) : (
          <BudgetTab
            categories={categories}
            categorySpend={categorySpend}
            totalExpense={totalExpense}
            monthName={monthName}
            year={now.getFullYear()}
          />
        )}
      </SafeAreaContainer>
    </MainBG>
  )
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 110, paddingHorizontal: 16, paddingTop: 4 },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  walletCard: {
    marginTop: 8,
    borderRadius: 20,
    padding: 20,
    paddingTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  walletCardBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFAB7B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 14,
  },
  walletCardBadgeText: { fontSize: 11, fontWeight: '600', color: '#000' },
  walletLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  walletBalance: { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: 0.5 },
  walletRow: { flexDirection: 'row', marginTop: 16, gap: 16 },
  walletStat: { flex: 1, gap: 2 },
  walletStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  walletStatGreen: { color: '#A8FFAD', fontSize: 16, fontWeight: '700' },
  walletStatRed: { color: '#FFB3B3', fontSize: 16, fontWeight: '700' },
  walletDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: 2 },
  walletPeriod: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 12, alignSelf: 'flex-end' },
  quickCard: { borderRadius: 12, padding: 12, alignItems: 'flex-start' },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
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
    zIndex: 10,
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})

