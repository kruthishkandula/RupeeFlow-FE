import { SUPPORT_PHONE, SUPPORT_WHATSAPP } from "@/utility/config";

export const CONTACT = [
    { icon: 'Mail', label: 'Email Support', value: 'support@rupeeflow.app', url: 'mailto:support@rupeeflow.app', color: '#3B82F6' },
    { icon: 'Phone', label: 'Phone Support', value: SUPPORT_PHONE, url: `tel:${SUPPORT_PHONE}`, color: '#10B981' },
    { icon: 'MessageCircle', label: 'WhatsApp', value: 'Chat on WhatsApp', url: `https://wa.me/${SUPPORT_WHATSAPP.replace('+', '')}`, color: '#25D366' },
]

export const FAQS = [
    {
        q: 'How do I add an expense?',
        a: 'Tap the + button on the home screen or the Expenses tab. Fill in the title, amount, category and date, then hit Save.',
    },
    {
        q: 'How do I set a budget?',
        a: 'Go to the Wallet / Budget screen and tap on any category to set a spending limit. You\'ll see a progress bar as you spend.',
    },
    {
        q: 'Is my data safe?',
        a: 'Yes. Your account is secured with Firebase Authentication. Transaction data is stored locally on your device.',
    },
    {
        q: 'Can I use multiple accounts?',
        a: 'Yes! Each account has its own separate expenses and budgets. Just logout and sign in with a different account.',
    },
    {
        q: 'How do I change the theme?',
        a: 'Go to Profile → Change Theme and pick from Light, Dark, Xmas or System Default. Your choice is saved automatically.',
    },
]