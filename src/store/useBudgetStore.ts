import { getDB } from '@/db/sqllite';
import { create } from 'zustand';

export type BudgetMap = Record<string, number>;

type BudgetStore = {
    budgets: BudgetMap;
    getStoreBudgets: () => Promise<void>;
    setStoreBudget: (category: string, amount: number) => Promise<void>;
    removeStoreBudget: (category: string) => Promise<void>;
};

export const useBudgetStore = create<BudgetStore>((set, get) => ({
    budgets: {},

    getStoreBudgets: async () => {
        try {
            const db = await getDB();
            const [result] = await db.executeSql(`SELECT category, amount FROM budgets`);
            const map: BudgetMap = {};
            for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                map[row.category] = row.amount;
            }
            set({ budgets: map });
        } catch (error) {
            console.log('GET BUDGETS ERROR:', error);
        }
    },

    setStoreBudget: async (category: string, amount: number) => {
        try {
            const db = await getDB();
            await db.executeSql(
                `INSERT INTO budgets (category, amount) VALUES (?, ?)
                 ON CONFLICT(category) DO UPDATE SET amount = excluded.amount`,
                [category, amount],
            );
            set({ budgets: { ...get().budgets, [category]: amount } });
        } catch (error) {
            console.log('SET BUDGET ERROR:', error);
        }
    },

    removeStoreBudget: async (category: string) => {
        try {
            const db = await getDB();
            await db.executeSql(`DELETE FROM budgets WHERE category = ?`, [category]);
            const next = { ...get().budgets };
            delete next[category];
            set({ budgets: next });
        } catch (error) {
            console.log('REMOVE BUDGET ERROR:', error);
        }
    },
}));
