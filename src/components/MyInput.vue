<script setup>
defineProps(['modelValue', 'placeholder'])
defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <input
    class="px-2 rounded-full border border-green-700 h-8"
    :placeholder="placeholder"
    style="margin: 1px"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change')"
  />
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>