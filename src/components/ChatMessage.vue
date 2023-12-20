<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

const props = defineProps({
  timeout: {
    type: Number,
    default: 4000
  },
  msg: {
    type: String,
    default: 'Template message'
  },
  userFrom: {
    type: String,
    required: true
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})

const show = inject('app/showMessage', false)
const unmount: () => void = inject('app/unmountMessage', () => undefined)
const cShow = ref(show)

let timer: number | undefined = undefined

const hide = () => {
  cShow.value = false
  clearTimeout(timer)
  setTimeout(unmount, 350)
}

const msgClick = () => {
  props.onClick()
  hide()
}

const startCountdown = (timeout: number) => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
  timer = setTimeout(hide, timeout)
}

const stopCountdown = () => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

onMounted(() => {
  startCountdown(props.timeout)
})
</script>

<template>
  <transition name="slide-right">
    <div
      v-if="cShow"
      class="absolute top-4 right-4 flex flex-row z-50 cursor-default"
      @mouseenter="stopCountdown"
      @mouseleave="startCountdown(1000)"
    >
      <div
        class="w-max py-2 px-3 bg-white rounded-2xl border border-blue-600 shadow-2xl shadow-blue-100 text-blue-700 hover:bg-blue-50 hover:shadow-blue-300 transition-all cursor-pointer"
        @click="msgClick"
      >
        <div class="flex flex-row opacity-80">
          <i class="bi bi-person-circle mr-2" />
          <div class="pr-6">{{ userFrom }}</div>
        </div>
        <div
          class="text-black"
          style="overflow-wrap: break-word; word-break: break-word; max-width: 30vw"
        >
          {{ msg }}
        </div>
      </div>
      <div
        class="absolute top-1 right-1 text-center w-6 h-6 rounded-full text-blue-600 hover:text-white hover:bg-blue-600 transition-all"
        @click="hide"
      >
        <i class="bi bi-x text-lg" />
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-right-enter-active {
  transition: all 0.3s ease-out;
}

.slide-right-leave-active {
  transition: all 0.3s ease-in;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>