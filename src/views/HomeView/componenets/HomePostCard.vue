<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import { computed, onMounted, ref } from 'vue'
import { ApiGet } from '@/utils/req'
import { marked } from 'marked'

const props = defineProps(['ad'])

const image = ref<string>('')
const adUser = ref<any>({})

const clipString = (str: string, targetLen: number) => {
  let len = 0
  let i = 0
  for (; i < str.length; i++) {
    let charCode = str.charCodeAt(i)
    if (charCode < 128) {
      len += 1
    } else {
      len += 2
    }
    if (len >= targetLen) {
      break
    }
  }
  if (i == str.length) {
    return str
  }
  return str.substring(0, i + 1) + '...'
}

onMounted(() => {
  ApiGet(`picture/get/first?ad_id=${props.ad.adId}`)
    .then((resp) => {
      if (resp.data.obj) {
        image.value = resp.data.obj.pictureBase64
      }
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <card-template
    :title="clipString(ad.title, 20)"
    class="flex flex-col relative border border-gray-400 rounded-3xl pb-6 hover:border-green-600 hover:shadow-md hover:shadow-green-100 hover:-translate-y-1 hover:bg-green-50 transition-all cursor-pointer"
    style="transition-duration: 300ms; max-height: 50vh"
  >
    <div v-if="image !== ''" class="px-4 py-2 flex flex-row justify-center">
      <img
        class="rounded-xl mx-3 object-cover"
        style="width: max-content; height: 20vh"
        :src="image"
        :alt="`first image of ${ad.title}`"
      />
    </div>
    <div class="h-full overflow-hidden mx-6 mt-2 mb-5 rounded-lg">
      <div class="body-detail" v-html="marked(ad.description)"></div>
    </div>
    <div class="flex flex-row absolute left-2 bottom-2">
      <div class="flex flex-row rounded-2xl border border-gray-400 px-3 py-1 bg-white">
        <i class="bi bi-geo-alt-fill" />
        <span class="ml-2">
          {{ clipString(ad.address, 20) }}
        </span>
      </div>
      <div class="flex flex-row rounded-2xl border border-gray-400 px-3 py-1 ml-3 mr-2 bg-white">
        <i class="bi bi-person-circle" />
        <div class="ml-2">{{ ad.username }}</div>
      </div>
    </div>
  </card-template>
</template>

<style scoped></style>