<template>
    <Card class="shadow-md border border-gray-200 dark:border-gray-700">
        <template #title>
            <div class="flex items-center justify-between cursor-pointer" @click="toggleForm">
                <div class="flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
                    <i class="pi pi-plus text-green-600"></i>
                    <span>Thêm giao dịch mới</span>
                </div>
                <Button :icon="isFormCollapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" @click.stop="toggleForm" text rounded size="small"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </div>
        </template>
        <template #content>
            <div class="overflow-hidden transition-all duration-300 ease-in-out"
                :class="isFormCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'">
                <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
                    <!-- Date -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày <span class="text-red-500">*</span></label>
                        <Calendar v-model="form.date" dateFormat="yy-mm-dd" showIcon :class="{ 'p-invalid': errors.date }" class="w-full" />
                        <small v-if="errors.date" class="p-error">{{ errors.date }}</small>
                    </div>

                    <!-- Type -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Loại <span class="text-red-500">*</span></label>
                        <Dropdown v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Chọn loại"
                            :class="{ 'p-invalid': errors.type }" class="w-full" />
                        <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
                    </div>

                    <!-- Category -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục <span class="text-red-500">*</span></label>
                        <Dropdown v-model="form.category" :options="categories" optionLabel="label" optionValue="value" placeholder="Chọn danh mục"
                            :class="{ 'p-invalid': errors.category }" class="w-full">
                            <template #option="slotProps">
                                <div class="flex items-center gap-2">
                                    <i :class="slotProps.option.icon" class="text-sm"></i>
                                    <span>{{ slotProps.option.label }}</span>
                                </div>
                            </template>
                            <template #value="slotProps">
                                <div v-if="slotProps.value" class="flex items-center gap-2">
                                    <i :class="getSelectedCategoryIcon(slotProps.value)" class="text-sm"></i>
                                    <span>{{ getSelectedCategoryLabel(slotProps.value) }}</span>
                                </div>
                                <span v-else class="text-gray-500">{{ slotProps.placeholder }}</span>
                            </template>
                        </Dropdown>
                        <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
                    </div>

                    <!-- Amount -->
                    <div class="flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền <span class="text-red-500">*</span></label>
                        <InputNumber v-model="form.amount" mode="currency" currency="VND" locale="vi-VN" placeholder="0 ₫"
                            :class="{ 'p-invalid': errors.amount }" class="w-full [&_.p-inputnumber-input]:text-right" inputClass="text-right" />
                        <small v-if="errors.amount" class="p-error">{{ errors.amount }}</small>
                    </div>

                    <!-- Description -->
                    <div class="md:col-span-2 lg:col-span-6 flex flex-col gap-2">
                        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                        <TextArea v-model="form.description" rows="3" placeholder="Nhập mô tả chi tiết" class="w-full" />
                        <!-- <Editor v-model="form.description" editorStyle="height: 200px" placeholder="Nhập mô tả chi tiết" class="w-full" /> -->
                        <!-- Uncomment the Editor line above and comment TextArea if you prefer a rich text editor -->
                    </div>

                    <!-- Submit Button -->
                    <div class="md:col-span-2 lg:col-span-6 flex justify-end">
                        <Button type="submit" label="Thêm giao dịch" icon="pi pi-plus" :loading="loading" class="w-full md:w-auto" />
                    </div>
                </form>
            </div>
        </template>
    </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import TextArea from 'primevue/textarea'
import Button from 'primevue/button'

const emit = defineEmits(['expense-added'])

const isFormCollapsed = ref(false)

const toggleForm = () => {
    isFormCollapsed.value = !isFormCollapsed.value
}

const form = ref({
    date: new Date(),
    type: '',
    category: '',
    amount: null,
    description: ''
})

const errors = ref({})
const loading = ref(false)

const typeOptions = [
    { label: 'Thu nhập', value: 'income' },
    { label: 'Chi tiêu', value: 'expense' }
]

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

const getSelectedCategoryLabel = (value) => {
    const category = categories.find(cat => cat.value === value)
    return category ? category.label : value
}

const getSelectedCategoryIcon = (value) => {
    const category = categories.find(cat => cat.value === value)
    return category ? category.icon : 'pi pi-tag'
}

const validateForm = () => {
    errors.value = {}

    if (!form.value.date) {
        errors.value.date = 'Vui lòng chọn ngày'
    }

    if (!form.value.type) {
        errors.value.type = 'Vui lòng chọn loại giao dịch'
    }

    if (!form.value.category) {
        errors.value.category = 'Vui lòng chọn danh mục'
    }

    if (!form.value.amount || form.value.amount <= 0) {
        errors.value.amount = 'Vui lòng nhập số tiền hợp lệ'
    }

    return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
    if (!validateForm()) return

    loading.value = true

    console.log('Submitting expense:', form.value)

    try {
        const expense = {
            date: form.value.date.toISOString().split('T')[0],
            type: form.value.type,
            category: form.value.category,
            amount: form.value.amount,
            description: form.value.description || ''
        }

        emit('expense-added', expense)

        // Reset form
        form.value = {
            date: new Date(),
            type: '',
            category: '',
            amount: null,
            description: ''
        }
        errors.value = {}
    } finally {
        loading.value = false
    }
}
</script>
