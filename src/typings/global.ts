export type TransactionType = {
    id: string;
    category: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    note?: string;
    created_at?: string;
}

export type CategoryType = {
    id: string;
    name: string;
    icon: string;
    color: string;
}