import Alert from '@/components/Alert/Alert';
import AppText, { nf } from '@/components/AppText';
import Button from '@/components/Button';
import DynamicHeader from '@/components/Header/DynamicHeader';
import Icon from '@/components/Icon';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { CATEGORY_COLORS, CATEGORY_ICON_MAP, fmtFull } from '@/fixtures/constants';
import useTheme from '@/hooks/useTheme';
import { useExpenseStore } from '@/store/useExpenseStore';
import { dynamicErrorAlert } from '@/utility/alert';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    View
} from 'react-native';

export default function ExpenseDetail() {
    const { colors } = useTheme();
    const { params } = useRoute<any>();
    const { deleteStoreExpense } = useExpenseStore();
    const { goBack, navigate } = useNavigation<any>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isCredit = params?.type === 'income';
    const cat = capitalize(params?.category);
    const catColor = CATEGORY_COLORS[cat] || '#999';
    const catIcon = (CATEGORY_ICON_MAP[cat] || 'CircleEllipsis') as any;

    const handleEdit = async () => {
        try {
            navigate('AddExpense', { ...params });
        } catch (error) {
            return dynamicErrorAlert(error);
        }
    };

    const confirmDelete = async () => {
        try {
            setShowDeleteModal(false);
            const res = await deleteStoreExpense(params?.id);
            if (res?.success) {
                Alert.success({ title: 'Deleted!', message: 'The transaction was deleted successfully.' });
                goBack();
            }
        } catch (error) {
            return dynamicErrorAlert(error);
        }
    };

    console.log('params?.note', params?.note)

    return (
        <SafeAreaContainer style={{ backgroundColor: colors.surfaceOverlay }}>
            <DynamicHeader title='Transaction Details' />

            <View style={styles.content}>
                {/* Hero amount card */}
                <View style={[styles.heroCard, { backgroundColor: colors.surfaceElevated }]}>
                    <View style={[styles.iconWrap, { backgroundColor: `${catColor}22` }]}>
                        <Icon name={catIcon} size={32} color={catColor} />
                    </View>
                    <AppText style={[styles.heroTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                        {params?.title}
                    </AppText>
                    <AppText style={[styles.heroAmount, { color: isCredit ? '#4CAF50' : '#FF4C4C' }]}>
                        {isCredit ? '+' : '-'}{fmtFull(params?.amount)}
                    </AppText>
                    <View style={[styles.typeBadge, { backgroundColor: isCredit ? '#E8F5E9' : '#FFEBEE' }]}>
                        <AppText style={{ color: isCredit ? '#4CAF50' : '#FF4C4C', fontSize: 12, fontWeight: '700' }}>
                            {isCredit ? 'Income' : 'Expense'}
                        </AppText>
                    </View>
                </View>

                {/* Details card */}
                <View style={[styles.detailsCard, { backgroundColor: colors.surfaceElevated }]}>
                    {[
                        { label: 'Category', value: cat, icon: 'Tag' as const },
                        { label: 'Date', value: dayjs(params?.date).format('DD MMM YYYY'), icon: 'Calendar' as const },
                        ...(params?.note ? [{ label: 'Note', value: params.note, icon: 'FileText' as const }] : []),
                    ].map((row, i, arr) => (
                        <View key={row.label}>
                            <View style={styles.detailRow}>
                                <View style={[styles.detailIconWrap, { backgroundColor: colors.surfaceBase }]}>
                                    <Icon name={row.icon} size={16} color={colors.textSecondary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText style={[styles.detailLabel, { color: colors.textSecondary }]}>{row.label}</AppText>
                                    <AppText style={[styles.detailValue, { color: colors.textPrimary }]} numberOfLines={10}>{row.value}</AppText>
                                </View>
                            </View>
                            {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: colors.borderSubtle ?? '#F3F4F6' }]} />}
                        </View>
                    ))}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Button title="Edit" onPress={handleEdit} className='rounded-3xl' />
                    <Button title="Delete" onPress={() => setShowDeleteModal(true)} variant='danger' className='rounded-3xl' />
                </View>
            </View>

            {/* Delete confirmation modal */}
            <Modal
                visible={showDeleteModal}
                transparent
                animationType='fade'
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setShowDeleteModal(false)}>
                    <Pressable style={[styles.modalBox, { backgroundColor: colors.surfaceElevated }]} onPress={() => {}}>
                        <View style={styles.modalIconWrap}>
                            <Icon name='Trash2' size={32} color='#EF4444' />
                        </View>
                        <AppText style={[styles.modalTitle, { color: colors.textPrimary }]}>Delete Transaction?</AppText>
                        <AppText style={[styles.modalBody, { color: colors.textSecondary }]}>
                            This will permanently remove{'\n'}
                            <AppText style={{ fontWeight: '700', color: colors.textPrimary }}>{params?.title}</AppText>
                            {'\n'}and cannot be undone.
                        </AppText>
                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.modalBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle ?? '#E5E7EB', borderWidth: 1 }]}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <AppText style={{ color: colors.textPrimary, fontWeight: '600', fontSize: 15 }}>Cancel</AppText>
                            </Pressable>
                            <Pressable
                                style={[styles.modalBtn, { backgroundColor: '#EF4444' }]}
                                onPress={confirmDelete}
                            >
                                <AppText style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Delete</AppText>
                            </Pressable>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 14,
    },
    heroCard: {
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    iconWrap: {
        width: 64,
        height: 64,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    heroTitle: {
        fontSize: nf(18),
        fontWeight: '700',
        textAlign: 'center',
    },
    heroAmount: {
        fontSize: nf(32),
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    typeBadge: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 2,
    },
    detailsCard: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 14,
    },
    detailIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: nf(11),
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: nf(15),
        fontWeight: '600',
    },
    divider: {
        height: 0.5,
        marginLeft: 48,
    },
    actions: {
        gap: 12,
        paddingHorizontal: 4,
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    modalBox: {
        width: '100%',
        borderRadius: 20,
        padding: 28,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    modalIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: nf(20),
        fontWeight: '800',
    },
    modalBody: {
        fontSize: nf(14),
        textAlign: 'center',
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
        width: '100%',
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
})