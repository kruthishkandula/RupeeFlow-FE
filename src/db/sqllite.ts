import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let dbInstance: SQLite.SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabase({
    name: 'Expense.db',
    location: 'default',
  });

  console.log('Database opened');

  return dbInstance;
};

export const initDB = async (): Promise<void> => {
  try {
    const db = await getDB();

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        title TEXT,
        amount REAL,
        type TEXT,
        date TEXT,
        category TEXT,
        created_at TEXT
      );
    `);

    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS budgets (
        category TEXT PRIMARY KEY,
        amount REAL NOT NULL
      );
    `);

    const [result] = await db.executeSql(
      `SELECT COUNT(*) as count FROM expenses`
    );

    const count = result.rows.item(0).count;

    if (count === 0) {
      await db.executeSql(`
        INSERT INTO expenses
        (id, title, amount, type, date, category, created_at)
        VALUES
        ('1', 'Salary', 5000, 'income', '2026-05-01', 'Salary', '2026-05-01T10:00:00Z'),
        ('2', 'Groceries', 1200, 'expense', '2026-05-02', 'Food', '2026-05-02T12:00:00Z'),
        ('3', 'Netflix', 649, 'expense', '2026-05-03', 'Entertainment', '2026-05-03T08:00:00Z');
      `);

      console.log('Dummy data inserted');
    }

    console.log('DB Initialized');
  } catch (error) {
    console.log('INIT DB ERROR:', error);
  }
};