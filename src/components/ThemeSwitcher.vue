<template>
    <Button :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'" @click="toggleTheme" rounded text
        :aria-label="isDark ? 'Light Mode' : 'Dark Mode'" class="w-10 h-10" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

const isDark = ref(false)

const toggleTheme = () => {
    isDark.value = !isDark.value
    updateTheme()
}

const updateTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
    }
}

onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDark.value = true;
    } else {
        isDark.value = false;
    }
    updateTheme();
});
</script>