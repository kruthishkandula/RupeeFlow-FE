import { getFirebaseAuth } from '@/config/firebase';
import { getDB } from '@/db/sqllite';
import { create } from 'zustand';

const getUserId = (): string => getFirebaseAuth()?.currentUser?.uid ?? '';

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
            const userId = getUserId();
            const [result] = await db.executeSql(
                `SELECT category, amount FROM budgets WHERE user_id = ?`,
                [userId]
            );
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
            const userId = getUserId();
            await db.executeSql(
                `INSERT INTO budgets (id, user_id, category, amount) VALUES (?, ?, ?, ?)
                 ON CONFLICT(id) DO UPDATE SET amount = excluded.amount`,
                [`${userId}_${category}`, userId, category, amount],
            );
            set({ budgets: { ...get().budgets, [category]: amount } });
        } catch (error) {
            console.log('SET BUDGET ERROR:', error);
        }
    },

    removeStoreBudget: async (category: string) => {
        try {
            const db = await getDB();
            const userId = getUserId();
            await db.executeSql(
                `DELETE FROM budgets WHERE category = ? AND user_id = ?`,
                [category, userId]
            );
            const next = { ...get().budgets };
            delete next[category];
            set({ budgets: next });
        } catch (error) {
            console.log('REMOVE BUDGET ERROR:', error);
        }
    },
}));
