<template>
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between p-6 cursor-pointer" @click="toggleCollapse">
            <h3 class="font-heading text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <i class="pi pi-filter text-emerald-600"></i>
                Bộ lọc
                <span v-if="hasActiveFilters" class="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full ml-2">
                    {{ activeFiltersCount }}
                </span>
            </h3>
            <div class="flex items-center gap-2">
                <Button @click.stop="clearFilters" text severity="danger" size="small" class="text-slate-500 hover:text-emerald-600">
                    <i class="pi pi-times"></i>
                    Xóa bộ lọc
                </Button>
                <i :class="isCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" class="text-slate-500 transition-transform duration-200"></i>
            </div>
        </div>

        <!-- <CHANGE> Added collapsible content with smooth transition -->
        <Transition name="collapse">
            <div v-show="!isCollapsed" class="px-6 pb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <!-- Date Range Filter -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Từ ngày</label>
                        <Calendar v-model="localFilters.dateFrom" dateFormat="dd/mm/yy" placeholder="Chọn ngày" showIcon iconDisplay="input"
                            class="w-full" :class="{ 'ring-2 ring-emerald-500': localFilters.dateFrom }" />
                    </div>

                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Đến ngày</label>
                        <Calendar v-model="localFilters.dateTo" dateFormat="dd/mm/yy" placeholder="Chọn ngày" showIcon iconDisplay="input"
                            class="w-full" :class="{ 'ring-2 ring-emerald-500': localFilters.dateTo }" />
                    </div>

                    <!-- Category Filter -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Danh mục</label>
                        <MultiSelect v-model="localFilters.categories" filter :options="categories" optionLabel="label" optionValue="value"
                            placeholder="Chọn danh mục" class="w-full" :maxSelectedLabels="2" selectedItemsLabel="{0} danh mục đã chọn">
                            <template #option="{ option }">
                                <div class="flex items-center gap-2">
                                    <i :class="option.icon" class="text-sm"></i>
                                    <span>{{ option.label }}</span>
                                </div>
                            </template>
                        </MultiSelect>
                    </div>

                    <!-- Type Filter -->
                    <div class="space-y-2">
                        <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Loại</label>
                        <div class="flex gap-2">
                            <Button @click="toggleType('income')" :severity="localFilters.type === 'income' ? 'success' : 'secondary'"
                                :outlined="localFilters.type !== 'income'" size="small" class="flex-1">
                                <i class="pi pi-arrow-up mr-1"></i>
                                Thu nhập
                            </Button>
                            <Button @click="toggleType('expense')" :severity="localFilters.type === 'expense' ? 'danger' : 'secondary'"
                                :outlined="localFilters.type !== 'expense'" size="small" class="flex-1">
                                <i class="pi pi-arrow-down mr-1"></i>
                                Chi tiêu
                            </Button>
                        </div>
                    </div>
                </div>

                <!-- Amount Range Filter -->
                <div class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Số tiền tối thiểu</label>
                            <InputNumber v-model="localFilters.minAmount" mode="currency" currency="VND" locale="vi-VN" placeholder="0 ₫"
                                class="w-full" />
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium text-slate-600 dark:text-slate-300">Số tiền tối đa</label>
                            <InputNumber v-model="localFilters.maxAmount" mode="currency" currency="VND" locale="vi-VN" placeholder="0 ₫"
                                class="w-full" />
                        </div>
                    </div>
                </div>

                <!-- Apply Button and Active Filters Display -->
                <div class="mt-6 flex justify-end gap-4 items-center">
                    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
                        <span class="text-sm font-medium text-slate-600 dark:text-slate-300 mr-2">Bộ lọc đang áp dụng:</span>

                        <Tag v-if="localFilters.dateFrom" severity="info" class="text-xs">
                            Từ: {{ formatDate(localFilters.dateFrom) }}
                            <i class="pi pi-times ml-1 cursor-pointer" @click="localFilters.dateFrom = null"></i>
                        </Tag>

                        <Tag v-if="localFilters.dateTo" severity="info" class="text-xs">
                            Đến: {{ formatDate(localFilters.dateTo) }}
                            <i class="pi pi-times ml-1 cursor-pointer" @click="localFilters.dateTo = null"></i>
                        </Tag>

                        <Tag v-if="localFilters.type" :severity="localFilters.type === 'income' ? 'success' : 'danger'" class="text-xs">
                            {{ localFilters.type === 'income' ? 'Thu nhập' : 'Chi tiêu' }}
                            <i class="pi pi-times ml-1 cursor-pointer" @click="localFilters.type = null"></i>
                        </Tag>

                        <Tag v-for="category in localFilters.categories" :key="category" severity="secondary" class="text-xs">
                            {{ getCategoryLabel(category) }}
                            <i class="pi pi-times ml-1 cursor-pointer" @click="removeCategory(category)"></i>
                        </Tag>
                    </div>
                    <Button @click="applyFilters" class="flex items-center">
                        <i class="pi pi-check"></i>
                        Áp dụng
                    </Button>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Calendar from 'primevue/calendar'
import MultiSelect from 'primevue/multiselect'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

// Props
const props = defineProps({
    modelValue: {
        type: Object,
        default: () => ({})
    },
    categories: {
        type: Array,
        required: true
    }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// <CHANGE> Added collapse state management
const isCollapsed = ref(false)

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}

// ... existing code ...

// Local Filters
const localFilters = ref({
    dateFrom: props.modelValue.dateFrom || null,
    dateTo: props.modelValue.dateTo || null,
    categories: props.modelValue.categories || [],
    type: props.modelValue.type || null,
    minAmount: props.modelValue.minAmount || null,
    maxAmount: props.modelValue.maxAmount || null
})

// Sync with v-model
watch(() => props.modelValue, (newValue) => {
    localFilters.value = {
        ...localFilters.value,
        ...newValue
    }
}, { deep: true })

const hasActiveFilters = computed(() => {
    return localFilters.value.dateFrom ||
        localFilters.value.dateTo ||
        localFilters.value.categories.length > 0 ||
        localFilters.value.type ||
        localFilters.value.minAmount ||
        localFilters.value.maxAmount
})

const activeFiltersCount = computed(() => {
    let count = 0
    if (localFilters.value.dateFrom) count++
    if (localFilters.value.dateTo) count++
    if (localFilters.value.categories.length > 0) count += localFilters.value.categories.length
    if (localFilters.value.type) count++
    if (localFilters.value.minAmount) count++
    if (localFilters.value.maxAmount) count++
    return count
})

const toggleType = (type) => {
    localFilters.value.type = localFilters.value.type === type ? null : type
}

const removeCategory = (category) => {
    localFilters.value.categories = localFilters.value.categories.filter(c => c !== category)
}

const getCategoryLabel = (value) => {
    const option = props.categories.find(opt => opt.value === value)
    return option ? option.label : value
}

const formatDate = (date) => {
    return date ? date.toLocaleDateString('vi-VN') : ''
}

const applyFilters = () => {
    emit('update:modelValue', { ...localFilters.value })
}

const clearFilters = () => {
    localFilters.value = {
        dateFrom: null,
        dateTo: null,
        categories: [],
        type: null,
        minAmount: null,
        maxAmount: null
    }
    applyFilters()
}
</script>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
    opacity: 0;
    max-height: 0;
}

.collapse-enter-to,
.collapse-leave-from {
    opacity: 1;
    max-height: 1000px;
}
</style>