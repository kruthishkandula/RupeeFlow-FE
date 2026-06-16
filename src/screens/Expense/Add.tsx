import Alert from '@/components/Alert/Alert';
import AppText, { nf } from '@/components/AppText';
import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import DynamicHeader from '@/components/Header/DynamicHeader';
import Icon from '@/components/Icon';
import AnimatedInput from '@/components/Input/AnimatedInput';
import CalendarDropdown from '@/components/Input/CalendarDropdown';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import TypeToggle, { TypeToggleOption } from '@/components/TypeToggle';
import { CATEGORY_COLORS, CATEGORY_ICON_MAP, EXPENSE_CATEGORIES, INCOME_CATEGORIES, QUICK_AMOUNTS } from '@/fixtures/constants';
import useTheme from '@/hooks/useTheme';
import { useExpenseStore } from '@/store/useExpenseStore';
import { ALLOW_FONT_SCALING } from '@/utility/config';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
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

const TYPE_TOGGLE_OPTIONS: ReadonlyArray<TypeToggleOption<ExpenseForm['type']>> = [
    { value: 'expense', label: '📉 Expense', activeColor: '#EF4444' },
    { value: 'income', label: '📈 Income', activeColor: '#22C55E' },
];

function CategoryGrid({ value, onChange, error, type }: Readonly<{ value: string; onChange: (v: string) => void; error?: string; type: string }>) {
    const list = (type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(c => ({ label: c, value: c }));
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.categoryWrapper]}>
            <AppText style={[styles.sectionLabel, { color: colors?.textPrimary }]}>Category</AppText>
            <View style={styles.categoryGrid}>
                {list.map((cat) => {
                    const selected = value === cat.value;
                    const color = CATEGORY_COLORS[cat.value] || '#9CA3AF';
                    const iconName = (CATEGORY_ICON_MAP[cat.value] || 'Ellipsis') as any;
                    const itemBg = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.6)';
                    const itemBorder = isDark ? 'rgba(255,255,255,0.18)' : 'transparent';

                    let iconBg = color + '22';
                    if (selected) {
                        iconBg = color;
                    } else if (isDark) {
                        iconBg = 'rgba(255,255,255,0.08)';
                    }

                    let iconBorder = 'transparent';
                    if (!selected) {
                        iconBorder = isDark ? color + '99' : color + '55';
                    }
                    const labelColor = selected ? color : colors?.textSecondary;

                    return (
                        <TouchableOpacity
                            key={cat.value}
                            activeOpacity={0.75}
                            onPress={() => onChange(cat.value)}
                            style={[
                                styles.categoryItem,
                                { backgroundColor: itemBg, borderColor: itemBorder, borderWidth: 1.5 },
                                selected && { borderColor: color, borderWidth: 2, backgroundColor: color + '22' },
                            ]}
                        >
                            <View
                                style={[
                                    styles.categoryIconBg,
                                    {
                                        backgroundColor: iconBg,
                                        borderWidth: selected ? 0 : 1,
                                        borderColor: iconBorder,
                                    },
                                ]}
                            >
                                <Icon
                                    name={iconName}
                                    size={18}
                                    color={selected ? '#fff' : color}
                                    strokeWidth={selected ? 2.4 : 2.6}
                                />
                            </View>
                            <AppText
                                numberOfLines={1}
                                style={[styles.categoryLabel, { color: labelColor }, selected && { fontWeight: '700', }]}
                            >
                                {cat.label}
                            </AppText>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <AppText style={styles.errorText}>{error}</AppText>}
        </View>
    );
}

export default function AddExpenseScreen() {
    const { goBack, pop } = useNavigation<any>();
    const { params } = useRoute<any>();
    const {
        control,
        handleSubmit,
        formState: { isValid, isDirty },
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
    const isEditing = Boolean(params?.id);
    const accentColor = type === 'income' ? '#22C55E' : '#EF4444';
    const { colors } = useTheme();
    const now = useMemo(() => new Date(), []);

    const currentMonthBalance = useMemo(() => {
        let inc = 0, exp = 0;
        expenses.forEach(t => {
            const d = new Date(t.date);
            const isCurrentMonth = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            if (!isCurrentMonth) return;
            if (t.type === 'income') inc += t.amount;
            else exp += t.amount;
        });
        return inc - exp;
    }, [expenses, now]);

    const originalTransaction = useMemo(
        () => expenses.find((t) => t.id === params?.id),
        [expenses, params?.id],
    );

    const originalType = originalTransaction?.type ?? params?.type;
    const originalAmount = Number(originalTransaction?.amount ?? params?.amount ?? 0);
    const originalDate = originalTransaction?.date ?? params?.date;
    const originalDateObj = originalDate ? new Date(originalDate) : null;
    const originalInCurrentMonth = originalDateObj
        ? originalDateObj.getFullYear() === now.getFullYear() && originalDateObj.getMonth() === now.getMonth()
        : false;
    let originalContribution = 0;
    if (isEditing && originalInCurrentMonth) {
        originalContribution = originalType === 'income' ? originalAmount : -originalAmount;
    }
    const effectiveBalance = currentMonthBalance - originalContribution;

    const enteredAmount = Number.parseFloat(amount) || 0;
    const showBalanceWarn = type === 'expense' && enteredAmount > 0 && enteredAmount > effectiveBalance;

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
            Alert.error({ title: 'Update error', message: 'Failed to update, Please try again.', position: 'top' });
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
                                <TypeToggle
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={TYPE_TOGGLE_OPTIONS}
                                />
                            )}
                        />
                    </View>

                    {/* Amount hero */}
                    <View style={[styles.amountCard, { borderColor: accentColor + '55', shadowColor: accentColor, backgroundColor: colors?.surfaceOverlay }]}>
                        <AppText style={[styles.amountLabel, { color: accentColor }]}>Amount (₹)</AppText>
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
                                        <AppText style={[styles.currencySymbol, { color: accentColor }]}>₹</AppText>
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
                                            allowFontScaling={ALLOW_FONT_SCALING}
                                        />
                                    </View>
                                    {fieldState.error && (
                                        <AppText style={styles.errorText}>{fieldState.error.message}</AppText>
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
                                                <AppText style={[styles.chipText, { color: field.value === amt ? '#fff' : accentColor }]}>
                                                    ₹{Number(amt).toLocaleString('en-IN')}
                                                </AppText>
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
                            <AppText style={styles.warnText}>
                                This expense (₹{enteredAmount.toLocaleString('en-IN')}) exceeds your current balance of ₹{effectiveBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}.
                            </AppText>
                        </View>
                    )}

                    {/* Category grid */}
                    <View style={[styles.glassCard, styles.mx4, { backgroundColor: colors.surfaceOverlay }]}>
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
                    <View style={[styles.glassCard, styles.mx4, { marginTop: 12, backgroundColor: colors.surfaceOverlay }]}>
                        <AppText style={[styles.sectionLabel, { color: colors.textPrimary }]}>Details</AppText>

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
                            render={({ field, fieldState }) => (
                                <AnimatedInput
                                    label="Note (optional)"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    inputHeight={200}
                                    multiline
                                    autoCorrect={false}
                                    spellCheck={false}
                                    numberOfLines={8}
                                />
                            )}
                        />
                    </View>

                    {/* Save button */}
                    <View style={[styles.mx4, { marginTop: 20 }]}>
                        <Button
                            title={isEditing ? `Update ${type}` : `Save ${type}`}
                            disabled={!isValid || !isDirty}
                            onPress={handleSubmit(isEditing ? onUpdate : onSubmit)}
                            className='rounded-3xl'
                            style={{ backgroundColor: isValid && isDirty ? accentColor : undefined }}
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
        fontSize: nf(12),
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
        fontSize: nf(28),
        fontWeight: '700',
        marginRight: 4,
    },
    amountTextInput: {
        flex: 1,
        fontSize: nf(36),
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
        fontSize: nf(10),
        fontWeight: '600',
    },
    // Category grid
    categoryWrapper: {
        paddingBottom: 4,
    },
    sectionLabel: {
        fontSize: nf(13),
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
        fontSize: nf(10),
        fontWeight: '500',
        color: '#4B5563',
        textAlign: 'center',
    },
    errorText: {
        color: '#EF4444',
        fontSize: nf(12),
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
        fontSize: nf(12),
        fontWeight: '600',
        color: '#92400E',
        lineHeight: nf(18),
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
