<script setup lang="ts">
const props = defineProps(['modelValue', 'totalPages'])
const emit = defineEmits(['update:modelValue'])

const switchPageTo = (page: number) => {
  if (page < 1 || page > props.totalPages!!) {
    return
  }
  emit('update:modelValue', page)
}
</script>

<template>
  <div class="rounded-full shadow-green-200 shadow-xl px-1 py-1 border border-green-300 bg-white">
    <div class="flex flex-row">
      <div
        class="pagination-button"
        @click="switchPageTo(1)"
        :class="
          modelValue == 1 ? 'pagination-button-pages-disabled' : 'pagination-button-pages-enabled'
        "
      >
        <i class="bi bi-chevron-bar-left" />
      </div>
      <div
        v-for="idx in 5"
        :key="idx"
        @click="switchPageTo(modelValue - 3 + idx)"
        class="pagination-button gst-r"
        :class="
          modelValue - 3 + idx == modelValue
            ? 'pagination-button-nums-selected'
            : modelValue - 3 + idx <= 0 || modelValue - 3 + idx > totalPages
              ? 'pagination-button-nums-disabled'
              : 'pagination-button-nums-enabled'
        "
      >
        {{ modelValue - 3 + idx }}
      </div>
      <div
        class="pagination-button"
        @click="switchPageTo(totalPages)"
        :class="
          modelValue == totalPages
            ? 'pagination-button-pages-disabled'
            : 'pagination-button-pages-enabled'
        "
      >
        <i class="bi bi-chevron-bar-right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination-button {
  @apply w-7 h-7 text-lg rounded-full mx-1 cursor-pointer text-center;
}

.pagination-button-pages-enabled {
  @apply text-green-600 bg-green-100 hover:bg-green-600 hover:text-green-100 transition-all;
}

.pagination-button-pages-disabled {
  @apply text-gray-300 cursor-default;
}

.pagination-button-nums-enabled {
  @apply text-gray-700 border border-white hover:text-green-600 hover:border-green-600 transition-all;
}

.pagination-button-nums-disabled {
  @apply text-gray-300 border border-white cursor-default;
}

.pagination-button-nums-selected {
  @apply text-green-100 bg-green-600 border border-green-600;
}
</style>