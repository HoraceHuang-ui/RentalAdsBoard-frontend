<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

defineProps(['height', 'width', 'showBar'])

const scrollRef = ref()
// const barRef = ref()

const trackHeight = ref(0) // 滚动条轨道高度
const wrapHeight = ref(0) // 容器可视高度
const wrapContentHeight = ref(0) // 内容高度
const translateY = ref(0)
const moveClientY = ref(0)
const isMove = ref(false)
const scrollTop = ref(0)

const heightPre = computed(() => {
  return wrapHeight.value / wrapContentHeight.value
})
const barHeight = computed(() => {
  return heightPre.value * trackHeight.value
})

const initScrollListener = () => {
  wrapContentHeight.value = scrollRef.value.scrollHeight
  wrapHeight.value = scrollRef.value.clientHeight - 40
  trackHeight.value = scrollRef.value.clientHeight
}

const updateScroll = () => {
  initScrollListener()
}

const onMouseWheel = (e) => {
  scrollY(e.target.scrollTop * heightPre.value)
}

const scrollY = (y) => {
  translateY.value = y
}
// 鼠标开始移动
const moveStart = (e) => {
  isMove.value = true
  // 开始移动时鼠标距离thumb顶部的位置
  moveClientY.value = e.clientY - translateY.value
  moveTo()
  moveEnd()
}
const moveTo = () => {
  document.onmousemove = (e) => {
    if (isMove.value) {
      if (e.clientY - moveClientY.value > trackHeight.value - barHeight.value) {
        translateY.value = trackHeight.value - barHeight.value
      } else if (e.clientY - moveClientY.value < 0) {
        translateY.value = 0
      } else {
        translateY.value = e.clientY - moveClientY.value
      }
      scrollRef.value.scrollTop = translateY.value / heightPre.value
    }
  }
}
// 鼠标移动结束
const moveEnd = () => {
  document.onmouseup = (e) => {
    if (isMove.value) {
      isMove.value = false
    }
  }
}

onMounted(() => {
  initScrollListener()
})
</script>

<template>
  <div class="overflow-hidden" :style="{ height: height, width: width }">
    <div class="h-full relative" style="margin-right: -16px">
      <div ref="scrollRef" class="h-full overflow-y-scroll" @scroll="onMouseWheel">
        <slot></slot>
      </div>
      <div
        v-show="heightPre <= 1 && showBar"
        ref="barRef"
        class="absolute top-5 right-4 bottom-5 w-0.5 rounded-full"
      >
        <div
          :style="{
            height: barHeight + 'px',
            transform: 'translate(-7px,' + translateY + 'px)'
          }"
          class="w-1 rounded-full bg-green-600 opacity-40 hover:w-2 hover:opacity-100 transition-all"
          @mousedown.stop.prevent="moveStart"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>