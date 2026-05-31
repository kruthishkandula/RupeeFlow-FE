import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { useExpenseStore } from '@/store/useExpenseStore'
import { gpsw } from '@/style/theme'
import { TransactionType } from '@/typings/global'
import { capitalize } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { G, Path, Svg, Text as SvgText } from 'react-native-svg'
import MainBG from '../../components/Backgrounds/MainBG'
import DynamicHeader from '../../components/Header/DynamicHeader'
import AppText from '@/components/AppText'

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_SIZE = SCREEN_WIDTH * 0.55;
const CHART_RADIUS = CHART_SIZE / 2;
const DONUT_WIDTH = 38;

type Period = 'week' | 'month' | 'year';

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B',
  Travel: '#4ECDC4',
  Bills: '#45B7D1',
  Entertainment: '#96CEB4',
  Health: '#FFEAA7',
  Shopping: '#DDA0DD',
  Salary: '#98FB98',
  Education: '#F0E68C',
  Freelance: '#87CEEB',
  Investment: '#FFB347',
  Gift: '#FF69B4',
  Other: '#C0C0C0',
};

function getStartDate(period: Period): Date {
  const now = new Date();
  if (period === 'week') {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return new Date(now.getFullYear(), 0, 1);
}

function filterByPeriod(expenses: TransactionType[], period: Period): TransactionType[] {
  const start = getStartDate(period);
  return expenses.filter(e => new Date(e.date) >= start);
}

// ── Donut helpers ────────────────────────────────────────────────────────
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeDonutSlice(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startAngle: number, endAngle: number,
): string {
  const os = polarToCartesian(cx, cy, outerR, startAngle);
  const oe = polarToCartesian(cx, cy, outerR, endAngle);
  const ie = polarToCartesian(cx, cy, innerR, endAngle);
  const is_ = polarToCartesian(cx, cy, innerR, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${os.x} ${os.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${oe.x} ${oe.y}`,
    `L ${ie.x} ${ie.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${is_.x} ${is_.y}`,
    'Z',
  ].join(' ');
}

// ── Bar chart helpers ──────────────────────────────────────────────────────
function getBarLabels(period: Period): string[] {
  const now = new Date();
  if (period === 'week') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(now.getDate() - 6 + i);
      return d.toLocaleDateString('en', { weekday: 'short' });
    });
  }
  if (period === 'month') {
    const weeks: string[] = [];
    for (let i = 1; i <= 4; i++) weeks.push(`W${i}`);
    return weeks;
  }
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
}

function getBucketIndex(date: Date, period: Period, now: Date): number {
  if (period === 'week') {
    const start = getStartDate('week');
    const diff = Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(6, diff));
  }
  if (period === 'month') {
    const day = date.getDate();
    return Math.min(3, Math.floor((day - 1) / 7));
  }
  return date.getMonth();
}

function computeBuckets(transactions: TransactionType[], period: Period) {
  const labels = getBarLabels(period);
  const income = new Array(labels.length).fill(0);
  const expense = new Array(labels.length).fill(0);
  const now = new Date();
  transactions.forEach(t => {
    const idx = getBucketIndex(new Date(t.date), period, now);
    if (idx < 0 || idx >= labels.length) return;
    if (t.type === 'income') income[idx] += t.amount;
    else expense[idx] += t.amount;
  });
  return { labels, income, expense };
}

// ── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data }: Readonly<{ data: { label: string; value: number; color: string }[] }>) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = CHART_RADIUS;
  const cy = CHART_RADIUS;
  const outerR = CHART_RADIUS - 6;
  const innerR = CHART_RADIUS - DONUT_WIDTH;

  let cumAngle = 0;
  const slices = data.map(d => {
    const angle = (d.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...d, startAngle: start, endAngle: cumAngle };
  });

  let formatted = `Rs.${total}`;
  if (total >= 100000) formatted = `Rs.${(total / 100000).toFixed(1)}L`;
  else if (total >= 1000) formatted = `Rs.${(total / 1000).toFixed(1)}K`;

  return (
    <Svg width={CHART_SIZE} height={CHART_SIZE}>
      <G>
        {slices.map(slice => {
          if (slice.endAngle - slice.startAngle < 0.5) return null;
          const path = describeDonutSlice(cx, cy, outerR, innerR, slice.startAngle, slice.endAngle);
          return <Path key={slice.label} d={path} fill={slice.color} />;
        })}
        <SvgText x={cx} y={cy - 10} textAnchor="middle" fill="#888888" fontSize={13} fontWeight="400">
          Total
        </SvgText>
        <SvgText x={cx} y={cy + 12} textAnchor="middle" fill="#222222" fontSize={16} fontWeight="700">
          {formatted}
        </SvgText>
      </G>
    </Svg>
  );
}

// ── Bar Chart ───────────────────────────────────────────────────────────────
function BarChart({ labels, income, expense }: Readonly<{ labels: string[]; income: number[]; expense: number[] }>) {
  const { colors } = useTheme();
  const maxVal = Math.max(...income, ...expense, 1);
  const BAR_H = 110;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: BAR_H + 24, paddingHorizontal: 4 }}>
        {labels.map((label, i) => (
          <View key={label} style={{ alignItems: 'center', flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: BAR_H }}>
              <View style={{
                width: 8,
                height: Math.max(4, (income[i] / maxVal) * BAR_H),
                backgroundColor: '#4CAF50',
                borderRadius: 4,
              }} />
              <View style={{
                width: 8,
                height: Math.max(4, (expense[i] / maxVal) * BAR_H),
                backgroundColor: '#FF4C4C',
                borderRadius: 4,
              }} />
            </View>
            <AppText style={{ color: colors.textSecondary, fontSize: 10, marginTop: 4 }}>{label}</AppText>
          </View>
        ))}
      </View>
      {/* Legend */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 8, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#4CAF50' }} />
          <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>Income</AppText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#FF4C4C' }} />
          <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>Expense</AppText>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function Statistics() {
  const { colors } = useTheme();
  const { expenses, getStoreExpenses } = useExpenseStore();
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    getStoreExpenses();
  }, []);

  const filtered = useMemo(() => filterByPeriod(expenses, period), [expenses, period]);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let totalIncome = 0, totalExpense = 0;
    filtered.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpense += t.amount;
    });
    return { totalIncome, totalExpense, balance: totalIncome - totalExpense };
  }, [filtered]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
      const cat = capitalize(t.category);
      map[cat] = (map[cat] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value, color: CATEGORY_COLORS[label] || '#999' }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const { labels, income: incomeB, expense: expenseB } = useMemo(
    () => computeBuckets(filtered, period),
    [filtered, period],
  );

  const topExpense = filtered.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 3);

  const iconMap: Record<string, string> = {
    Food: 'UtensilsCrossed', Travel: 'Plane', Bills: 'Receipt',
    Entertainment: 'Film', Health: 'HeartPulse', Shopping: 'ShoppingBag',
    Salary: 'CircleEllipsis', Education: 'GraduationCap', Freelance: 'Briefcase',
    Investment: 'TrendingUp', Gift: 'Gift', Other: 'CircleEllipsis',
  };

  const totalExpensePie = categoryData.reduce((s, c) => s + c.value, 0);

  return (
    <MainBG>
      <SafeAreaContainer className='mt-8'>
        <DynamicHeader title='Statistics' />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, gap: 16 }}>

          {/* Period Selector */}
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, flexDirection: 'row', padding: 4 }]}>
            {PERIODS.map(p => (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPeriod(p.value)}
                style={[styles.periodTab, period === p.value && { backgroundColor: colors.primary }]}
              >
                <AppText style={{ color: period === p.value ? '#fff' : colors.textSecondary, fontWeight: '600', fontSize: 14 }}>
                  {p.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Summary Cards */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: 'Income', value: totalIncome, color: '#4CAF50', icon: 'ArrowDownLeft' as const },
              { label: 'Expense', value: totalExpense, color: '#FF4C4C', icon: 'ArrowUpRight' as const },
              { label: 'Balance', value: balance, color: colors.primary, icon: 'Wallet' as const },
            ].map(item => (
              <View key={item.label} style={[styles.summaryCard, { backgroundColor: colors.surfaceElevated, flex: 1 }]}>
                <Icon name={item.icon} size={18} color={item.color} />
                <AppText style={{ color: colors.textSecondary, fontSize: 11, marginTop: 4 }}>{item.label}</AppText>
                <AppText style={{ color: item.color, fontSize: 13, fontWeight: '700', marginTop: 2 }} numberOfLines={1}>
                  ₹{Math.abs(item.value).toLocaleString('en-IN')}
                </AppText>
              </View>
            ))}
          </View>

          {/* Bar Chart */}
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
            <AppText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Income vs Expense</AppText>
            <BarChart labels={labels} income={incomeB} expense={expenseB} />
          </View>

          {/* Donut Chart + Category Legend */}
          {categoryData.length > 0 ? (
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
              <AppText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Expenses by Category</AppText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <DonutChart data={categoryData} />
                <View style={{ flex: 1, gap: 8 }}>
                  {categoryData.slice(0, 5).map(cat => (
                    <View key={cat.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: cat.color, flexShrink: 0 }} />
                      <AppText style={{ color: colors.textSecondary, fontSize: 11, flex: 1 }} numberOfLines={1}>{cat.label}</AppText>
                      <AppText style={{ color: colors.textPrimary, fontSize: 11, fontWeight: '600' }}>
                        {totalExpensePie > 0 ? Math.round((cat.value / totalExpensePie) * 100) : 0}%
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated }]}>
              <AppText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Category Breakdown</AppText>
              <View style={{ gap: 14 }}>
                {categoryData.map(cat => {
                  const pct = totalExpensePie > 0 ? cat.value / totalExpensePie : 0;
                  return (
                    <View key={cat.label}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Icon name={(iconMap[cat.label] || 'CircleEllipsis') as any} size={18} color={cat.color} />
                          <AppText style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '500' }}>{cat.label}</AppText>
                        </View>
                        <AppText style={{ color: colors.textSecondary, fontSize: 13 }}>₹{cat.value.toLocaleString('en-IN')}</AppText>
                      </View>
                      <View style={{ height: 6, backgroundColor: colors.borderDefault, borderRadius: 3 }}>
                        <View style={{ height: 6, backgroundColor: cat.color, borderRadius: 3, width: `${Math.round(pct * 100)}%` }} />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Top Expenses */}
          {topExpense.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.surfaceElevated, marginBottom: 30 }]}>
              <AppText style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top Expenses</AppText>
              <View style={{ gap: 12 }}>
                {topExpense.map((t, i) => (
                  <View key={t.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={[styles.rank, { backgroundColor: colors.primary }]}>
                      <AppText style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>#{i + 1}</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }} numberOfLines={1}>{t.title}</AppText>
                      <AppText style={{ color: colors.textSecondary, fontSize: 12 }}>{capitalize(t.category)}</AppText>
                    </View>
                    <AppText style={{ color: '#FF4C4C', fontSize: 15, fontWeight: '700' }}>₹{t.amount.toLocaleString('en-IN')}</AppText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <View style={{ alignItems: 'center', marginTop: 60, gap: 12 }}>
              <Icon name="ChartNoAxesColumn" size={56} color={colors.textTertiary} />
              <AppText style={{ color: colors.textSecondary, fontSize: 16, textAlign: 'center' }}>
                No transactions found{'\n'}for this period
              </AppText>
            </View>
          )}
        </ScrollView>
      </SafeAreaContainer>
    </MainBG>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  periodTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: gpsw(16),
    fontWeight: '700',
    marginBottom: 14,
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
});