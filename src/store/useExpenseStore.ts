import { getDB } from '@/db/sqllite';
import { TransactionType } from '@/typings/global';
import { create } from 'zustand';


type ExpenseStore = {
  expenses: TransactionType[];
  getStoreExpenses: () => void;
  addStoreExpense: (expense: TransactionType) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
  updateStoreExpense: (expense: Omit<TransactionType, 'created_at'>) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
  deleteStoreExpense: (id: string) => Promise<{ success: boolean; data?: TransactionType; error?: any }>;
};

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  getStoreExpenses: async () => {
    try {
      const db = await getDB();

      const [result] = await db.executeSql(
        `SELECT * FROM expenses ORDER BY created_at DESC`
      );

      let data = result.rows.raw();
      set({ expenses: data });
    } catch (error) {
      console.log('GET EXPENSE ERROR:', error);
      return [];
    }
  },

  addStoreExpense: async (expense: TransactionType) => {
    try {
      let created_at = new Date().toISOString();
      const db = await getDB();
      expense.created_at = created_at;
      await db?.executeSql(
        `
      INSERT INTO expenses
      (id, title, amount, type, date, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
        [
          expense.id,
          expense.title,
          expense.amount,
          expense.type,
          expense.date,
          expense.category,
          expense.created_at,
        ],
      );
      await get().getStoreExpenses();
      return {
        success: true,
        data: expense,
      }
    } catch (error) {
      console.log('ADD EXPENSE ERROR:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  updateStoreExpense: async (expense: TransactionType) => {
    try {
      const db = await getDB();
      await db?.executeSql(
        `
        UPDATE expenses
        SET title = ?, amount = ?, type = ?, date = ?, category = ?
        WHERE id = ?
        `,
        [
          expense.title,
          expense.amount,
          expense.type,
          expense.date,
          expense.category,
          expense.id,
        ],
      );
      await get().getStoreExpenses();
      return {
        success: true,
        data: expense,
      }
    } catch (error) {
      console.log('UPDATE EXPENSE ERROR:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  deleteStoreExpense: async (id: string) => {
    try {
      const db = await getDB();
      await db?.executeSql(
        `
        DELETE FROM expenses WHERE id = ?
        `,
        [id],
      );
      await get().getStoreExpenses();
      return {
        success: true,
      }
    } catch (error) {
      return {
        success: false,
        error: error
      };
    }
  },
}));