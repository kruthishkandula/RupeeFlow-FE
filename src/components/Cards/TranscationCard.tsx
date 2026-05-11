import useTheme from '@/hooks/useTheme';
import { TransactionType } from '@/typings/global';
import { useNavigation } from '@react-navigation/native';
import { capitalize } from 'lodash';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from '../Icon';

type TranscationCardProps = TransactionType;

const IconMapping: { [key: string]: string } = {
    Food: 'UtensilsCrossed',
    Travel: 'Plane',
    Bills: 'Receipt',
    Entertainment: 'Film',
    Health: 'HeartPulse',
    Shopping: 'ShoppingBag',
    Salary: 'CircleEllipsis',
    Education: 'GraduationCap',
    Freelance: 'Freelance',
    Investment: 'CircleEllipsis',
    Gift: 'Gift',
    Other: 'CircleEllipsis',
}

export default function TranscationCard({
    data,
    currency = '₹',
}: Readonly<{ data: TranscationCardProps, currency?: string }>) {
    const { colors } = useTheme();
    const { navigate } = useNavigation<any>();

    let display_date: string | Date = new Date(data.date);

    if (display_date.toDateString() === new Date().toDateString()) {
        display_date = 'Today';
    } else if (display_date.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
        display_date = 'Yesterday';
    } else {
        display_date = `${display_date.getDate()} ${display_date.toLocaleString('default', { month: 'short' })}, ${display_date.getFullYear()}`;
    }

    const handleOnPress = () => {
        navigate('ExpenseDetail', data);
    }

    return (
        <Pressable className='flex-row justify-between border-[0px] rounded-[12px] py-2 border-b-[0.2px] border-[#5f5f5f]' onPress={handleOnPress}>
            <View className='flex-row gap-2 items-center' >
                <View>
                    <Icon name={IconMapping?.[capitalize?.(data.category)] || 'Info'} color={colors.accent} size={38} />
                </View>
                <View>
                    <Text style={[styles.title]} className='text-textPrimary'>{data.title}</Text>
                    <Text style={[styles.display_date]} className='text-textSecondary'>{display_date}</Text>
                </View>
            </View>
            <View>
                {data?.type == 'income' ? <Text style={styles.incomeText}>+ {currency} {data.amount}</Text> : <Text style={styles.expenseText}>- {currency} {data.amount}</Text>}
            </View>
        </Pressable>
    )
}


const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    display_date: {
        fontSize: 14,
        borderRadius: 14,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    expenseText: {
        fontSize: 18,
        color: '#FF4C4C',
        fontWeight: '700',
    },
    incomeText: {
        fontSize: 18,
        color: '#4CAF50',
        fontWeight: '700',
    },
})