import { TransactionType } from '@/typings/global';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type TranscationCardProps = TransactionType;

export default function TranscationCard({
    data,
    currency = '₹',
}: { data: TranscationCardProps, currency?: string }) {
    let display_date: string | Date = new Date(data.date);
    // check if date is today
    if (display_date.toDateString() === new Date().toDateString()) {
        display_date = 'Today';
    } else if (display_date.toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString()) {
        display_date = 'Yesterday';
    } else {
        // display in DD MM,YYYY format
        display_date = `${display_date.getDate()} ${display_date.toLocaleString('default', { month: 'short' })}, ${display_date.getFullYear()}`;
    }

    return (
        <View className='flex-row justify-between border-[0px] rounded-[12px] py-2' >
            <View className='flex-row gap-2' >
                <View>
                    <Image resizeMode='contain' resizeMethod='resize' source={{ uri: 'https://img.icons8.com/arcade/64/fast-moving-consumer-goods.png' }} width={50} height={50} />
                </View>
                <View>
                    <Text style={[styles.title]} className='text-textPrimary'>{data.title}</Text>
                    <Text style={[styles.display_date]} className='text-textSecondary'>{display_date}</Text>
                </View>
            </View>
            <View>
                {data?.type == 'income' ? <Text style={styles.incomeText}>+ {currency} {data.amount}</Text> : <Text style={styles.expenseText}>- {currency} {data.amount}</Text>}
            </View>
        </View>
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