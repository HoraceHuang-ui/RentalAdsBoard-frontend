<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import { computed, onMounted, ref } from 'vue'
import { AdsAPI, ApiDelete, ApiGet, ApiPost, PictureAPI } from '@/utils/req'
import { marked } from 'marked'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useRouter } from 'vue-router'

const props = defineProps(['ad'])
const emit = defineEmits(['delete', 'loadComplete'])

const image = ref<string>('')
const router = useRouter()

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

const editPost = () => {
  router.push({
    name: 'post',
    query: {
      adId: props.ad.adId
    }
  })
}
const deletePost = () => {
  ApiDelete(AdsAPI.DELETE(props.ad.adId))
    .then((resp) => {
      if (resp.data.stateCode == 200) {
        emit('delete')
        useTemplateMessage(TemplateMessage, msgProps('Delete ad success', 'success'))
      }
    })
    .catch(() => {
      useTemplateMessage(TemplateMessage, {
        msg: 'Delete ad failed',
        type: 'alert'
      })
    })
}

onMounted(() => {
  ApiGet(PictureAPI.FIRST_BY_AD(props.ad.adId))
    .then((resp) => {
      if (resp.data.obj) {
        image.value = resp.data.obj.pictureBase64
      }
      emit('loadComplete')
    })
    .catch((err) => {
      console.error(err)
      emit('loadComplete')
    })
})
</script>

<template>
  <card-template
    :title="clipString(ad.title, 20)"
    class="flex flex-col relative border border-gray-400 rounded-3xl pb-6 hover:border-green-600 transition-all cursor-default"
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
    <div class="flex flex-row absolute left-2 bottom-2 right-2 justify-between">
      <div class="flex flex-row">
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
      <div class="flex flex-row">
        <div
          class="rounded-full text-blue-600 border border-blue-400 px-2 pt-1.5 pb-1 bg-white mx-1 cursor-pointer hover:text-blue-100 hover:bg-blue-600 transition-all"
        >
          <i class="bi bi-pencil-square" @click="editPost"></i>
        </div>
        <div
          class="rounded-full text-red-600 border border-red-400 px-2 pt-1.5 pb-1 bg-white mx-1 cursor-pointer hover:text-red-100 hover:bg-red-600 transition-all"
        >
          <i class="bi bi-trash-fill" @click="deletePost"></i>
        </div>
      </div>
    </div>
  </card-template>
</template>

<style scoped></style>