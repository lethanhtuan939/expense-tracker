<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Income -->
        <Card class="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <template #content>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-green-600 dark:text-green-400 text-sm font-medium">Thu nhập</p>
                        <p class="text-2xl font-bold text-green-700 dark:text-green-300">
                            {{ formatCurrency(totalIncome) }}
                        </p>
                    </div>
                    <i class="pi pi-arrow-up text-2xl text-green-600 dark:text-green-400"></i>
                </div>
            </template>
        </Card>

        <!-- Total Expense -->
        <Card class="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <template #content>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-red-600 dark:text-red-400 text-sm font-medium">Chi tiêu</p>
                        <p class="text-2xl font-bold text-red-700 dark:text-red-300">
                            {{ formatCurrency(totalExpense) }}
                        </p>
                    </div>
                    <i class="pi pi-arrow-down text-2xl text-red-600 dark:text-red-400"></i>
                </div>
            </template>
        </Card>

        <!-- Balance -->
        <Card class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <template #content>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-blue-600 dark:text-blue-400 text-sm font-medium">Số dư</p>
                        <p class="text-2xl font-bold" :class="balanceClass">
                            {{ formatCurrency(balance) }}
                        </p>
                    </div>
                    <i class="pi pi-wallet text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
            </template>
        </Card>

        <!-- Total Transactions -->
        <Card class="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <template #content>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-600 dark:text-purple-400 text-sm font-medium">Giao dịch</p>
                        <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
                            {{ expenses.length }}
                        </p>
                    </div>
                    <i class="pi pi-list text-2xl text-purple-600 dark:text-purple-400"></i>
                </div>
            </template>
        </Card>
    </div>

    <!-- Chart -->
    <Card class="mb-6">
        <template #title>
            <div class="flex items-center gap-2">
                <i class="pi pi-chart-pie text-blue-600"></i>
                <span>Biểu đồ chi tiêu theo danh mục</span>
            </div>
        </template>
        <template #content>
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full h-80" />
        </template>
    </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import { formatCurrency } from '@/utils/common.ts'

const props = defineProps({
    expenses: {
        type: Array,
        required: true
    }
})

// Computed properties
const totalIncome = computed(() => {
    return props.expenses
        .filter(e => e.type === 'income')
        .reduce((sum, e) => sum + e.amount, 0)
})

const totalExpense = computed(() => {
    return props.expenses
        .filter(e => e.type === 'expense')
        .reduce((sum, e) => sum + e.amount, 0)
})

const balance = computed(() => totalIncome.value - totalExpense.value)

const balanceClass = computed(() => {
    return balance.value >= 0
        ? 'text-green-700 dark:text-green-300'
        : 'text-red-700 dark:text-red-300'
})

const chartData = computed(() => {
    const expensesByCategory = {}
    props.expenses
        .filter(e => e.type === 'expense')
        .forEach(expense => {
            expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount
        })

    return {
        labels: Object.keys(expensesByCategory),
        datasets: [{
            data: Object.values(expensesByCategory),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
            ]
        }]
    }
})

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
}

</script>