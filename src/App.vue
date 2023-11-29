<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView class="router-view" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.router-view {
  width: 100%;
  height: 100%;
}
</style>