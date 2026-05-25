import { createItem, getItem, removeItem } from "@/utility/storage";
import { StateStorage } from "zustand/middleware";

export const local_storage: StateStorage = {
    setItem: (key: string, value: any) => {
        let encryptedData = JSON.stringify(value);
        createItem(key, encryptedData);
        return true;
    },
    getItem: (key: string) => {
        const value = getItem(key);
        let decryptedData =
            value && typeof value == 'string' ? JSON.parse(value) : {};
        return decryptedData;
    },
    removeItem: (key: string) => {
        removeItem(key);
    },
};