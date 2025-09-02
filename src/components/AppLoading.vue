<template>
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <ProgressSpinner strokeWidth="4" style="width: 60px; height: 60px" />
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import ProgressSpinner from 'primevue/progressspinner'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped></style>
