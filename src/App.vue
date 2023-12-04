<script setup lang="ts">
import { RouterView } from 'vue-router'
import TopProgressBar from '@/components/TopProgressBar.vue'
import { inject } from 'vue'

const progressArr = inject('topProgressArr')
</script>

<template>
  <top-progress-bar :progress-arr="progressArr" />
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
</style>