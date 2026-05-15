import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'rupeeflow-storage' });

export const createItem = async (key: string, value: string) => {
  storage.set(key, value);
};

export const getItem = async (key: string) => {
  return storage.getString(key) ?? null;
};

export const removeItem = async (key: string) => {
  storage.remove(key);
};

export const clearAllItems = async () => {
  storage.clearAll();
};