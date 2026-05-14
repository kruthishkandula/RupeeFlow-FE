import Alert from '@/components/Alert/Alert';
import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import DynamicHeader from '@/components/Header/DynamicHeader';
import Icon from '@/components/Icon';
import AnimatedInput from '@/components/Input/AnimatedInput';
import CalendarDropdown from '@/components/Input/CalendarDropdown';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { CATEGORY_COLORS, CATEGORY_ICON_MAP, EXPENSE_CATEGORIES, INCOME_CATEGORIES, QUICK_AMOUNTS } from '@/fixtures/constants';
import { useExpenseStore } from '@/store/useExpenseStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ExpenseForm = {
    category: string;
    title: string;
    amount: string;
    type: 'income' | 'expense';
    note: string;
    date: Date;
};


// Indian-style formatting helpers
function formatAmount(raw: string): string {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    let intPart = parts[0];
    const decPart = parts.length > 1 ? '.' + parts[1] : '';
    if (intPart.length > 3) {
        const last3 = intPart.slice(-3);
        const rest = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
        intPart = rest + ',' + last3;
    }
    return intPart + decPart;
}
function getRawValue(formatted: string): string {
    return formatted.replaceAll(',', '');
}

function TypeToggle({ value, onChange }: Readonly<{ value: string; onChange: (v: string) => void }>) {
    const incomeAnim = useRef(new Animated.Value(value === 'income' ? 1 : 0)).current;

    const handlePress = (type: 'income' | 'expense') => {
        Animated.timing(incomeAnim, {
            toValue: type === 'income' ? 1 : 0,
            duration: 220,
            useNativeDriver: false,
        }).start();
        onChange(type);
    };

    const sliderLeft = incomeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '50%'],
    });
    const sliderColor = incomeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#EF4444', '#22C55E'],
    });

    return (
        <View style={styles.toggleTrack}>
            <Animated.View style={[styles.toggleSlider, { left: sliderLeft, backgroundColor: sliderColor }]} />
            {(['expense', 'income'] as const).map((type) => (
                <TouchableOpacity
                    key={type}
                    activeOpacity={0.8}
                    style={styles.toggleOption}
                    onPress={() => handlePress(type)}
                >
                    <Text style={[
                        styles.toggleText,
                        value === type && styles.toggleTextActive,
                    ]}>
                        {type === 'income' ? '📈 Income' : '📉 Expense'}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

function CategoryGrid({ value, onChange, error, type }: Readonly<{ value: string; onChange: (v: string) => void; error?: string; type: string }>) {
    const list = (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => ({ label: c, value: c }));
    return (
        <View style={styles.categoryWrapper}>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryGrid}>
                {list.map((cat) => {
                    const selected = value === cat.value;
                    const color = CATEGORY_COLORS[cat.value] || '#9CA3AF';
                    const iconName = (CATEGORY_ICON_MAP[cat.value] || 'Ellipsis') as any;
                    return (
                        <TouchableOpacity
                            key={cat.value}
                            activeOpacity={0.75}
                            onPress={() => onChange(cat.value)}
                            style={[
                                styles.categoryItem,
                                selected && { borderColor: color, borderWidth: 2, backgroundColor: color + '22' },
                            ]}
                        >
                            <View style={[styles.categoryIconBg, { backgroundColor: selected ? color : color + '33' }]}>
                                <Icon name={iconName} size={18} color={selected ? '#fff' : color} />
                            </View>
                            <Text
                                numberOfLines={1}
                                style={[styles.categoryLabel, selected && { color, fontWeight: '700' }]}
                            >
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

export default function AddExpenseScreen() {
    const { goBack, pop } = useNavigation<any>();
    const { params } = useRoute<any>();
    const {
        control,
        handleSubmit,
        formState: { isValid },
        watch,
        setValue,
    } = useForm<ExpenseForm>({
        defaultValues: {
            category: params?.category || '',
            title: params?.title || '',
            amount: String(params?.amount) || '',
            type: params?.type || 'expense',
            note: params?.note || '',
            date: params?.date ? new Date(params.date) : new Date(),
        },
    });
    const { addStoreExpense, updateStoreExpense, expenses } = useExpenseStore();
    const type = watch('type');
    const amount = watch('amount');
    const isEditing = Boolean(params?.amount);
    const accentColor = type === 'income' ? '#22C55E' : '#EF4444';

    const allTimeBalance = useMemo(() => {
        let inc = 0, exp = 0;
        expenses.forEach(t => {
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
        });
        return inc - exp;
    }, [expenses]);

    const enteredAmount = Number.parseFloat(amount) || 0;
    const showBalanceWarn = type === 'expense' && enteredAmount > 0 && enteredAmount > allTimeBalance;

    // Clear category when switching type, since lists differ
    const prevType = useRef(type);
    useEffect(() => {
        if (prevType.current !== type) {
            prevType.current = type;
            setValue('category', '');
        }
    }, [type, setValue]);

    const onUpdate = async (data: ExpenseForm) => {
        try {
            await updateStoreExpense({
                id: params?.id,
                title: data.title,
                amount: Number.parseFloat(data.amount),
                type: data?.type,
                date: data.date.toISOString(),
                category: data.category,
                note: data.note,
            });
            Alert.success({ title: 'Updated!', message: `Your __${data.type}__ updated successfully.`, position: 'top' });
            pop(2);
        } catch {
            Alert.error({ title: 'Error!', message: 'Something went wrong. Please try updating again.', position: 'top' });
        }
    };

    const onSubmit = async (data: ExpenseForm) => {
        try {
            await addStoreExpense({
                id: Date.now().toString(),
                title: data.title,
                amount: Number.parseFloat(data.amount),
                type: data?.type,
                date: data.date.toISOString(),
                category: data.category,
                note: data.note,
            });
            Alert.success({ title: 'Saved!', message: `Your __${data.type}__ added successfully.`, position: 'top' });
            goBack();
        } catch {
            Alert.error({ title: 'Error!', message: 'Something went wrong. Please try again.', position: 'top' });
        }
    };

    return (
        <MainBG>
            <SafeAreaContainer className='mt-8 bg-transparent'>
                <DynamicHeader title={isEditing ? 'Edit Transaction' : 'New Transaction'} />

                <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

                    {/* Type toggle */}
                    <View style={styles.section}>
                        <Controller
                            control={control}
                            name="type"
                            render={({ field }) => (
                                <TypeToggle value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </View>

                    {/* Amount hero */}
                    <View style={[styles.amountCard, { borderColor: accentColor + '55', shadowColor: accentColor }]}>
                        <Text style={[styles.amountLabel, { color: accentColor }]}>Amount (₹)</Text>
                        <Controller
                            control={control}
                            name="amount"
                            rules={{
                                required: 'Amount is required',
                                pattern: { value: /^\d+(\.\d{0,2})?$/, message: 'Enter a valid amount' },
                            }}
                            render={({ field, fieldState }) => (
                                <>
                                    <View style={styles.amountRow}>
                                        <Text style={[styles.currencySymbol, { color: accentColor }]}>₹</Text>
                                        <TextInput
                                            style={[styles.amountTextInput, { color: accentColor }]}
                                            value={formatAmount(field.value ?? '')}
                                            onChangeText={(text) => {
                                                const raw = getRawValue(text);
                                                // allow only digits and single dot with max 2 decimals
                                                const dotIdx = raw.indexOf('.');
                                                if (dotIdx !== -1 && raw.length - dotIdx - 1 > 2) return;
                                                if (/^\d*\.?\d*$/.test(raw)) field.onChange(raw);
                                            }}
                                            onBlur={field.onBlur}
                                            keyboardType="decimal-pad"
                                            placeholder="0"
                                            placeholderTextColor="#D1D5DB"
                                            cursorColor={accentColor}
                                            selectionColor={accentColor}
                                        />
                                    </View>
                                    {fieldState.error && (
                                        <Text style={styles.errorText}>{fieldState.error.message}</Text>
                                    )}
                                    {/* Quick amount chips */}
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
                                        {QUICK_AMOUNTS.map((amt) => (
                                            <TouchableOpacity
                                                key={amt}
                                                style={[styles.chip, { borderColor: accentColor, backgroundColor: field.value === amt ? accentColor : 'transparent' }]}
                                                onPress={() => field.onChange(amt)}
                                                activeOpacity={0.75}
                                            >
                                                <Text style={[styles.chipText, { color: field.value === amt ? '#fff' : accentColor }]}>
                                                    ₹{Number(amt).toLocaleString('en-IN')}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </>
                            )}
                        />
                    </View>

                    {/* Balance warning */}
                    {showBalanceWarn && (
                        <View style={styles.warnBanner}>
                            <Icon name="TriangleAlert" size={16} color="#92400E" />
                            <Text style={styles.warnText}>
                                This expense (₹{enteredAmount.toLocaleString('en-IN')}) exceeds your current balance of ₹{allTimeBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.
                            </Text>
                        </View>
                    )}

                    {/* Category grid */}
                    <View style={[styles.glassCard, styles.mx4]}>
                        <Controller
                            control={control}
                            name="category"
                            rules={{ required: 'Category required' }}
                            render={({ field, fieldState }) => (
                                <CategoryGrid
                                    value={field.value}
                                    onChange={(v) => {
                                        setValue('title', v); // default title to category for convenience
                                        field.onChange(v);
                                    }}
                                    error={fieldState.error?.message}
                                    type={type}
                                />
                            )}
                        />
                    </View>

                    {/* Details card */}
                    <View style={[styles.glassCard, styles.mx4, { marginTop: 12 }]}>
                        <Text style={styles.sectionLabel}>Details</Text>

                        <Controller
                            control={control}
                            name="title"
                            rules={{
                                required: 'Title required',
                                minLength: { value: 2, message: 'Minimum 2 characters' },
                            }}
                            render={({ field, fieldState }) => (
                                <AnimatedInput
                                    label="Title"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    error={fieldState.error?.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="date"
                            rules={{ required: 'Date required' }}
                            render={({ field, fieldState }) => (
                                <CalendarDropdown
                                    label="Date"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    maxDate={new Date()}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <AnimatedInput
                                    label="Note (optional)"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </View>

                    {/* Save button */}
                    <View style={[styles.mx4, { marginTop: 20 }]}>
                        <Button
                            title={isEditing ? `Update ${type}` : `Save ${type}`}
                            disabled={!isValid}
                            onPress={handleSubmit(isEditing ? onUpdate : onSubmit)}
                            className='rounded-3xl'
                            style={{ backgroundColor: isValid ? accentColor : undefined }}
                        />
                    </View>

                </KeyboardAwareScrollView>
            </SafeAreaContainer>
        </MainBG>
    );
}


export const styles = StyleSheet.create({
    mx4: {
        marginHorizontal: 16,
    },
    section: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
    },
    // Type toggle
    toggleTrack: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderRadius: 50,
        overflow: 'hidden',
        height: 48,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    toggleSlider: {
        position: 'absolute',
        width: '50%',
        height: '100%',
        borderRadius: 50,
    },
    toggleOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.75)',
    },
    toggleTextActive: {
        color: '#fff',
    },
    // Amount card
    amountCard: {
        marginHorizontal: 16,
        marginTop: 14,
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 2,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 14,
        elevation: 6,
    },
    amountLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        fontSize: 28,
        fontWeight: '700',
        marginRight: 4,
    },
    amountTextInput: {
        flex: 1,
        fontSize: 36,
        fontWeight: '700',
        paddingVertical: 4,
    },
    chipsRow: {
        marginTop: 8,
        flexDirection: 'row',
    },
    chip: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    // Category grid
    categoryWrapper: {
        paddingBottom: 4,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 12,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    categoryItem: {
        width: '22%',
        alignItems: 'center',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 4,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    categoryIconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    categoryLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: '#4B5563',
        textAlign: 'center',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 6,
    },
    warnBanner: {
        marginHorizontal: 16,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#FEF3C7',
        borderWidth: 1,
        borderColor: '#F59E0B',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    warnText: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: '#92400E',
        lineHeight: 18,
    },
    // Glass card
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        padding: 20,
        marginTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
});
