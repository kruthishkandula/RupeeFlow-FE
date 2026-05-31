import { CATEGORY_COLORS, CATEGORY_ICON_MAP, fmtFull } from '@/fixtures/constants';
import useTheme from '@/hooks/useTheme';
import { useExpenseStore } from '@/store/useExpenseStore';
import { TransactionType } from '@/typings/global';
import { useNavigation } from '@react-navigation/native';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import AppText from '../AppText';
import Icon from '../Icon';

type TranscationCardProps = TransactionType;

export default function TranscationCard({
    data,
}: Readonly<{ data: TranscationCardProps }>) {
    const { colors } = useTheme();
    const { navigate } = useNavigation<any>();
    const { deleteStoreExpense, getStoreExpenses } = useExpenseStore();
    const [menuVisible, setMenuVisible] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const scaleAnim = React.useRef(new Animated.Value(0.85)).current;

    const cat = capitalize(data.category);
    const color = CATEGORY_COLORS[cat] || '#999';
    const d = new Date(data.date);
    const now = new Date();

    let display_date: string;
    if (d.toDateString() === now.toDateString()) {
        display_date = 'Today';
    } else if (d.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
        display_date = 'Yesterday';
    } else {
        display_date = `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}, ${d.getFullYear()}`;
    }

    const openMenu = () => {
        setConfirming(false);
        scaleAnim.setValue(0.85);
        setMenuVisible(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            bounciness: 8,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.85,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setMenuVisible(false);
            setConfirming(false);
        });
    };

    const handleDelete = async () => {
        await deleteStoreExpense(data.id);
        getStoreExpenses();
        setMenuVisible(false);
        setConfirming(false);
    };

    return (
        <>
            <Pressable
                style={[styles.row, { borderColor: colors.borderSubtle ?? '#E5E7EB', backgroundColor: colors.surfaceBase }]}
                onPress={() => navigate('ExpenseDetail', data)}
                onLongPress={openMenu}
                delayLongPress={350}
                android_ripple={{ color: `${color}22` }}
            >
                <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
                    <Icon name={(CATEGORY_ICON_MAP[cat] || 'CircleEllipsis') as any} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                    <AppText style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>{data.title}</AppText>
                    <AppText style={[styles.subtitle, { color: colors.textSecondary }]}>{cat} · {display_date}</AppText>
                </View>
                <AppText style={[styles.amount, { color: data.type === 'income' ? '#4CAF50' : '#FF4C4C' }]}>
                    {data.type === 'income' ? '+' : '-'}{fmtFull(data.amount)}
                </AppText>
            </Pressable>

            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <Pressable style={styles.backdrop} onPress={closeMenu}>
                    <Animated.View
                        style={[styles.menu, { backgroundColor: colors.surfaceElevated, transform: [{ scale: scaleAnim }] }]}
                        // prevent taps inside menu from closing via backdrop
                        onStartShouldSetResponder={() => true}
                    >
                        {/* Transaction summary */}
                        <View style={[styles.menuHeader, { borderBottomColor: colors.borderSubtle }]}>
                            <View style={[styles.menuIcon, { backgroundColor: `${color}22` }]}>
                                <Icon name={(CATEGORY_ICON_MAP[cat] || 'CircleEllipsis') as any} size={22} color={color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText style={[styles.menuTitle, { color: colors.textPrimary }]} numberOfLines={1}>{data.title}</AppText>
                                <AppText style={[styles.menuSub, { color: colors.textSecondary }]}>{cat} · {display_date}</AppText>
                            </View>
                            <AppText style={[styles.menuAmount, { color: data.type === 'income' ? '#4CAF50' : '#FF4C4C' }]}>
                                {data.type === 'income' ? '+' : '-'}{fmtFull(data.amount)}
                            </AppText>
                        </View>

                        {confirming ? (
                            /* Delete confirmation */
                            <View style={styles.confirmSection}>
                                <Icon name="TriangleAlert" size={28} color="#EF4444" />
                                <AppText style={[styles.confirmTitle, { color: colors.textPrimary }]}>Delete transaction?</AppText>
                                <AppText style={[styles.confirmSub, { color: colors.textSecondary }]}>
                                    This action cannot be undone.
                                </AppText>
                                <View style={styles.confirmButtons}>
                                    <TouchableOpacity
                                        style={[styles.confirmBtn, { backgroundColor: colors.borderDefault }]}
                                        activeOpacity={0.8}
                                        onPress={() => setConfirming(false)}
                                    >
                                        <AppText style={[styles.confirmBtnText, { color: colors.textPrimary }]}>No, keep it</AppText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.confirmBtn, styles.deleteBtn]}
                                        activeOpacity={0.8}
                                        onPress={handleDelete}
                                    >
                                        <Icon name="Trash2" size={15} color="#fff" />
                                        <AppText style={[styles.confirmBtnText, { color: '#fff' }]}>Yes, delete</AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            /* Action list */
                            <>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    activeOpacity={0.7}
                                    onPress={() => { closeMenu(); navigate('ExpenseDetail', data); }}
                                >
                                    <Icon name="Eye" size={18} color={colors.textPrimary} />
                                    <AppText style={[styles.menuItemText, { color: colors.textPrimary }]}>View details</AppText>
                                </TouchableOpacity>

                                <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    activeOpacity={0.7}
                                    onPress={() => setConfirming(true)}
                                >
                                    <Icon name="Trash2" size={18} color="#EF4444" />
                                    <AppText style={[styles.menuItemText, { color: '#EF4444' }]}>Delete</AppText>
                                </TouchableOpacity>

                                <View style={[styles.divider, { backgroundColor: colors.borderSubtle }]} />

                                <TouchableOpacity
                                    style={styles.menuItem}
                                    activeOpacity={0.7}
                                    onPress={closeMenu}
                                >
                                    <Icon name="X" size={18} color={colors.textSecondary} />
                                    <AppText style={[styles.menuItemText, { color: colors.textSecondary }]}>Cancel</AppText>
                                </TouchableOpacity>
                            </>
                        )}
                    </Animated.View>
                </Pressable>
            </Modal>
        </>
    );
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 0.5,
    },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    amount: {
        fontSize: 15,
        fontWeight: '700',
    },
    // Modal
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    menu: {
        width: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    menuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderBottomWidth: 0.5,
    },
    menuIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTitle: { fontSize: 15, fontWeight: '700' },
    menuSub: { fontSize: 12, marginTop: 2 },
    menuAmount: { fontSize: 15, fontWeight: '700' },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    menuItemText: {
        fontSize: 15,
        fontWeight: '600',
    },
    divider: {
        height: 0.5,
        marginHorizontal: 16,
    },
    // Confirm section
    confirmSection: {
        alignItems: 'center',
        padding: 24,
        gap: 8,
    },
    confirmTitle: {
        fontSize: 17,
        fontWeight: '700',
        marginTop: 4,
    },
    confirmSub: {
        fontSize: 13,
        marginBottom: 8,
    },
    confirmButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
        width: '100%',
    },
    confirmBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 13,
        borderRadius: 14,
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
    },
    confirmBtnText: {
        fontSize: 14,
        fontWeight: '700',
    },
});