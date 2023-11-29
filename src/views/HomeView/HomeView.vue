<script setup lang="ts">
import LoginCard from '@/views/HomeView/components/LoginCard.vue'
</script>

<template>
  <div class="bg-green-100 absolute top-0 left-0 bottom-0 right-0 z-0"></div>
  <div class="flex flex-col relative z-10">
    <div class="gs-b text-green-800 text-center text-5xl mb-4">Rental Ads Board</div>
    <LoginCard class="mt-4" />
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>