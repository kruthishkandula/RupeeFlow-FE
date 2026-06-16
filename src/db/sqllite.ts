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
        user_id TEXT NOT NULL,
        title TEXT,
        amount REAL,
        type TEXT,
        date TEXT,
        category TEXT,
        note TEXT,
        created_at TEXT
      );
    `);

    // Migrate existing table: add user_id column if missing
    try {
      await db.executeSql(`ALTER TABLE expenses ADD COLUMN user_id TEXT NOT NULL DEFAULT ''`);
    } catch {
      // Column already exists in upgraded installs.
    }

    // Ensure budgets table exists first, then migrate legacy schemas if needed.
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS budgets (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT '',
        category TEXT,
        amount REAL NOT NULL
      );
    `);

    const [budgetInfo] = await db.executeSql(`PRAGMA table_info(budgets)`);
    const budgetColumns = new Set<string>();
    for (let i = 0; i < budgetInfo.rows.length; i++) {
      budgetColumns.add(String(budgetInfo.rows.item(i).name));
    }

    const needsMigration = !budgetColumns.has('id') || !budgetColumns.has('user_id');
    if (needsMigration) {
      await db.executeSql(`ALTER TABLE budgets RENAME TO budgets_old`);
      await db.executeSql(`
        CREATE TABLE budgets (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL DEFAULT '',
          category TEXT,
          amount REAL NOT NULL
        );
      `);

      try {
        await db.executeSql(
          `INSERT INTO budgets (id, user_id, category, amount)
           SELECT id, user_id, category, amount FROM budgets_old`
        );
      } catch (copyError) {
        console.log('BUDGETS MIGRATION FALLBACK:', copyError);
        try {
          await db.executeSql(
            `INSERT INTO budgets (id, user_id, category, amount)
             SELECT category, '', category, amount FROM budgets_old`
          );
        } catch (legacyCopyError) {
          console.log('LEGACY BUDGETS MIGRATION ERROR:', legacyCopyError);
        }
      }

      await db.executeSql(`DROP TABLE IF EXISTS budgets_old`);
    }

    console.log('DB Initialized');
  } catch (error) {
    console.log('INIT DB ERROR:', error);
  }
};