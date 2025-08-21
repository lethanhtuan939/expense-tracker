<template>
    <Card>
        <template #title>
            <div class="flex items-center gap-2">
                <i class="pi pi-filter text-blue-600"></i>
                <span>Bộ lọc</span>
            </div>
        </template>
        <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Date From -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Từ ngày</label>
                    <Calendar v-model="localFilters.dateFrom" dateFormat="yy-mm-dd" showIcon placeholder="Chọn ngày" />
                </div>

                <!-- Date To -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Đến ngày</label>
                    <Calendar v-model="localFilters.dateTo" dateFormat="yy-mm-dd" showIcon placeholder="Chọn ngày" />
                </div>

                <!-- Category -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
                    <Dropdown v-model="localFilters.category" :options="categoryOptions" placeholder="Chọn danh mục" showClear />
                </div>

                <!-- Type -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Loại</label>
                    <Dropdown v-model="localFilters.type" :options="typeOptions" placeholder="Chọn loại" showClear />
                </div>

                <!-- Min Amount -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền tối thiểu</label>
                    <InputNumber v-model="localFilters.minAmount" mode="currency" currency="VND" locale="vi-VN" placeholder="0" />
                </div>

                <!-- Max Amount -->
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền tối đa</label>
                    <InputNumber v-model="localFilters.maxAmount" mode="currency" currency="VND" locale="vi-VN" placeholder="0" />
                </div>
            </div>

            <div class="flex gap-2 mt-4">
                <Button label="Xóa bộ lọc" icon="pi pi-times" severity="secondary" @click="clearFilters" size="small" />
            </div>
        </template>
    </Card>
</template>

<script setup>
import { computed, watch } from 'vue'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const props = defineProps({
    filters: {
        type: Object,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:filters'])

const localFilters = computed({
    get: () => props.filters,
    set: (value) => emit('update:filters', value)
})

const categoryOptions = computed(() => {
    return props.categories.map(cat => ({ label: cat, value: cat }))
})

const typeOptions = [
    { label: 'Thu nhập', value: 'income' },
    { label: 'Chi tiêu', value: 'expense' }
]

const clearFilters = () => {
    localFilters.value = {
        dateFrom: '',
        dateTo: '',
        category: '',
        type: '',
        minAmount: '',
        maxAmount: ''
    }
}

// Watch for changes and emit
watch(localFilters, (newFilters) => {
    emit('update:filters', newFilters)
}, { deep: true })
</script>