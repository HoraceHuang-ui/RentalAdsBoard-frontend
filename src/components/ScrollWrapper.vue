<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  height: {
    type: String,
    default: '100%'
  },
  width: {
    type: String,
    default: '100%'
  },
  showBar: {
    type: Boolean,
    default: true
  },
  scrollPadding: {
    type: Number,
    default: 5
  },
  stickBottom: {
    type: Boolean,
    default: false
  }
})

const outerRef = ref()
const innerRef = ref()
// const barRef = ref()

// const trackHeight = computed(() => {
//   if (props.wrapperHeight) {
//     return props.wrapperHeight
//   }
//   return scrollRef.value ? scrollRef.value.clientHeight : 0
// }) // 轨道高度
// const wrapContentHeight = computed(() => {
//   if (props.scrollHeight) {
//     // console.log('滚动条轨道高度 trackHeight: ' + trackHeight.value)
//     // console.log('内容高度 wrapContentHeight: ' + props.scrollHeight)
//     // console.log('---------------')
//     return props.scrollHeight
//   }
//   return scrollRef.value ? scrollRef.value.scrollHeight : 0
// }) // 内容滚动高度
const trackHeight = ref(0)
const wrapContentHeight = ref(0)

const translateY = ref(0)
const moveClientY = ref(0)
const isMove = ref(false)

const heightPre = computed(() => {
  return trackHeight.value / wrapContentHeight.value
})
const barHeight = computed(() => {
  return heightPre.value * trackHeight.value
})

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
      outerRef.value.scrollTop = translateY.value / heightPre.value
    }
  }
}
// 鼠标移动结束
const moveEnd = () => {
  document.onmouseup = () => {
    if (isMove.value) {
      isMove.value = false
    }
  }
}

const innerResizeObserver = new ResizeObserver(() => {
  if (innerRef.value) {
    wrapContentHeight.value = innerRef.value.scrollHeight
  }
  if (props.stickBottom) {
    outerRef.value.scrollTo({
      top: wrapContentHeight.value,
      behavior: 'smooth'
    })
    scrollY(wrapContentHeight.value)
  }
})
const outerResizeObserver = new ResizeObserver(() => {
  if (outerRef.value) {
    trackHeight.value = outerRef.value.clientHeight
  }
  if (props.stickBottom) {
    outerRef.value.scrollTo({
      top: wrapContentHeight.value,
      behavior: 'smooth'
    })
    scrollY(wrapContentHeight.value)
  }
})

onMounted(() => {
  innerResizeObserver.observe(innerRef.value)
  outerResizeObserver.observe(outerRef.value)
})
</script>

<template>
  <div class="overflow-hidden" :style="{ height: height, width: width }">
    <div class="h-full relative" style="margin-right: -16px">
      <div ref="outerRef" class="h-full overflow-y-scroll" @scroll="onMouseWheel">
        <div ref="innerRef">
          <slot />
        </div>
      </div>
      <div class="absolute top-0 bottom-0 right-4 w-0.5 rounded-full">
        <div
          v-show="heightPre < 1 && showBar"
          :style="{
            height: barHeight + 'px',
            transform:
              'translate(-7px,' +
              ((scrollPadding ? scrollPadding : 5) +
                translateY -
                (translateY / (trackHeight - barHeight)) *
                  2 *
                  (scrollPadding ? scrollPadding : 5)) +
              'px)'
          }"
          style="transition-property: height, width; transition-duration: 0.2s"
          class="w-1 rounded-full bg-green-600 opacity-40 hover:w-2 hover:opacity-100"
          @mousedown.stop.prevent="moveStart"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>