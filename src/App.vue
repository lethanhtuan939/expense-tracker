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

      <div class="flex flex-col lg:flex-row gap-4 mb-6">
        <ExpenseFilters v-model:filters="filters" :categories="categories" class="flex-1" />
        <!-- <ExportButton :expenses="filteredExpenses" /> -->
      </div>

      <!-- Expenses List -->
      <ExpenseList :expenses="filteredExpenses" />
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import ExpenseList from "./components/ExpenseList.vue";
import ExpenseFilters from "./components/ExpenseFilters.vue";

const toast = useToast()

const expenses = ref([])
const showEditDialog = ref(false)
const editingExpense = ref(null)

const categories = [
  'Ăn uống', 'Di chuyển', 'Mua sắm', 'Giải trí',
  'Y tế', 'Giáo dục', 'Hóa đơn', 'Khác'
]

const filters = ref({
  dateFrom: '',
  dateTo: '',
  category: '',
  type: '',
  minAmount: '',
  maxAmount: ''
})


const filteredExpenses = computed(() => {
  return expenses.value.filter(expense => {
    const matchesDateFrom = !filters.value.dateFrom || expense.date >= filters.value.dateFrom
    const matchesDateTo = !filters.value.dateTo || expense.date <= filters.value.dateTo
    const matchesCategory = !filters.value.category || expense.category === filters.value.category
    const matchesType = !filters.value.type || expense.type === filters.value.type
    const matchesMinAmount = !filters.value.minAmount || expense.amount >= parseFloat(filters.value.minAmount)
    const matchesMaxAmount = !filters.value.maxAmount || expense.amount <= parseFloat(filters.value.maxAmount)

    return matchesDateFrom && matchesDateTo && matchesCategory &&
      matchesType && matchesMinAmount && matchesMaxAmount
  })
})

const loadData = () => {
  expenses.value = [
    { id: 1, date: '2023-01-01', type: 'income', category: 'Salary', description: 'January Salary', amount: 5000000 },
    { id: 2, date: '2023-01-05', type: 'expense', category: 'Food', description: 'Groceries', amount: 200000 },
    { id: 3, date: '2023-01-10', type: 'expense', category: 'Transport', description: 'Bus Ticket', amount: 15000 },
    { id: 4, date: '2023-01-15', type: 'income', category: 'Freelance', description: 'Project A', amount: 3000000 },
    { id: 5, date: '2023-01-20', type: 'expense', category: 'Utilities', description: 'Electricity Bill', amount: 800000 },
    { id: 6, date: '2023-01-25', type: 'expense', category: 'Entertainment', description: 'Movie Ticket', amount: 100000 },
  ]
}

onMounted(() => {
  loadData()
})
</script>
