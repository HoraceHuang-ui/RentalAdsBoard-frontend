<script setup lang="ts">
const props = defineProps(['textL', 'textR', 'modelValue', 'wrapperWidth', 'trackWidth'])
const emit = defineEmits(['update:modelValue'])

const switchStatus = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div
    class="rounded-full flex flex-row py-1 bg-green-200 relative cursor-pointer"
    :style="`width: ${wrapperWidth}`"
    @click="switchStatus"
  >
    <div
      class="rounded-full bg-green-600 w-1/2 absolute top-0 bottom-0 z-0 transition-all"
      :style="modelValue ? 'left: 0' : `left: ${trackWidth}`"
    ></div>
    <div
      class="rounded-full w-1/2 absolute z-10 top-1.5 left-0 text-center transition-all"
      :class="{ 'text-white': modelValue }"
    >
      {{ textL }}
    </div>
    <div
      class="rounded-full w-1/2 absolute z-10 top-1.5 right-0 text-center transition-all"
      :class="{ 'text-white': !modelValue }"
    >
      {{ textR }}
    </div>
  </div>
</template>

<style scoped></style>