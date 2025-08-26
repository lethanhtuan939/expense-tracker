<template>
    <Card>
        <template #title>
            <div class="flex items-center gap-2">
                <i class="pi pi-list text-blue-600"></i>
                <span>Danh sách giao dịch ({{ expenses.length }})</span>
            </div>
        </template>
        <template #content>
            <DataTable :value="expenses" paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" sortMode="multiple" removableSort
                class="p-datatable-sm" :globalFilterFields="['description', 'category']" v-model:filters="filters" filterDisplay="row">
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-semibold">Giao dịch</span>
                        <IconField iconPosition="left">
                            <InputIcon class="pi pi-search" />
                            <InputText v-model="filters['global'].value" placeholder="Tìm kiếm..." />
                        </IconField>
                    </div>
                </template>

                <Column header="No">
                    <template #body="{ index }">
                        <span>{{ index + 1 }}</span>
                    </template>
                </Column>
                <Column field="date" header="Ngày" sortable>
                    <template #body="{ data }">
                        <span class="font-medium">{{ formatDate(data.date) }}</span>
                    </template>
                </Column>

                <Column field="type" header="Loại" sortable>
                    <template #body="{ data }">
                        <Tag :value="data.type === 'income' ? 'Thu nhập' : 'Chi tiêu'" :severity="data.type === 'income' ? 'success' : 'danger'" />
                    </template>
                </Column>

                <Column field="category" header="Danh mục" sortable>
                    <template #body="{ data }">
                        <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                            {{ data.category }}
                        </span>
                    </template>
                </Column>

                <Column field="description" header="Mô tả">
                    <template #body="{ data }">
                        <span class="text-gray-600 dark:text-gray-400">
                            {{ data.description || '-' }}
                        </span>
                    </template>
                </Column>

                <Column field="paymentMethod" header="Hình thức">
                    <template #body="{ data }">
                        <span class="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            {{ data.paymentMethod || '-' }}
                        </span>
                    </template>
                </Column>

                <Column field="amount" header="Số tiền" sortable>
                    <template #body="{ data }">
                        <span class="font-bold" :class="data.type === 'income' ? 'text-green-600' : 'text-red-600'">
                            {{ formatCurrency(data.amount) }}
                        </span>
                    </template>
                </Column>

                <Column header="Thao tác" :exportable="false">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" size="small" text rounded @click="$emit('edit-expense', data)" v-tooltip.top="'Sửa'" />
                            <Button icon="pi pi-trash" size="small" text rounded severity="danger" @click="confirmDelete(data)"
                                v-tooltip.top="'Xóa'" />
                        </div>
                    </template>
                </Column>

                <template #empty>
                    <div class="text-center py-8">
                        <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                        <p class="text-gray-500">Chưa có giao dịch nào</p>
                    </div>
                </template>
            </DataTable>
        </template>
    </Card>

    <ConfirmDialog />
</template>

<script setup>
import { ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import ConfirmDialog from 'primevue/confirmdialog'
import { formatDate, formatCurrency } from '@/utils/common.js'

const props = defineProps({
    expenses: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['edit-expense', 'delete-expense'])

const confirm = useConfirm()

const filters = ref({
    global: { value: null, matchMode: 'contains' }
})

const confirmDelete = (expense) => {
    confirm.require({
        message: `Bạn có chắc chắn muốn xóa giao dịch "${expense.description || expense.category}" không?`,
        header: 'Xác nhận xóa',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Hủy',
        acceptLabel: 'Xóa',
        accept: () => {
            emit('delete-expense', expense.id)
        }
    })
}
</script>