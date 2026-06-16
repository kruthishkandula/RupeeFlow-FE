export const CURRENCY = '₹'

export const CATEGORY_COLORS: Record<string, string> = {
    Food: '#FF6B6B',
    Travel: '#4ECDC4',
    Bills: '#45B7D1',
    Entertainment: '#96CEB4',
    Health: '#f6d809',
    Groceries: '#83b316',
    Shopping: '#DDA0DD',
    Salary: '#008000',
    Education: '#c03039',
    Freelance: '#87CEEB',
    Investment: '#FFB347',
    Gift: '#FF69B4',
    Interest: '#4ECDC4',
    Others: '#C0C0C0',
}

export const CATEGORY_ICON_MAP: Record<string, string> = {
    Food: 'UtensilsCrossed',
    Travel: 'Plane',
    Bills: 'Receipt',
    Interest: 'CalendarPlus',
    Entertainment: 'Film',
    Health: 'HeartPulse',
    Groceries: 'ShoppingBasket',
    Shopping: 'ShoppingBag',
    Salary: 'IndianRupee',
    Education: 'GraduationCap',
    Freelance: 'Briefcase',
    Investment: 'TrendingUp',
    Gift: 'Gift',
    Others: 'Ellipsis',
}

export const CATEGORIES_LIST = [
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Interest', value: 'Interest' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Bills', value: 'Bills' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Health', value: 'Health' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Education', value: 'Education' },
    { label: 'Others', value: 'Others' },
]

export const QUICK_AMOUNTS = ['100', '500', '1000', '5000'];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Interest', 'Gift', 'Others'];
export const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Bills', 'Entertainment', 'Health', 'Groceries', 'Shopping', 'Education', 'Others'];

export function fmt(n: number) {
    if (n >= 100000) return `${CURRENCY}${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `${CURRENCY}${(n / 1000).toFixed(1)}K`
    return `${CURRENCY}${n.toLocaleString('en-IN')}`
}

export function fmtFull(n: number) {
    return `${CURRENCY}${Math.abs(n).toLocaleString('en-IN')}`
}


