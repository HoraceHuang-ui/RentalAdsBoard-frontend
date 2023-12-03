<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { ApiDelete, ApiGet, ApiPost } from '@/utils/req'
import { marked } from 'marked'
import { useTemplateMessage } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const editMode = !!route.query.adId

const title = ref('')
const addr = ref('')
const details = ref('')
const showDetailsPreview = ref(true)
const detailsPreviewContent = computed(() => {
  return marked(details.value)
})

const titleErrorShow = ref(false)
const addrErrorShow = ref(false)

type Image = {
  pictureId: number
  adId: number
  pictureBase64: string
}

const originalImages = ref<Image[]>([])
const imagesToRemove = ref<number[]>([])
const imagesToAdd = ref<string[]>([])
// const auth = useAuthStore()

const addImageClick = () => {
  const imageInput = document.getElementById('imageInput')
  if (imageInput) {
    imageInput.click()
  }
}

const addImage = (event) => {
  let base64 = ''
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      base64 = reader.result
      imagesToAdd.value.push(base64)
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}
const deleteOriginalImage = (idx: number) => {
  imagesToRemove.value.push(originalImages.value.splice(idx, 1)[0].pictureId)
}

const deleteNewImage = (idx: number) => {
  imagesToAdd.value.splice(idx, 1)
}

const router = useRouter()
const postClick = () => {
  titleErrorShow.value = false
  addrErrorShow.value = false
  if (title.value === '') {
    titleErrorShow.value = true
  }
  if (addr.value === '') {
    addrErrorShow.value = true
  }
  if (!addrErrorShow.value && !titleErrorShow.value) {
    ApiPost(editMode ? 'ads/update' : 'ads/save', {
      adId: editMode ? route.query.adId : null,
      title: title.value,
      address: addr.value,
      description: details.value
    }).then((adResp) => {
      if (adResp.data.stateCode == 200) {
        if (imagesToAdd.value.length == 0) {
          useTemplateMessage(TemplateMessage, {
            msg: 'Ad posted successfully',
            type: 'success'
          })
          router.go(-1)
        }
        const adId = adResp.data.obj.adId
        for (const imageId of imagesToRemove.value) {
          ApiDelete(`picture/delete?picture_id=${imageId}`)
        }
        for (const [idx, image] of imagesToAdd.value.entries()) {
          ApiPost('picture/save', {
            adId: adId,
            pictureBase64: image
          }).then((imgResp) => {
            if (imgResp.data.stateCode == 200) {
              if (idx == imagesToAdd.value.length - 1) {
                useTemplateMessage(TemplateMessage, {
                  msg: 'Ad posted successfully',
                  type: 'success'
                })
                router.go(-1)
              }
            } else {
              useTemplateMessage(TemplateMessage, {
                msg: 'Failed posting ad',
                type: 'warn'
              })
            }
          })
        }
      } else {
        useTemplateMessage(TemplateMessage, {
          msg: 'Failed posting ad',
          type: 'warn'
        })
      }
    })
  }
}

onMounted(() => {
  if (editMode) {
    ApiGet(`ads/user/get?ad_id=${route.query.adId}`).then((resp) => {
      console.log(resp)
      if (resp.data.obj) {
        const adInfo = resp.data.obj
        title.value = adInfo.title
        addr.value = adInfo.address
        details.value = adInfo.description
        ApiGet(`picture/list?ad_id=${adInfo.adId}`).then((pictureResp) => {
          console.log(pictureResp)
          for (const pictureObj of pictureResp.data.obj) {
            originalImages.value.push(pictureObj)
          }
        })
      }
    })
  }
})
</script>

<template>
  <top-header :selection="3" />

  <div class="px-2 pt-8 justify-between w-full flex flex-row">
    <div class="gs-b text-5xl">{{ editMode ? 'Edit Your Ad...' : 'Post an Ad...' }}</div>
    <div
      @click="postClick"
      class="rounded-full flex flex-row px-4 py-1 text-green-700 border-2 border-green-600 hover:text-green-100 hover:bg-green-600 transition-all cursor-pointer"
    >
      <i class="bi bi-send text-3xl"></i>
      <div class="text-3xl gs-b ml-3">Post</div>
    </div>
  </div>

  <scroll-wrapper height="80%" width="100%" class="mt-2">
    <div class="post-area-wrapper">
      <div>
        <div class="flex flex-row gst-r mx-7 mt-8">
          <div class="gs-r mr-2 h-8 mt-1" style="width: 64px">Title</div>
          <my-input
            type="input"
            v-model="title"
            style="width: 100%"
            @change="titleErrorShow = false"
          />
        </div>
        <div v-if="titleErrorShow" class="w-full text-right gst-ri text-red-600 pr-8">
          Please provide a title
        </div>
        <div class="flex flex-row mx-7 mt-2">
          <div class="gs-r mr-2 h-8 mt-1" style="width: 64px">Address</div>
          <my-input
            type="input"
            v-model="addr"
            style="width: 100%"
            @change="addrErrorShow = false"
          />
        </div>
        <div v-if="addrErrorShow" class="w-full text-right gst-ri text-red-600 pr-8">
          Please provide an address
        </div>
        <div class="flex flex-row mx-7 mt-2">
          <div class="gs-r mr-2 h-8 mt-1" style="width: 64px">
            Details
            <i class="bi bi-markdown-fill" />
          </div>
          <div class="flex flex-col" style="width: 100%">
            <my-input
              class="h-full textarea-height-limits"
              type="textarea"
              v-model="details"
            ></my-input>
            <div class="flex flex-row justify-between w-full text-right text-sm mt-0.5">
              <div
                @click="showDetailsPreview = !showDetailsPreview"
                class="flex flex-row cursor-pointer hover:text-green-600 transition-all"
                :class="showDetailsPreview ? 'text-green-700 gst-b' : 'text-gray-600'"
              >
                <i v-if="showDetailsPreview" class="bi bi-check-circle-fill mr-1" />
                <i v-else class="bi bi-circle mr-1" />
                Show preview
              </div>
              Characters: {{ details.length }} / 9999
            </div>
            <scroll-wrapper
              v-if="showDetailsPreview"
              width="100%"
              height="30vh"
              class="border rounded-3xl border-green-600 mt-2 bg-green-50"
              :show-bar="true"
            >
              <div class="p-4" v-html="detailsPreviewContent"></div>
            </scroll-wrapper>
          </div>
        </div>
      </div>

      <div class="ml-7">
        <div class="gs-r mt-8">Attach images...</div>
        <scroll-wrapper height="420px" width="100%" class="overflow-x-hidden">
          <div class="grid grid-cols-3 grid-rows-3 gap-2 mt-3" style="height: 380px; width: 380px">
            <div v-for="(image, idx) in originalImages" :key="idx" class="relative">
              <img
                :src="image.pictureBase64"
                class="w-full h-full rounded-2xl shadow-lg shadow-green-300 object-cover"
              />
              <div
                class="text-white text-xl w-7 h-7 absolute top-0 left-0 cursor-pointer rounded-full bg-red-500 text-center"
                @click="deleteOriginalImage(idx)"
              >
                <i class="bi bi-x"></i>
              </div>
            </div>
            <div v-for="(image, idx) in imagesToAdd" :key="idx" class="relative">
              <img
                :src="image"
                class="w-full h-full rounded-2xl shadow-lg shadow-green-300 object-cover"
              />
              <div
                class="text-white text-xl w-7 h-7 absolute top-0 left-0 cursor-pointer rounded-full bg-red-500 text-center"
                @click="deleteNewImage(idx)"
              >
                <i class="bi bi-x"></i>
              </div>
            </div>
            <div
              v-if="originalImages.length + imagesToAdd.length < 9"
              @click="addImageClick"
              class="rounded-2xl w-full h-full border-4 border-dashed border-gray-400 text-center relative text-gray-500 hover:border-green-600 hover:text-green-600 transition-all cursor-pointer"
            >
              <div
                class="gs-r text-5xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                +
              </div>
              <input type="file" id="imageInput" class="opacity-0" @change="addImage($event)" />
            </div>
          </div>
        </scroll-wrapper>
      </div>
    </div>
  </scroll-wrapper>
</template>

<style scoped>
@media (min-width: 900px) {
  .post-area-wrapper {
    @apply grid grid-cols-2 overflow-x-hidden;
  }

  .textarea-height-limits {
    min-height: 30vh;
    max-height: 56vh;
  }
}

@media (max-width: 900px) {
  .post-area-wrapper {
    @apply flex flex-col;
  }

  .textarea-height-limits {
    min-height: 20vh;
    max-height: 60vh;
  }
}
</style>