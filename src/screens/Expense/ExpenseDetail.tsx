import Alert from '@/components/Alert/Alert';
import Button from '@/components/Button';
import Details from '@/components/Cards/Details';
import DynamicHeader from '@/components/Header/DynamicHeader';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import useTheme from '@/hooks/useTheme';
import { useExpenseStore } from '@/store/useExpenseStore';
import { dynamicErrorAlert } from '@/utility/alert';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import { View } from 'react-native';

export default function ExpenseDetail() {
    const { colors } = useTheme();
    const { params } = useRoute<any>();
    const { deleteStoreExpense } = useExpenseStore();
    const { goBack, navigate } = useNavigation<any>();


    console.log('params', params)

    let isCredit = params?.type === 'income';

    const handleEdit = async () => {
        try {
            navigate('AddExpense', {
                ...params
            })
        } catch (error) {
            return dynamicErrorAlert(error);
        }
    }

    const handleDelete = async () => {
        try {
            let res = await deleteStoreExpense(params?.id);
            console.log('res---', res)
            if (res?.success) {
                Alert.success({ title: 'Deleted!', message: 'The transaction was deleted successfully.' });
                goBack();
            }
        } catch (error) {
            return dynamicErrorAlert(error);
        }
    }

    return (
        <SafeAreaContainer className='bg-[#f2f2f2]' >
            <DynamicHeader title='Expense details' />
            <View className='flex-1 px-4 pt-8 justify-between' >
                <Details
                    topData={{
                        'Title': params?.title,
                        'Category': params?.category,
                        'Transaction Date': dayjs(params?.date).format('DD-MM-YYYY hh:mm A'),
                    }}
                    bottomData={{
                        'Amount': `${params?.currency || '₹'} ${params?.amount}`
                    }}
                    bottomTextStyle={{
                        color: isCredit ? colors?.success : colors?.error,
                    }}

                />
                <View className='flex flex-col gap-4 px-4' >
                    <Button
                        title="Edit"
                        onPress={handleEdit}
                    />
                    <Button
                        title="Delete"
                        onPress={handleDelete}
                        variant='danger'
                    />
                </View>
            </View>
        </SafeAreaContainer>
    )
}