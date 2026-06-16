import { getFirebaseAuth } from '@/config/firebase';
import { getDB } from '@/db/sqllite';
import { TransactionType } from '@/typings/global';
import { create } from 'zustand';

const getUserId = (): string => getFirebaseAuth()?.currentUser?.uid ?? '';

type ExpenseStore = {
  expenses: TransactionType[];
  getStoreExpenses: () => Promise<void>;
  getExpenseById: (id: string) => Promise<TransactionType | null>;
  addStoreExpense: (expense: TransactionType) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
  updateStoreExpense: (expense: Omit<TransactionType, 'created_at'>) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
  deleteStoreExpense: (id: string) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
};

const parseAmount = (value: unknown): number => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const normalized = value.replace(/[^0-9.-]/g, '');
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const normalizeTransaction = (raw: any): TransactionType => ({
  ...raw,
  amount: parseAmount(raw.amount),
});

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  getStoreExpenses: async () => {
    try {
      const db = await getDB();
      const userId = getUserId();

      const [result] = await db.executeSql(
        `SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );

      const data = result.rows.raw().map(normalizeTransaction);
      set({ expenses: data });
    } catch (error) {
      console.log('GET EXPENSE ERROR:', error);
      return;
    }
  },

  getExpenseById: async (id: string) => {
    try {
      const db = await getDB();
      const userId = getUserId();

      const [result] = await db.executeSql(
        `SELECT * FROM expenses WHERE id = ? AND user_id = ? LIMIT 1`,
        [id, userId]
      );

      if (!result.rows.length) {
        return null;
      }

      return normalizeTransaction(result.rows.item(0));
    } catch (error) {
      console.log('GET EXPENSE BY ID ERROR:', error);
      return null;
    }
  },

  addStoreExpense: async (expense: TransactionType) => {
    try {
      let created_at = new Date().toISOString();
      const db = await getDB();
      const userId = getUserId();
      expense.created_at = created_at;
      const note = (expense.note ?? '').trim();
      await db?.executeSql(
        `INSERT INTO expenses (id, user_id, title, amount, type, date, category, note, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [expense.id, userId, expense.title, expense.amount, expense.type, expense.date, expense.category, note || null, expense.created_at],
      );
      await get().getStoreExpenses();
      return { success: true, data: expense };
    } catch (error) {
      console.log('ADD EXPENSE ERROR:', error);
      throw new Error('Failed to add expense')
    }
  },

  updateStoreExpense: async (expense: TransactionType) => {
    try {
      const db = await getDB();
      const userId = getUserId();
      const note = (expense.note ?? '').trim();
      await db?.executeSql(
        `UPDATE expenses SET title = ?, amount = ?, type = ?, date = ?, category = ?, note = ? WHERE id = ? AND user_id = ?`,
        [expense.title, expense.amount, expense.type, expense.date, expense.category, note || null, expense.id, userId],
      );
      await get().getStoreExpenses();
      return { success: true, data: expense };
    } catch (error) {
      console.log('UPDATE EXPENSE ERROR:', error);
      throw new Error('Failed to update expense');
    }
  },

  deleteStoreExpense: async (id: string) => {
    try {
      const db = await getDB();
      const userId = getUserId();
      await db?.executeSql(
        `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
        [id, userId],
      );
      await get().getStoreExpenses();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },
}));