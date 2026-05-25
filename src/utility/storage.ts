import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({ id: 'rupeeflow-storage' });

export const createItem = (key: string, value: string) => {
  storage.set(key, value);
};

export const getItem = (key: string) => {
  return storage.getString(key) ?? null;
};

export const removeItem = (key: string) => {
  storage.remove(key);
};

export const clearAllItems = () => {
  storage.clearAll();
};