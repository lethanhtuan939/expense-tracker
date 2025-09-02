<template>
    <Dialog v-model:visible="localVisible" modal :header="'Chỉnh sửa giao dịch'" :style="{ width: '50rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" @hide="resetForm">
        <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
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

            <!-- Payment Method -->
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Hình thức thanh toán <span class="text-red-500">*</span></label>
                <Dropdown v-model="form.paymentMethod"
                    :options="[{ label: 'Chuyển khoản', value: 'Chuyển khoản' }, { label: 'Tiền mặt', value: 'Tiền mặt' }]" optionLabel="label"
                    optionValue="value" placeholder="Chọn hình thức" class="w-full" />
                <small v-if="errors.paymentMethod" class="p-error">{{ errors.paymentMethod }}</small>
            </div>

            <!-- Amount -->
            <div class="flex flex-col gap-2 md:col-span-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền <span class="text-red-500">*</span></label>
                <InputNumber v-model="form.amount" mode="currency" currency="VND" locale="vi-VN" placeholder="0 ₫"
                    :class="{ 'p-invalid': errors.amount }" class="w-full" />
                <small v-if="errors.amount" class="p-error">{{ errors.amount }}</small>
            </div>

            <!-- Description -->
            <div class="md:col-span-2 flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                <TextArea v-model="form.description" rows="3" placeholder="Nhập mô tả chi tiết" class="w-full" />
            </div>
        </form>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Hủy" icon="pi pi-times" text @click="closeModal" />
                <Button label="Cập nhật" icon="pi pi-check" :loading="loading" @click="submitForm" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import TextArea from 'primevue/textarea'
import Button from 'primevue/button'

const props = defineProps({
    visible: Boolean,
    expense: Object,
    categories: Array
})

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
    localVisible.value = val
})

watch(localVisible, (val) => {
    emit('update:visible', val)
})

const emit = defineEmits(['update:visible', 'expense-updated'])

const form = ref({
    no: 0,
    date: new Date(),
    type: '',
    category: '',
    paymentMethod: '',
    amount: 0,
    description: ''
})

const errors = ref({})
const loading = ref(false)

const typeOptions = [
    { label: 'Thu nhập', value: 'income' },
    { label: 'Chi tiêu', value: 'expense' }
]

watch(() => props.expense, (newExpense) => {
    if (newExpense) {
        form.value = {
            no: newExpense.no,
            date: new Date(newExpense.date),
            type: newExpense.type,
            category: newExpense.category,
            paymentMethod: newExpense.paymentMethod || '',
            amount: newExpense.amount,
            description: newExpense.description || ''
        }
    }
}, { immediate: true })

const getSelectedCategoryLabel = (value) => {
    const category = props.categories.find(cat => cat.value === value)
    return category ? category.label : value
}

const getSelectedCategoryIcon = (value) => {
    const category = props.categories.find(cat => cat.value === value)
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

    if (!form.value.paymentMethod) {
        errors.value.paymentMethod = 'Vui lòng chọn hình thức thanh toán'
    }

    if (!form.value.amount || form.value.amount <= 0) {
        errors.value.amount = 'Vui lòng nhập số tiền hợp lệ'
    }

    return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
    if (!validateForm()) return

    loading.value = true

    try {
        // Format date as YYYY-MM-DD in local timezone
        const pad = n => n < 10 ? '0' + n : n;
        const dateObj = form.value.date;
        const dateStr = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;

        const updatedExpense = {
            no: form.value.no,
            date: dateStr,
            type: form.value.type,
            category: form.value.category,
            paymentMethod: form.value.paymentMethod,
            amount: form.value.amount,
            description: form.value.description || ''
        }

        emit('expense-updated', updatedExpense)
        closeModal()
    } finally {
        loading.value = false
    }
}

const closeModal = () => {
    emit('update:visible', false)
}

const resetForm = () => {
    form.value = {
        no: 0,
        date: new Date(),
        type: '',
        category: '',
        paymentMethod: '',
        amount: 0,
        description: ''
    }
    errors.value = {}
}
</script>