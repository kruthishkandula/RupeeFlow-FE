// returns object from list of objects (by searching key & value u specify)
export const findObject = ({
    data,
    key,
    value
}: {
    data: any[] | null;
    key: string;
    value: string | boolean | number;
}) => {
    let ArrayData: any[] = [];

    if (Array.isArray(data)) {
        ArrayData = data;
    } else if (typeof data === 'object') {
        ArrayData = [data];
    } else {
        ArrayData = [];
    }

    for (let i = 0; i < ArrayData.length; i++) {
        if (ArrayData[i][key] === value) {
            return ArrayData[i];
        }
    }
    return null; // Return null if no matching object is found
};
