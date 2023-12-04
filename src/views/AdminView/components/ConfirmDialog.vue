<script setup lang="ts">
import TemplateDialog from '@/components/TemplateDialog.vue'
import { inject, ref } from 'vue'

const props = defineProps(['title', 'contents', 'onOk'])

const show = inject('app/showDialog', false)
const unmount: () => void = inject('app/unmountDialog', () => undefined)
const cShow = ref(show)

const closeDialog = (timeout: number) => {
  cShow.value = false
  setTimeout(() => {
    unmount()
  }, timeout)
}

const confirmClick = () => {
  closeDialog(500)
  props.onOk()
}
</script>

<template>
  <template-dialog
    width="40%"
    :title="title"
    :contents="contents"
    :show-cancel="true"
    @on-ok="confirmClick"
  />
</template>

<style scoped></style>