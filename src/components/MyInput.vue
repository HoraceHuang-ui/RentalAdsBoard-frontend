<script setup>
defineProps(['modelValue', 'placeholder', 'type'])
defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <input
    v-if="type === 'input'"
    class="px-2 rounded-full border border-green-700 h-8"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change')"
  />

  <input
    v-else-if="type === 'password'"
    type="password"
    class="px-2 rounded-full border border-green-700 h-8"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change')"
  />

  <textarea
    v-else-if="type === 'textarea'"
    class="rounded-3xl px-4 py-2 border border-green-700"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    @change="$emit('change')"
  />
</template>

<style scoped></style>