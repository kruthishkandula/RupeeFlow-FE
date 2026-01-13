import { NativeModules, Platform } from 'react-native';
const { NativeLocalStorage } = NativeModules;


let isAndroid = Platform.OS === 'android';

export const createItem = async (key: string, value: string) => { isAndroid && await NativeLocalStorage.setItem(key, value) };
export const getItem = async (key: string) => { isAndroid && await NativeLocalStorage.getItem(key) || 'null' };
export const removeItem = async (key: string) => { isAndroid && await NativeLocalStorage.removeItem(key) };
export const clearAllItems = async () => { isAndroid && await NativeLocalStorage.clear() };