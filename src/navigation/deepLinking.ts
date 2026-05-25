export type NavigationTarget =
  | { name: 'Login'; requiresAuth: false }
  | { name: 'Signup'; requiresAuth: false }
  | { name: 'Home'; params: { screen: 'Dashboard' | 'Statistics' | 'Profile' }; requiresAuth: true }
  | { name: 'AddExpense'; requiresAuth: true }
  | { name: 'ExpenseDetail'; params: { expenseId: string }; requiresAuth: true }
  | { name: 'Transactions'; requiresAuth: true }
  | { name: 'ChangeTheme'; requiresAuth: true }
  | { name: 'About'; requiresAuth: true }
  | { name: 'Help'; requiresAuth: true }

const splitUrlSegments = (value: string) =>
  value
    .split('/')
    .map(part => part.trim())
    .filter(Boolean)

const buildExpenseTarget = (expenseId: string): NavigationTarget => ({
  name: 'ExpenseDetail',
  params: { expenseId },
  requiresAuth: true,
})

const resolveScreenTarget = (screen: string | undefined): NavigationTarget | null => {
  switch (screen?.toLowerCase()) {
    case 'login':
      return { name: 'Login', requiresAuth: false }
    case 'signup':
      return { name: 'Signup', requiresAuth: false }
    case 'dashboard':
      return { name: 'Home', params: { screen: 'Dashboard' }, requiresAuth: true }
    case 'statistics':
      return { name: 'Home', params: { screen: 'Statistics' }, requiresAuth: true }
    case 'profile':
      return { name: 'Home', params: { screen: 'Profile' }, requiresAuth: true }
    case 'transactions':
      return { name: 'Transactions', requiresAuth: true }
    case 'addexpense':
    case 'add-expense':
      return { name: 'AddExpense', requiresAuth: true }
    case 'changetheme':
    case 'theme':
      return { name: 'ChangeTheme', requiresAuth: true }
    case 'about':
      return { name: 'About', requiresAuth: true }
    case 'help':
      return { name: 'Help', requiresAuth: true }
    case 'expensedetail':
      return null
    default:
      return null
  }
}

export const parseDeepLink = (rawUrl: string | null | undefined): NavigationTarget | null => {
  if (!rawUrl) {
    return null
  }

  try {
    const parsed = new URL(rawUrl)
    const segments = splitUrlSegments(`${parsed.hostname}/${parsed.pathname}`)
    const [screen, expenseId] = segments

    if (screen?.toLowerCase() === 'expense' && expenseId) {
      return buildExpenseTarget(expenseId)
    }

    return resolveScreenTarget(screen)
  } catch {
    const segments = splitUrlSegments(rawUrl)
    const [screen, expenseId] = segments

    if (screen?.toLowerCase() === 'expense' && expenseId) {
      return buildExpenseTarget(expenseId)
    }

    return resolveScreenTarget(screen)
  }
}

export const resolveTargetFromNotificationData = (data: Record<string, any> | undefined): NavigationTarget | null => {
  if (!data) {
    return null
  }

  if (typeof data.url === 'string') {
    return parseDeepLink(data.url)
  }

  if (typeof data.deepLink === 'string') {
    return parseDeepLink(data.deepLink)
  }

  if (typeof data.screen === 'string') {
    const screenTarget = resolveScreenTarget(data.screen)
    if (screenTarget) {
      return screenTarget
    }
  }

  if (typeof data.transactionId === 'string') {
    return buildExpenseTarget(data.transactionId)
  }

  if (typeof data.expenseId === 'string') {
    return buildExpenseTarget(data.expenseId)
  }

  if (typeof data.id === 'string' && (data.route === 'ExpenseDetail' || data.type === 'transaction')) {
    return buildExpenseTarget(data.id)
  }

  return null
}