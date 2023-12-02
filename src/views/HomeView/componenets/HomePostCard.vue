<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import { onMounted, ref } from 'vue'
import { ApiGet } from '@/utils/req'

const props = defineProps(['ad'])

const image = ref<string>('')
const adUser = ref<any>({})

const clipString = (str: string, len: number) => {
  if (str.length > len) {
    str = str.substring(0, len + 1) + '...'
  }
  return str
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

  ApiGet(`board/home?user_id=${props.ad.userId}`).then((resp) => {
    if (resp.data.obj) {
      adUser.value = resp.data.obj
    }
  })
})
</script>

<template>
  <card-template
    :title="ad.title"
    class="border border-gray-400 rounded-3xl relative pb-6 hover:border-green-600 hover:shadow-md hover:shadow-green-100 hover:-translate-y-1 hover:bg-green-50 transition-all cursor-pointer"
    style="transition-duration: 300ms"
  >
    <div v-if="image !== ''" class="px-4 py-2 flex flex-row justify-center">
      <img
        class="rounded-xl mx-3 object-cover"
        style="width: max-content; height: 20vh"
        :src="image"
        :alt="`first image of ${ad.title}`"
      />
    </div>
    <div class="body-detail gst-r m-6">{{ ad.description }}</div>
    <div class="flex flex-row absolute bottom-2 left-2">
      <div class="flex flex-row rounded-full border border-gray-400 px-3 py-1 bg-white">
        <i class="bi bi-geo-alt-fill" />
        <span class="gst-r ml-2">
          {{ clipString(ad.address, 25) }}
        </span>
      </div>
      <div class="flex flex-row rounded-full border border-gray-400 px-3 py-1 ml-3 bg-white">
        <i class="bi bi-person-circle" />
        <div class="gst-r ml-2">{{ adUser.username }}</div>
      </div>
    </div>
  </card-template>
</template>

<style scoped></style>