<script setup lang="ts">
const props = defineProps({
  title: String,
  divisor: Boolean
})
</script>

<template>
  <div class="card-wrapper pt-2">
    <div class="font-bold text-2xl gs-b text-green-800 text-center">{{ props.title }}</div>
    <div class="mt-5"></div>
    <div class="h-0.5 bg-green-400 mx-5" v-if="props.divisor"></div>
    <div class="mb-3"></div>
    <slot></slot>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.card-wrapper {
  min-width: 200px;
  min-height: 50px;
}
</style>