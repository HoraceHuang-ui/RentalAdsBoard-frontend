<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps({
  progressArr: {
    type: Array<Boolean>,
    default: []
  }
})

const percentage80 = computed(() => {
  let i = 0
  for (const e of props.progressArr) {
    if (e) i++
  }
  if (props.progressArr.length > 0) {
    return (i / props.progressArr.length) * 80
  } else {
    return 80
  }
})

const show = computed(() => props.progressArr.length > 0 && percentage80.value < 80)

const initPercentage = ref(0)

watch(show, () => {
  if (show.value) {
    setTimeout(() => {
      initPercentage.value = 20
    }, 5)
  } else {
    initPercentage.value = 0
  }
})
</script>

<template>
  <transition name="fade">
    <div
      v-show="progressArr.length > 0 && percentage80 < 80"
      class="absolute top-0 left-0 right-0"
      style="width: 100%; z-index: 999"
    >
      <div
        class="h-1 bg-green-600 transition-all"
        :style="`width: ${initPercentage + percentage80}%`"
        style="transition-duration: 0.6s"
      ></div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition-delay: 1s;
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>