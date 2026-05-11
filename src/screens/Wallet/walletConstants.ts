export const BUDGET_KEY = 'wallet_budgets_v1'
export const CURRENCY = '₹'

export type BudgetMap = Record<string, number>

export const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B',
  Travel: '#4ECDC4',
  Bills: '#45B7D1',
  Entertainment: '#96CEB4',
  Health: '#FFEAA7',
  Shopping: '#DDA0DD',
  Salary: '#98FB98',
  Education: '#F0E68C',
  Freelance: '#87CEEB',
  Investment: '#FFB347',
  Gift: '#FF69B4',
  Other: '#C0C0C0',
}

export const ICON_MAP: Record<string, string> = {
  Food: 'UtensilsCrossed',
  Travel: 'Plane',
  Bills: 'Receipt',
  Entertainment: 'Film',
  Health: 'HeartPulse',
  Shopping: 'ShoppingBag',
  Salary: 'CircleEllipsis',
  Education: 'GraduationCap',
  Freelance: 'Briefcase',
  Investment: 'TrendingUp',
  Gift: 'Gift',
  Other: 'CircleEllipsis',
}

export function fmt(n: number) {
  if (n >= 100000) return `${CURRENCY}${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${CURRENCY}${(n / 1000).toFixed(1)}K`
  return `${CURRENCY}${n.toLocaleString('en-IN')}`
}

export function fmtFull(n: number) {
  return `${CURRENCY}${Math.abs(n).toLocaleString('en-IN')}`
}
