import Alert from '@/components/Alert/Alert';
import MainBG from '@/components/Backgrounds/MainBG';
import Button from '@/components/Button';
import DynamicHeader from '@/components/Header/DynamicHeader';
import AnimatedDropdown from '@/components/Input/AnimatedDropdown';
import AnimatedInput from '@/components/Input/AnimatedInput';
import CalendarDropdown from '@/components/Input/CalendarDropdown';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import { useExpenseStore } from '@/store/useExpenseStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    StyleSheet,
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

export default function AddExpenseScreen() {
    const { goBack, pop} = useNavigation<any>();
    const { params } = useRoute<any>()
    const {
        control,
        handleSubmit,
        formState: { isValid },
        watch,
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
    const { addStoreExpense, updateStoreExpense } = useExpenseStore();
    const type = watch('type');

    const onUpdate = async (data: ExpenseForm) => {
        try {
            console.log('EXPENSE 👉', data);
            let response = await updateStoreExpense({
                id: params?.id,
                title: data.title,
                amount: Number.parseFloat(data.amount),
                type: data?.type,
                date: data.date.toISOString(),
                category: data.category,
                note: data.note,
            });
            console.log('response---', response)
            Alert.success({ title: 'Updated!', message: `Your __${data.type}__ updated successfully.`, position: 'top' });
            pop(2);
        } catch (error) {
            console.log('error', error)
            Alert.error({ title: 'Error!', message: 'Something went wrong. Please try updating again.', position: 'top' });

        }
    };

    const onSubmit = async (data: ExpenseForm) => {
        try {
            console.log('EXPENSE 👉', data);
            let response = await addStoreExpense({
                id: Date.now().toString(),
                title: data.title,
                amount: Number.parseFloat(data.amount),
                type: data?.type,
                date: data.date.toISOString(),
                category: data.category,
                note: data.note,
            });
            console.log('response---', response)
            Alert.success({ title: 'Saved!', message: `Your __${data.type}__ added successfully.`, position: 'top' });
            goBack();
        } catch (error) {
            console.log('error', error)
            Alert.error({ title: 'Error!', message: 'Something went wrong. Please try again.', position: 'top' });

        }
    };

    return (
        <MainBG>
            <SafeAreaContainer className='mt-8 bg-transparent' >
                <DynamicHeader title='Income/Expense' />
                <KeyboardAwareScrollView>
                    <View className='mx-4' style={[styles.sheet, styles.glassCard]}>
                        {/* category */}
                        <Controller
                            control={control}
                            name="category"
                            rules={{ required: 'Category required' }}
                            render={({ field, fieldState }) => (
                                <AnimatedDropdown
                                    label="Category"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    options={[
                                        { label: 'Food', value: 'Food' },
                                        { label: 'Travel', value: 'Travel' },
                                        { label: 'Salary', value: 'Salary' },
                                        { label: 'Interest', value: 'Interest' },
                                        { label: 'Groceries', value: 'Groceries' },
                                        { label: 'Bills', value: 'Bills' },
                                        { label: 'Entertainment', value: 'Entertainment' },
                                        { label: 'Health', value: 'Health' },
                                        { label: 'Shopping', value: 'Shopping' },
                                        { label: 'Education', value: 'Education' },
                                        { label: 'Others', value: 'Others' },
                                    ]}
                                />
                            )}
                        />

                        {/* title */}
                        <Controller
                            control={control}
                            name="title"
                            rules={{
                                required: 'Title required',
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 2 characters',
                                },
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


                        {/* amount */}
                        <Controller
                            control={control}
                            name="amount"
                            rules={{
                                required: 'Amount is required',
                                pattern: {
                                    value: /^\d.+$/,
                                    message: 'Only numbers allowed',
                                },
                            }}
                            render={({ field, fieldState }) => (
                                <AnimatedInput
                                    label="Amount"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    keyboardType="numeric"
                                    error={fieldState.error?.message}
                                    amount
                                    currency={'₹'}
                                />
                            )}
                        />

                        {/* type */}
                        <Controller
                            control={control}
                            name="type"
                            rules={{ required: 'Type required' }}
                            render={({ field, fieldState }) => (
                                <AnimatedDropdown
                                    label="Type"
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={fieldState.error?.message}
                                    options={[
                                        { label: 'Income', value: 'income' },
                                        { label: 'Expense', value: 'expense' },
                                    ]}
                                />
                            )}
                        />

                        {/* Date */}
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

                        {/* Note */}
                        <Controller
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <AnimatedInput
                                    label="Note"
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        <Button
                            title={`Save ${type || ''}`}
                            disabled={!isValid}
                            onPress={handleSubmit(params?.amount ? onUpdate : onSubmit)}
                        />
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaContainer>
        </MainBG >
    );
}


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2F7E79',
    },
    header: {
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    sheet: {
        borderRadius: 28,
        padding: 20,
        paddingTop: 60,
        marginTop: 20,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    button: {
        height: 56,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#2F7E79',
        fontSize: 16,
        fontWeight: '600',
    },
    glassCard: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',

        padding: 20,

        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 10,

        elevation: 5,
    },
});
