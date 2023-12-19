<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue', 'submit', 'clear'])

const mouseActive = ref(false)
const focusActive = ref(false)
const active = computed(() => mouseActive.value || focusActive.value)

const inputRef = ref<HTMLInputElement>()

const enterPress = () => {
  if (inputRef.value) {
    inputRef.value.blur()
    emit('submit')
  }
}

const clearClick = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div
    class="absolute right-4 top-2 z-20 bg-white shadow-green-200 shadow-xl border border-green-300 mr-2 rounded-full"
  >
    <div
      class="px-2.5 flex flex-row h-9 transition-all"
      style="transition-duration: 0.5s"
      :class="active ? 'w-80' : 'w-9'"
      @mouseenter="mouseActive = true"
      @mouseleave="mouseActive = false"
    >
      <i class="bi bi-search my-1.5" />
      <transition name="fade" :duration="500">
        <div v-show="active" class="flex flex-row">
          <input
            ref="inputRef"
            :value="modelValue"
            placeholder="Search keywords..."
            @input="$emit('update:modelValue', $event.target.value)"
            @keyup.native.enter="enterPress"
            @focusin="focusActive = true"
            @focusout="focusActive = false"
            class="ml-4 border-b pl-2 my-1.5"
            style="width: 15rem"
          />
          <div
            class="icon-button"
            :class="modelValue === '' ? 'icon-button-disabled' : 'icon-button-enabled'"
            @click="clearClick"
          >
            <i class="bi bi-x" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.icon-button {
  @apply w-7 h-7 text-xl rounded-full ml-2 mt-1 cursor-pointer text-center;
}

.icon-button-enabled {
  @apply text-green-600 bg-green-100 hover:bg-green-600 hover:text-green-100 transition-all;
}

.icon-button-disabled {
  @apply text-gray-300 cursor-default;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.4s ease;
  transition-delay: 0.1s;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}
</style>