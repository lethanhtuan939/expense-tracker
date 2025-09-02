export interface Expense {
    no?: number;
    date: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    paymentMethod: string;
    amount: number;
}

export interface FormErrors {
    date?: string
    type?: string
    category?: string
    amount?: string
    paymentMethod?: string
}

export interface Category {
    label: string;
    value: string;
    icon?: string;
}