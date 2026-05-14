import Alert from '@/components/Alert/Alert'
import Icon from '@/components/Icon'
import useTheme from '@/hooks/useTheme'
import { useBudgetStore } from '@/store/useBudgetStore'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  CATEGORY_COLORS,
  CURRENCY,
  fmtFull,
  ICON_MAP,
} from './walletConstants'

// ── Animated progress bar ────────────────────────────────────────────────────
function ProgressBar({ pct, color }: Readonly<{ pct: number; color: string }>) {
  const anim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(anim, { toValue: Math.min(pct, 1), duration: 700, useNativeDriver: false }).start()
  }, [pct])
  const width = anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
  return (
    <View style={{ height: 7, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' }}>
      <Animated.View style={{ height: 7, borderRadius: 4, backgroundColor: color, width }} />
    </View>
  )
}

// ── Budget Modal ─────────────────────────────────────────────────────────────
interface BudgetModalProps {
  visible: boolean
  category: string
  current: number
  onClose: () => void
  onSave: (category: string, amount: number) => void
}
function BudgetModal({ visible, category, current, onClose, onSave }: Readonly<BudgetModalProps>) {
  const { colors } = useTheme()
  const [value, setValue] = useState(current > 0 ? String(current) : '')

  useEffect(() => {
    setValue(current > 0 ? String(current) : '')
  }, [category, current])

  const handleSave = () => {
    const num = Number.parseFloat(value)
    if (!num || num <= 0) {
      Alert.warning({ title: 'Invalid amount', message: 'Please enter a valid budget.' })
      return
    }
    onSave(category, num)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%' }}>
          <Pressable style={[styles.modalSheet, { backgroundColor: colors.surfaceBase }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Set Budget — {category}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>
              Enter your monthly spending limit for this category.
            </Text>
            <View style={[styles.inputRow, { borderColor: colors.borderDefault }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 18, marginRight: 6 }}>{CURRENCY}</Text>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                keyboardType="decimal-pad"
                value={value}
                onChangeText={setValue}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surfaceElevated, flex: 1 }]} onPress={onClose}>
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary, flex: 1 }]} onPress={handleSave}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}

const BudgetSeparator = () => <View style={{ height: 4 }} />

// ── Budget Row Item ──────────────────────────────────────────────────────────
type BudgetRowItem = {
  cat: string
  spent: number
  budget: number | undefined
}

interface BudgetTabProps {
  categories: string[]
  categorySpend: Record<string, number>
  totalExpense: number
  monthName: string
  year: number
}

export default function BudgetTab({
  categories,
  categorySpend,
  totalExpense,
  monthName,
  year,
}: Readonly<BudgetTabProps>) {
  const { colors } = useTheme()
  const { budgets, getStoreBudgets, setStoreBudget, removeStoreBudget } = useBudgetStore()
  const [modalCat, setModalCat] = useState<string | null>(null)

  useEffect(() => {
    getStoreBudgets()
  }, [])

  const saveBudget = useCallback(async (category: string, amount: number) => {
    await setStoreBudget(category, amount)
    Alert.success({ title: 'Budget saved!', message: `${category} budget set to ${fmtFull(amount)}.` })
  }, [setStoreBudget])

  const removeBudget = useCallback(async (category: string) => {
    await removeStoreBudget(category)
    Alert.info({ title: 'Budget removed', message: `${category} budget cleared.` })
  }, [removeStoreBudget])

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0)
  // Only count spending from categories that have a budget set
  const budgetedSpend = Object.keys(budgets).reduce((s, cat) => s + (categorySpend[cat] ?? 0), 0)
  const budgetUsedPct = totalBudget > 0 ? budgetedSpend / totalBudget : 0

  const items: BudgetRowItem[] = categories.map(cat => ({
    cat,
    spent: categorySpend[cat],
    budget: budgets[cat],
  }))

  const renderBudgetRow = ({ item }: { item: BudgetRowItem }) => {
    const { cat, spent, budget } = item
    const pct = budget ? spent / budget : 0
    const color = CATEGORY_COLORS[cat] || '#999'
    const over = !!budget && spent > budget

    return (
      <View
        style={[
          styles.budgetRow,
          { borderColor: over ? '#F59E0B' : colors.borderDefault, backgroundColor: over ? '#FFFFFFC6' : colors.surfaceElevated },
          over && styles.budgetRowOver,
        ]}>
        {/* Over-budget badge */}
        {over && (
          <View style={styles.overBanner}>
            <Icon name="TriangleAlert" size={12} color="#FDE68A" />
            <Text style={styles.overBannerText}>Over Budget</Text>
          </View>
        )}
        <View style={[styles.txIcon, { backgroundColor: over ? '#F59E0B18' : `${color}22` }]}>
          <Icon name={(ICON_MAP[cat] || 'CircleEllipsis') as any} size={20} color={over ? '#F59E0B' : color} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}>{cat}</Text>
            <View className='mt-4' style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              {!!budget && (
                <TouchableOpacity onPress={() => removeBudget(cat)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Icon name="Trash2" size={14} color={colors.textTertiary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setModalCat(cat)}>
                <View style={[styles.setBudgetBtn, { borderColor: over ? '#F59E0B' : colors.primary }]}>
                  <Text style={{ color: over ? '#F59E0B' : colors.primary, fontSize: 11, fontWeight: '700' }}>
                    {budget ? 'Edit' : 'Set'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: over ? '#F59E0B' : colors.textSecondary, fontSize: 12, fontWeight: over ? '600' : '400' }}>
              Spent: {fmtFull(spent)}
            </Text>
            {budget
              ? <Text style={{ color: over ? '#F59E0B' : '#4CAF50', fontSize: 12, fontWeight: '600' }}>
                Limit: {fmtFull(budget)}
              </Text>
              : <Text style={{ color: colors.textTertiary, fontSize: 12 }}>No limit set</Text>
            }
          </View>
          {!!budget && <ProgressBar pct={pct} color={over ? '#F59E0B' : color} />}
          {over && (
            <View style={styles.overPill}>
              <Icon name="TriangleAlert" size={11} color="#F59E0B" />
              <Text style={styles.overPillText}>Over by {fmtFull(spent - (budget ?? 0))}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  const ListHeader = () => (
    <>
      {/* Overall Budget Card */}
      {totalBudget > 0 && (
        <View className='mt-6' style={[styles.overallCard, { backgroundColor: budgetUsedPct > 1 ? '#92400E' : colors.primary }]}>
          {budgetUsedPct > 1 && (
            <View style={styles.overallWarnBanner}>
              <Icon name="TriangleAlert" size={14} color="#FDE68A" />
              <Text style={{ color: '#FDE68A', fontWeight: '600', fontSize: 13 }}>Budget limit reached</Text>
            </View>
          )}
          <Text style={styles.overallLabel}>Monthly Budget</Text>
          <Text style={styles.overallBalance}>{fmtFull(totalBudget)}</Text>
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: budgetUsedPct > 1 ? '600' : '400' }}>Spent {fmtFull(budgetedSpend)}</Text>
              <Text style={{ color: budgetUsedPct > 1 ? '#FDE68A' : 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' }}>
                {Math.round(budgetUsedPct * 100)}% used
              </Text>
            </View>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' }}>
              <View style={{
                height: 8, borderRadius: 4,
                backgroundColor: budgetUsedPct > 1 ? '#F59E0B' : '#fff',
                width: `${Math.min(100, Math.round(budgetUsedPct * 100))}%`,
              }} />
            </View>
            <Text style={{ color: budgetUsedPct > 1 ? '#FDE68A' : 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6, fontWeight: budgetUsedPct > 1 ? '600' : '400' }}>
              {budgetedSpend <= totalBudget
                ? `${fmtFull(totalBudget - budgetedSpend)} remaining`
                : `Over budget by ${fmtFull(budgetedSpend - totalBudget)}`}
            </Text>
          </View>
          <Text style={styles.overallPeriod}>{monthName} {year}</Text>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Category Budgets</Text>

      {categories.length === 0 && (
        <View style={{ alignItems: 'center', paddingVertical: 40, gap: 10 }}>
          <Icon name="PiggyBank" size={48} color={colors.textTertiary} />
          <Text style={{ color: colors.textSecondary, fontSize: 15, textAlign: 'center' }}>
            No spending categories this month yet.
          </Text>
        </View>
      )}
    </>
  )

  // eslint-disable-next-line react/no-unstable-nested-components
  const ListFooter = () => (
    <View style={[styles.tipCard, { backgroundColor: `${colors.primary}18`, borderColor: `${colors.primary}44` }]}>
      <Icon name="Lightbulb" size={18} color={colors.primary} />
      <Text style={{ color: colors.textSecondary, fontSize: 13, flex: 1 }}>
        Tap <Text style={{ fontWeight: '700', color: colors.textPrimary }}>Set</Text> next to a category to define a monthly spending limit.
      </Text>
    </View>
  )

  return (
    <>
      <FlatList
        data={items}
        keyExtractor={item => item.cat}
        renderItem={renderBudgetRow}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={BudgetSeparator}
      />

      {!!modalCat && (
        <BudgetModal
          visible
          category={modalCat}
          current={budgets[modalCat] || 0}
          onClose={() => setModalCat(null)}
          onSave={saveBudget}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 16, paddingBottom: 110, gap: 0 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  txIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: 0.5,
    borderRadius: 12,
  },
  setBudgetBtn: {
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tipCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    marginTop: 16,
  },
  overallCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  overallLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  overallBalance: { color: '#fff', fontSize: 32, fontWeight: '800' },
  overallPeriod: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 12, alignSelf: 'flex-end' },
  overallWarnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },
  budgetRowOver: {
    borderWidth: 1.5,
  },
  overBanner: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
  },
  overBannerText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  overPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B18',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  overPillText: { color: '#F59E0B', fontSize: 11, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 36 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  input: { flex: 1, fontSize: 22, fontWeight: '700' },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
})
