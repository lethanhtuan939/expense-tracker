<template>
    <Dialog v-model:visible="localVisible" modal header="Thêm giao dịch mới" :style="{ width: '700px', maxWidth: '90vw' }" contentClass="p-4"
        @hide="handleCancel">
        <form @submit.prevent="submitForm" class="space-y-4 p-2">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Ngày <span class="text-red-500">*</span></label>
                    <Calendar v-model="form.date" dateFormat="yy-mm-dd" showIcon :class="{ 'p-invalid': errors.date }" class="w-full" />
                    <small v-if="errors.date" class="p-error">{{ errors.date }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Loại <span class="text-red-500">*</span></label>
                    <Dropdown v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Chọn loại"
                        :class="{ 'p-invalid': errors.type }" class="w-full" />
                    <small v-if="errors.type" class="p-error">{{ errors.type }}</small>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Hình thức thanh toán <span
                            class="text-red-500">*</span></label>
                    <Dropdown v-model="form.paymentMethod"
                        :options="[{ label: 'Chuyển khoản', value: 'Chuyển khoản' }, { label: 'Tiền mặt', value: 'Tiền mặt' }]" optionLabel="label"
                        optionValue="value" placeholder="Chọn hình thức" class="w-full" />
                    <small v-if="errors.paymentMethod" class="p-error">{{ errors.paymentMethod }}</small>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền <span class="text-red-500">*</span></label>
                <InputNumber v-model="form.amount" mode="currency" currency="VND" locale="vi-VN" placeholder="0 ₫"
                    :class="{ 'p-invalid': errors.amount }" class="w-full" />
                <small v-if="errors.amount" class="p-error">{{ errors.amount }}</small>
            </div>

            <div class="flex flex-col gap-2">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                <TextArea v-model="form.description" rows="3" placeholder="Nhập mô tả chi tiết" class="w-full" />
            </div>

            <div class="flex justify-end pt-2">
                <Button type="button" label="Hủy" icon="pi pi-times" @click="handleCancel" class="p-button-text p-button-danger mr-4" />
                <Button type="submit" label="Thêm mới" icon="pi pi-plus" :loading="loading" class="w-full md:w-auto" />
            </div>
        </form>
    </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import TextArea from 'primevue/textarea'
import Button from 'primevue/button'

const emit = defineEmits(['expense-added', 'close', 'update:visible'])

const props = defineProps({
    visible: Boolean,
    categories: Array
})

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
    localVisible.value = val
})

watch(localVisible, (val) => {
    emit('update:visible', val)
})

const handleCancel = () => {
    resetForm()
    emit('close')
}

const form = ref({
    date: new Date(),
    type: '',
    category: '',
    amount: null,
    paymentMethod: '',
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

    if (!form.value.paymentMethod) {
        errors.value.paymentMethod = 'Vui lòng chọn hình thức thanh toán'
    }
    return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
    if (!validateForm()) return

    loading.value = true

    try {
        const expense = {
            date: form.value.date.toISOString().split('T')[0],
            type: form.value.type,
            category: form.value.category,
            amount: form.value.amount ?? 0,
            paymentMethod: form.value.paymentMethod,
            description: form.value.description || ''
        }

        emit('expense-added', expense)

        form.value = {
            date: new Date(),
            type: '',
            category: '',
            amount: null,
            paymentMethod: '',
            description: ''
        }
        errors.value = {}
    } finally {
        loading.value = false
    }
}

const resetForm = () => {
    form.value = {
        date: new Date(),
        type: '',
        category: '',
        amount: null,
        paymentMethod: '',
        description: ''
    }
    errors.value = {}
}
</script>