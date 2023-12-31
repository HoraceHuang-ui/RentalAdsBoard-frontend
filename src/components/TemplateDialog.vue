<script setup lang="ts">
import { inject, ref } from 'vue'
import MyButton from '@/components/MyButton.vue'

defineProps({
  title: {
    type: String,
    default: 'Template dialog'
  },
  contents: {
    type: String
  },
  width: {
    type: String,
    default: '50%'
  },
  showCancel: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['onOk', 'onClose', 'onCancel'])

const show = inject('app/showDialog', false)
const unmount: () => void = inject('app/unmountDialog', () => undefined)
const cShow = ref(show)

const closeDialog = (timeout: number) => {
  cShow.value = false
  setTimeout(() => {
    unmount()
  }, timeout)
  emit('onClose')
}

const cancelClick = () => {
  emit('onCancel')
  closeDialog(500)
}

const okClick = () => {
  emit('onOk')
  // closeDialog(20000)
  emit('onClose')
}
</script>

<template>
  <transition :duration="600">
    <div v-if="cShow">
      <div
        class="outer absolute z-50 top-0 bottom-0 left-0 right-0 w-full h-full bg-black opacity-50"
        @click="closeDialog(500)"
      />
      <div
        class="inner absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl shadow-md shadow-gray-700 bg-green-100"
        :style="`width: ${width}`"
      >
        <div class="gs-b text-green-600 text-3xl mt-5 ml-6 mr-6">{{ title }}</div>
        <div class="ml-10 mr-6 mt-5">
          {{ contents }}
          <slot></slot>
        </div>
        <div class="flex flex-row justify-between mt-6">
          <div class="w-1"></div>
          <div class="flex flex-row">
            <my-button
              v-if="showCancel"
              @click="cancelClick"
              content-text="Cancel"
              class="text-gray-600 mr-2 mb-2 hover:bg-green-200 hover:text-green-800 active:scale-90 transition-all cursor-default"
            ></my-button>
            <my-button
              @click="okClick"
              content-text="Confirm"
              class="bg-green-700 text-white mr-2 mb-2 hover:bg-green-900 active:scale-90 transition-all cursor-default"
            ></my-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.v-enter-active .outer {
  transition: opacity 0.5s ease;
}

.v-leave-active .outer {
  transition: opacity 0.5s ease;
  transition-delay: 0.1s;
}

.v-enter-from .outer,
.v-leave-to .outer {
  opacity: 0;
}

.v-enter-active .inner {
  transition: all 0.3s ease;
  transition-delay: 0.2s;
}

.v-leave-active .inner {
  transition: all 0.3s ease;
}

.v-enter-from .inner,
.v-leave-to .inner {
  opacity: 0;
  transform: translate(-50%, -20%);
}
</style>