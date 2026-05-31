import AppText, { nf } from '@/components/AppText'
import MainBG from '@/components/Backgrounds/MainBG'
import DynamicHeader from '@/components/Header/DynamicHeader'
import Icon from '@/components/Icon'
import SafeAreaContainer from '@/components/SafeAreaContainer'
import useTheme from '@/hooks/useTheme'
import { APP_VERSION } from '@/utility/config'
import React, { useState } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'

const FEATURES = [
    {
        icon: 'TrendingUp',
        label: 'Track Income & Expenses',
        color: '#10B981',
        description: `RupeeFlow lets you log every rupee that comes in or goes out.\n\n• Add transactions with title, amount, category and date\n• Tag entries as **Income** or **Expense**\n• View a full history with filters\n• Edit or delete any transaction at any time`,
    },
    {
        icon: 'PieChart',
        label: 'Visual Spending Statistics',
        color: '#3B82F6',
        description: `Get a clear picture of where your money is going.\n\n• Category-wise breakdown charts\n• Monthly income vs expense comparison\n• Balance trend over time\n• Identify your biggest spending areas at a glance`,
    },
    {
        icon: 'Target',
        label: 'Budget Management',
        color: '#F59E0B',
        description: `Set spending limits per category and stay on track.\n\n• Define a budget for Food, Transport, Entertainment and more\n• Visual progress bars show how much you've used\n• Get warned when you're close to the limit\n• Budgets are personal — each account has its own`,
    },
    {
        icon: 'Moon',
        label: 'Dark & Custom Themes',
        color: '#8B5CF6',
        description: `Make the app look exactly how you want it.\n\n• Light mode for daytime use\n• Dark mode for night-friendly viewing\n• Xmas theme for the festive season\n• System Default follows your device setting\n• Theme preference is saved and persists across sessions`,
    },
    {
        icon: 'Lock',
        label: 'Secure Firebase Auth',
        color: '#EF4444',
        description: `Your account and data are protected by Firebase.\n\n• Email & password sign-in\n• Each user sees only their own data\n• Secure token-based session management\n• Data is isolated per account — no cross-user leakage\n• Logout clears all local state immediately`,
    },
    {
        icon: 'Database',
        label: 'Local SQLite Storage',
        color: '#2F7E79',
        description: `All your transactions are stored locally on your device using SQLite.\n\n• Works offline — no internet needed to view data\n• Fast reads and writes with no cloud latency\n• Data is scoped per user via user_id\n• Theme and preferences persisted with MMKV`,
    },
]

function FeatureCard({ item, colors, isDark, open, onToggle }: Readonly<{ item: typeof FEATURES[0]; colors: any; isDark: boolean; open: boolean; onToggle: () => void }>) {

    const renderDescription = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (!line.trim()) return <View key={i} style={{ height: 6 }} />
            const parts = line.split(/\*\*(.*?)\*\*/g)
            return (
                <AppText key={i} style={{ color: colors.textSecondary, fontSize: nf(13), lineHeight: 20 }}>
                    {parts.map((p, j) =>
                        j % 2 === 1
                            ? <AppText key={j} style={{ color: colors.textPrimary, fontWeight: '700' }}>{p}</AppText>
                            : p
                    )}
                </AppText>
            )
        })
    }

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onToggle}
            style={{
                marginHorizontal: 16, marginBottom: 10, borderRadius: 20,
                backgroundColor: colors.surfaceBase,
                borderWidth: open ? 1.5 : 1,
                borderColor: open ? item.color + '60' : (isDark ? '#2a2a2a' : '#F0F0F0'),
                overflow: 'hidden',
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}>
                <View style={{
                    width: 44, height: 44, borderRadius: 14,
                    backgroundColor: `${item.color}18`,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <AppText style={{ flex: 1, color: colors.textPrimary, fontSize: nf(15), fontWeight: '700' }}>
                    {item.label}
                </AppText>
                <View style={{
                    width: 26, height: 26, borderRadius: 13,
                    backgroundColor: open ? `${item.color}20` : (isDark ? '#2a2a2a' : '#F5F5F5'),
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon
                        name={open ? 'ChevronUp' : 'ChevronDown'}
                        size={15}
                        color={open ? item.color : colors.textSecondary}
                    />
                </View>
            </View>
            {open && (
                <View style={{
                    paddingHorizontal: 18, paddingBottom: 18,
                    borderTopWidth: 1, borderTopColor: isDark ? '#2a2a2a' : '#F5F5F5',
                    paddingTop: 14,
                }}>
                    {renderDescription(item.description)}
                </View>
            )}
        </TouchableOpacity>
    )
}

export default function About() {
    const { colors, isDark } = useTheme()
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <MainBG>
            <SafeAreaContainer className='flex-1'>
                <DynamicHeader title='About' />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    <View style={{
                        margin: 16, borderRadius: 24, padding: 28,
                        backgroundColor: colors.surfaceBase, alignItems: 'center',
                        flex: 1,
                    }}>
                        <View style={{
                            width: 80, height: 80, borderRadius: 24,
                            backgroundColor: `${colors?.primary}18`,
                            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                        }}>
                            <AppText style={{ fontSize: nf(36), color: colors?.primary }}>₹</AppText>
                        </View>
                        <AppText style={{ color: colors.textPrimary, fontSize: nf(24), fontWeight: '800' }}>RupeeFlow</AppText>
                        <AppText style={{ color: colors.textSecondary, fontSize: nf(13), marginTop: 4, textAlign: 'center', minWidth: 200, alignSelf: 'center' }}>Version {APP_VERSION}</AppText>
                        <View style={{
                            marginTop: 14, paddingHorizontal: 16, paddingVertical: 6,
                            backgroundColor: '#2F7E7918', borderRadius: 20,
                        }}>
                            <AppText style={{ color: '#2F7E79', fontSize: nf(12), fontWeight: '600' }}>Personal Finance Tracker</AppText>
                        </View>
                    </View>

                    {FEATURES.map((f, i) => (
                        <FeatureCard key={i} item={f} colors={colors} isDark={isDark} open={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
                    ))}

                    <AppText style={{ color: colors.textTertiary, fontSize: nf(12), textAlign: 'center', marginTop: 16 }}>
                        Made with ❤️ · © {new Date().getFullYear()} RupeeFlow
                    </AppText>
                </ScrollView>
            </SafeAreaContainer>
        </MainBG>
    )
}
