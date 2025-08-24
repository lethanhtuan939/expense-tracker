<template>
    <div class="mb-4 flex justify-end">
        <SplitButton label="Xuất Excel" icon="pi pi-download" @click="save" :model="items" />
    </div>
</template>

<script setup>
import SplitButton from 'primevue/splitbutton'
import * as XLSX from 'xlsx'

const props = defineProps({
    expenses: {
        type: Array,
        required: true
    }
})

const exportToExcel = () => {
    if (props.expenses.length === 0) return

    const data = props.expenses.map(expense => ({
        'Ngày': expense.date,
        'Loại': expense.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
        'Danh mục': expense.category,
        'Mô tả': expense.description,
        'Số tiền': expense.amount
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiêu')

    const fileName = `chi-tieu-${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
}

const items = [
    {
        label: 'Xuất CSV',
        command: () => {
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
        }
    },
    {
        label: 'Xuất PDF',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
        }
    }
];

const save = () => {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000 });
};
</script>