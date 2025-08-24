import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', {
    state: () => ({
        categories: [
            { label: 'Lương', value: 'Salary', icon: 'pi pi-briefcase' },
            { label: 'Freelance', value: 'Freelance', icon: 'pi pi-desktop' },
            { label: 'Đầu tư', value: 'Investment', icon: 'pi pi-chart-line' },
            { label: 'Ăn uống', value: 'Food', icon: 'pi pi-shopping-cart' },
            { label: 'Di chuyển', value: 'Transport', icon: 'pi pi-car' },
            { label: 'Tiện ích', value: 'Utilities', icon: 'pi pi-home' },
            { label: 'Giải trí', value: 'Entertainment', icon: 'pi pi-play' },
            { label: 'Sức khỏe', value: 'Healthcare', icon: 'pi pi-heart' },
            { label: 'Mua sắm', value: 'Shopping', icon: 'pi pi-shopping-bag' },
            { label: 'Khác', value: 'Other', icon: 'pi pi-ellipsis-h' }
        ]
    }),
    actions: {
        setCategories(newCategories) {
            this.categories = newCategories;
        },
        addCategory(category) {
            this.categories.push(category);
        },
        removeCategory(value) {
            this.categories = this.categories.filter(cat => cat.value !== value);
        }
    }
});