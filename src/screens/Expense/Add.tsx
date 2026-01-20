import MainBG from '@/components/Backgrounds/MainBG';
import DynamicHeader from '@/components/Header/DynamicHeader';
import AnimatedDropdown from '@/components/Input/AnimatedDropdown';
import AnimatedInput from '@/components/Input/AnimatedInput';
import SafeAreaContainer from '@/components/SafeAreaContainer';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type ExpenseForm = {
    amount: string;
    title: string;
    note: string;
};

export default function AddExpenseScreen() {
    const {
        control,
        handleSubmit,
    } = useForm<ExpenseForm>({
        defaultValues: {
            amount: '',
            title: '',
            note: '',
        },
    });

    const onSubmit = (data: ExpenseForm) => {
        console.log('EXPENSE 👉', data);
    };

    return (
        <MainBG>
            <SafeAreaContainer className='mt-8 bg-transparent' >
                <DynamicHeader title='Add Expense' />
                <View className='mx-4' style={styles.sheet}>
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
                                    { label: 'Food', value: 'food' },
                                    { label: 'Travel', value: 'travel' },
                                    { label: 'Groceries', value: 'groceries' },
                                    { label: 'Bills', value: 'bills' },
                                    { label: 'Entertainment', value: 'entertainment' },
                                    { label: 'Health', value: 'health' },
                                    { label: 'Shopping', value: 'shopping' },
                                    { label: 'Education', value: 'education' },
                                    { label: 'Others', value: 'others' },
                                ]}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="amount"
                        rules={{
                            required: 'Amount is required',
                            pattern: {
                                value: /^\d+$/,
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
                            />
                        )}
                    />

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

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Text style={styles.buttonText}>Save Expense</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaContainer>
        </MainBG >
    );
}


const styles = StyleSheet.create({
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
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 20,
        paddingTop: 60,
        marginTop: 20,
    },
    button: {
        height: 56,
        borderRadius: 18,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#2F7E79',
        fontSize: 16,
        fontWeight: '600',
    },
});
