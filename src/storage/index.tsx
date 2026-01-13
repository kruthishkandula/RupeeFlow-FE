import { createItem, getItem, removeItem } from "@/utility/storage";

export const local_storage = {
    setItem: async (key: string, value: any) => {
        let encryptedData = JSON.stringify(value);
        await createItem(key, encryptedData);
        return true;
    },
    getItem: async (key: string) => {
        const value = await getItem(key);
        let decryptedData =
            value && typeof value == 'string' ? JSON.parse(value) : {};
        return decryptedData;
    },
    removeItem: async (key: string) => {
        await removeItem(key);
    },
};