<script setup lang="ts">
defineProps(['contentText'])
</script>

<template>
  <div class="h-8 rounded-full px-3 py-1">
    <div class="gs-r">
      <slot></slot>
      {{ contentText }}
    </div>
  </div>
</template>

<style scoped></style>