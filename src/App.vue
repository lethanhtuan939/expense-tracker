<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">
          Quản lý Chi tiêu Cá nhân
        </h1>
        <ThemeSwitcher />
      </div>

      <!-- Add Expense Form -->
      <ExpenseForm :categories="categories" @expense-added="addExpense" class="mb-8" />

      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <ExpenseFilters v-model:filters="filters" :categories="categories" class="flex-1" />
      </div>
      <ExportButton :expenses="filteredExpenses" />

      <!-- Expenses List -->
      <ExpenseList :expenses="filteredExpenses" @edit-expense="editExpense" @delete-expense="deleteExpense" />

      <!-- Edit Dialog -->
      <ExpenseEditModal v-model:visible="showEditDialog" :expense="editingExpense" :categories="categories" @expense-updated="updateExpense" />
    </div>

    <Toast />

    <footer class="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
      &copy; {{ new Date().getFullYear() }} Lê Thanh Tuấn. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import ExpenseList from "./components/ExpenseList.vue";
import ExpenseFilters from "./components/ExpenseFilters.vue";
import ExportButton from './components/ExportButton.vue';
import ExpenseForm from "./components/ExpenseForm.vue";
import ExpenseEditModal from "./components/ExpenseEditModal.vue";

const toast = useToast()

const expenses = ref([])
const showEditDialog = ref(false)
const editingExpense = ref(null)

const categories = [
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

const filters = ref({
  dateFrom: null,
  dateTo: null,
  categories: [],
  type: null,
  minAmount: null,
  maxAmount: null
})

const filteredExpenses = computed(() => {
  return expenses.value.filter(expense => {
    const matchesDateFrom = !filters.value.dateFrom || new Date(expense.date) >= new Date(filters.value.dateFrom);
    const matchesDateTo = !filters.value.dateTo || new Date(expense.date) <= new Date(filters.value.dateTo);
    const matchesCategory = !filters.value.category ||
      (Array.isArray(filters.value.category)
        ? filters.value.category.some(cat => cat.value === expense.category)
        : filters.value.category.value === expense.category || filters.value.category === expense.category);
    const matchesType = !filters.value.type || expense.type === filters.value.type;
    const matchesMinAmount = !filters.value.minAmount || expense.amount >= parseFloat(filters.value.minAmount);
    const matchesMaxAmount = !filters.value.maxAmount || expense.amount <= parseFloat(filters.value.maxAmount);

    return matchesDateFrom && matchesDateTo && matchesCategory &&
      matchesType && matchesMinAmount && matchesMaxAmount;
  });
});

const loadData = () => {
  expenses.value = [
    { id: 1, date: '2025-01-01', type: 'income', category: 'Salary', description: 'January Salary', amount: 5000000 },
    { id: 2, date: '2025-01-05', type: 'expense', category: 'Food', description: 'Groceries', amount: 200000 },
    { id: 3, date: '2025-01-10', type: 'expense', category: 'Transport', description: 'Bus Ticket', amount: 15000 },
    { id: 4, date: '2025-01-15', type: 'income', category: 'Freelance', description: 'Project A', amount: 3000000 },
    { id: 5, date: '2025-01-20', type: 'expense', category: 'Utilities', description: 'Electricity Bill', amount: 800000 },
    { id: 6, date: '2025-01-25', type: 'expense', category: 'Entertainment', description: 'Movie Ticket', amount: 100000 },
  ]
}

// Methods
const addExpense = (expense) => {
  expenses.value.unshift({
    ...expense,
    id: Date.now()
  })
  // saveToLocalStorage()
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Đã thêm giao dịch mới',
    life: 3000
  })
}

const editExpense = (expense) => {
  editingExpense.value = { ...expense }
  showEditDialog.value = true
}

const updateExpense = (updatedExpense) => {
  const index = expenses.value.findIndex(e => e.id === updatedExpense.id)
  if (index !== -1) {
    expenses.value[index] = updatedExpense
    saveToLocalStorage()
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đã cập nhật giao dịch',
      life: 3000
    })
  }
  showEditDialog.value = false
}

const deleteExpense = (id) => {
  expenses.value = expenses.value.filter(e => e.id !== id)
  saveToLocalStorage()
  toast.add({
    severity: 'success',
    summary: 'Thành công',
    detail: 'Đã xóa giao dịch',
    life: 3000
  })
}


onMounted(() => {
  loadData()
})
</script>
