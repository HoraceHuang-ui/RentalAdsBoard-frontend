<script setup lang="ts">
import LoginCard from '@/views/LoginView/components/LoginCard.vue'
</script>

<template>
  <div class="main-wrapper flex flex-col">
    <div class="gs-b text-green-800 text-center text-5xl mb-1">Urban Haven Rentals</div>
    <div class="gs-r text-green-700 text-center text-xl mb-4">Rental Ad Board</div>
    <LoginCard class="mt-4" />
  </div>
</template>

<style scoped>
.main-wrapper {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
  width: 480px;
  min-height: 400px;
}
</style>