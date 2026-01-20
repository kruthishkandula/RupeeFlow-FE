export type TransactionType = {
    id: string;
    title: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category: string;
}

export type CategoryType = {
    id: string;
    name: string;
    icon: string;
    color: string;
}
