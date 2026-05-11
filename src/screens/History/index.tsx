import TranscationCard from '@/components/Cards/TranscationCard';
import DynamicHeader from '@/components/Header/DynamicHeader';
import Icon from '@/components/Icon';
import Empty from '@/components/Organisms/Empty';
import useTheme from '@/hooks/useTheme';
import { useExpenseStore } from '@/store/useExpenseStore';
import { TransactionType } from '@/typings/global';
import React, { useEffect, useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SortField = 'title' | 'amount' | 'date';
type SortDir = 'asc' | 'desc';

export default function Transactions() {
    const { expenses, getStoreExpenses } = useExpenseStore();
    const [refreshing, setRefreshing] = React.useState(false);
    const { colors } = useTheme();
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('date');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getStoreExpenses();
        setRefreshing(false);
    }, []);

    useEffect(() => {
        getStoreExpenses();
    }, [expenses.length]);

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const sortIcon = (field: SortField) => {
        if (sortField !== field) return 'ArrowUpDown';
        return sortDir === 'asc' ? 'ArrowUp' : 'ArrowDown';
    };

    const processed = useMemo<TransactionType[]>(() => {
        let list = [...expenses];

        // Search by title, category, or note
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            list = list.filter(
                e =>
                    e.title.toLowerCase().includes(q) ||
                    e.category.toLowerCase().includes(q) ||
                    (e.note ?? '').toLowerCase().includes(q),
            );
        }

        // Sort
        list.sort((a, b) => {
            let cmp = 0;
            if (sortField === 'title') {
                cmp = a.title.localeCompare(b.title);
            } else if (sortField === 'amount') {
                cmp = a.amount - b.amount;
            } else {
                cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
            }
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return list;
    }, [expenses, search, sortField, sortDir]);

    return (
        <SafeAreaView className='flex-1'>
            <DynamicHeader
                title="Transactions"
                rightComponent={
                    <Pressable
                        onPress={() => setShowFilters(v => !v)}
                        className='flex-row items-center gap-2 px-4 py-2'
                    >
                        <Icon name='ListFilter' size={16} color={showFilters ? colors?.focusRing : colors?.textPrimary} />
                    </Pressable>
                }
            />

            {/* Search bar */}
            <View style={[styles.searchRow, { borderColor: colors?.border ?? '#E5E7EB' }]}>
                <Icon name='Search' size={16} color='#9CA3AF' />
                <TextInput
                    style={[styles.searchInput, { color: colors?.textPrimary ?? '#111827' }]}
                    placeholder='Search by title, category…'
                    placeholderTextColor='#9CA3AF'
                    value={search}
                    onChangeText={setSearch}
                    returnKeyType='search'
                    clearButtonMode='while-editing'
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch('')}>
                        <Icon name='X' size={14} color='#9CA3AF' />
                    </Pressable>
                )}
            </View>

            {/* Sort chips */}
            {showFilters && (
                <View style={[styles.filterSection, { borderBottomColor: colors?.dark }]}>
                    {/* Sort label + chips */}
                    <View style={styles.filterRow}>
                        <Text style={[styles.filterLabel, { color: colors?.textSecondary ?? '#6B7280' }]}>Sort by</Text>
                        {(['title', 'amount', 'date'] as SortField[]).map(field => {
                            const active = sortField === field;
                            return (
                                <Pressable
                                    key={field}
                                    style={[
                                        styles.chip,
                                        active && { backgroundColor: colors?.focusRing ?? '#2F7E79' },
                                    ]}
                                    onPress={() => toggleSort(field)}
                                >
                                    <Icon
                                        name={sortIcon(field) as any}
                                        size={13}
                                        color={active ? '#fff' : (colors?.textPrimary ?? '#374151')}
                                    />
                                    <Text
                                        style={[
                                            styles.chipText,
                                            { color: active ? '#fff' : (colors?.textPrimary ?? '#374151') },
                                        ]}
                                    >
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Result count + clear */}
                    <View style={styles.filterMeta}>
                        <Text style={[styles.resultCount, { color: colors?.textSecondary ?? '#6B7280' }]}>
                            {processed.length} result{processed.length !== 1 ? 's' : ''}
                        </Text>
                        {(sortField !== 'date' || sortDir !== 'desc') && (
                            <Pressable
                                style={styles.clearChip}
                                onPress={() => { setSortField('date'); setSortDir('desc'); }}
                            >
                                <Icon name='X' size={12} color='#EF4444' />
                                <Text style={styles.clearChipText}>Clear</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            )}

            {/* Transactions list */}
            <View className='flex-1 px-4 py-4'>
                <FlatList
                    contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
                    style={{ flex: 1, flexGrow: 1 }}
                    data={processed}
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName='gap-4'
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    renderItem={({ item }: any) => (
                        <TranscationCard key={`transaction-${item.id}`} data={item} />
                    )}
                    ListEmptyComponent={<Empty />}
                    keyExtractor={({ id }) => id}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 4,
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 8,
        backgroundColor: '#fff',
    },
    searchInput: {
        flex: 1,
        fontSize: 18,
        paddingVertical: 0,
    },
    filterSection: {
        marginHorizontal: 16,
        marginTop: 6,
        marginBottom: 2,
        gap: 8,
        borderBottomWidth: 2,
        paddingBottom: 12,
    },
    filterLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginRight: 4,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    filterMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    resultCount: {
        fontSize: 13,
    },
    clearChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
    },
    clearChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#EF4444',
    },
});