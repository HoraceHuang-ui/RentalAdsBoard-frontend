<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

const props = defineProps({
  timeout: {
    type: Number,
    default: 5000
  },
  msg: {
    type: String,
    default: 'Template message'
  },
  type: {
    // 'info', 'alert', 'success', 'warn'
    type: String,
    default: 'info'
  }
})

const show = inject('app/showMessage', false)
const unmount: () => void = inject('app/unmountMessage', () => undefined)
const cShow = ref(show)

function startCountdown() {
  setTimeout(() => {
    cShow.value = false
    setTimeout(() => {
      unmount()
    }, 350)
  }, props.timeout)
}

onMounted(() => {
  startCountdown()
})
</script>

<template>
  <transition name="slide-top">
    <div
      v-if="cShow"
      class="absolute top-4 justify-center flex flex-row z-50 cursor-default pointer-events-none"
      style="width: 95vw"
    >
      <div
        v-if="type === 'alert'"
        class="w-max py-1 bg-red-500 rounded-3xl border border-red-100 shadow-2xl shadow-red-300 flex flex-row text-red-100"
      >
        <i class="bi bi-exclamation-circle-fill mx-2 text-3xl h-full" />
        <div class="text-xl mr-3 py-1" style="max-width: 70vw">
          {{ msg }}
        </div>
      </div>
      <div
        v-else-if="type === 'success'"
        class="w-max py-1 bg-green-500 rounded-3xl border border-green-100 shadow-2xl shadow-green-400 flex flex-row text-green-100"
      >
        <i class="bi bi-check-circle-fill mx-2 text-3xl h-full" />
        <div class="text-xl mr-3 py-1" style="max-width: 70vw">
          {{ msg }}
        </div>
      </div>
      <div
        v-else-if="type === 'warn'"
        class="w-max py-1 bg-white rounded-3xl border border-orange-600 shadow-2xl shadow-orange-300 flex flex-row text-orange-600"
      >
        <i class="bi bi-exclamation-circle-fill mx-2 text-3xl h-full" />
        <div class="text-xl mr-3 py-1" style="max-width: 70vw">
          {{ msg }}
        </div>
      </div>
      <div
        v-else
        class="w-max py-1 bg-white rounded-3xl border border-green-600 shadow-2xl shadow-green-400 flex flex-row text-green-700"
      >
        <i class="bi bi-info-circle-fill mx-2 text-3xl h-full" />
        <div class="text-xl mr-3 py-1" style="max-width: 70vw">
          {{ msg }}
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-top-enter-active {
  transition: all 0.3s ease-out;
}

.slide-top-leave-active {
  transition: all 0.3s ease-in;
}

.slide-top-enter-from,
.slide-top-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>