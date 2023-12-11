<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { computed, inject, onMounted, ref } from 'vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { AdsAPI, ApiDelete, ApiGet, ApiPost, ApiPut, ImageAPI } from '@/utils/req'
import { marked } from 'marked'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const editMode = !!route.query.adId
const progressArr = inject('topProgressArr')

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
  imageId: number
  adId: number
  imageBase64: string
}

const originalImages = ref<Image[]>([])
const imagesToRemove = ref<number[]>([])
const imagesToAdd = ref<string[]>([])
const imageInput = ref<HTMLInputElement>()
// const auth = useAuthStore()

const addImageClick = () => {
  if (imageInput.value) {
    imageInput.value.click()
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
  imagesToRemove.value.push(originalImages.value.splice(idx, 1)[0].imageId)
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
    progressArr.value = [false]
    for (let i = 0; i < imagesToRemove.value.length + imagesToAdd.value.length; i++) {
      progressArr.value.push(false)
    }

    ;(editMode
      ? ApiPut(AdsAPI.UPDATE, {
          adId: editMode ? route.query.adId : null,
          title: title.value,
          address: addr.value,
          description: details.value
        })
      : ApiPost(AdsAPI.SAVE, {
          adId: editMode ? route.query.adId : null,
          title: title.value,
          address: addr.value,
          description: details.value
        })
    )
      .then((adResp) => {
        progressArr.value[0] = true

        if (adResp.data.stateCode == 200) {
          if (imagesToAdd.value.length == 0) {
            useTemplateMessage(TemplateMessage, msgProps('Ad posted successfully', 'success'))
            router.go(-1)
          }
          const adId = adResp.data.obj.adId
          for (const [idx, imageId] of imagesToRemove.value.entries()) {
            ApiDelete(ImageAPI.DELETE(imageId))
              .then(() => {
                progressArr.value[idx + 1] = true
              })
              .catch(() => {
                progressArr.value = []
                useTemplateMessage(TemplateMessage, msgProps('Failed posting ad', 'warn'))
              })
          }
          for (const [idx, image] of imagesToAdd.value.entries()) {
            ApiPost(ImageAPI.SAVE, {
              adId: adId,
              imageBase64: image.replace(new RegExp('data:image/\\w+;base64,'), '')
            })
              .then((imgResp) => {
                progressArr.value[imagesToRemove.value.length + idx + 1] = true

                if (imgResp.data.stateCode == 200) {
                  if (idx == imagesToAdd.value.length - 1) {
                    useTemplateMessage(
                      TemplateMessage,
                      msgProps('Ad posted successfully', 'success')
                    )
                    router.push('/home')
                  }
                }
              })
              .catch((err) => {
                progressArr.value = []
                useTemplateMessage(TemplateMessage, msgProps(err.data.message, 'warn'))
              })
          }
        }
      })
      .catch(() => {
        progressArr.value = []
        useTemplateMessage(TemplateMessage, msgProps('Failed posting ad', 'warn'))
      })
  }
}

onMounted(() => {
  if (editMode) {
    progressArr.value = [false, false]
    ApiGet(AdsAPI.ADINFO_BY_ADID(route.query.adId))
      .then((resp) => {
        progressArr.value[0] = true
        if (resp.data.obj) {
          const adInfo = resp.data.obj
          title.value = adInfo.title
          addr.value = adInfo.address
          details.value = adInfo.description
          ApiGet(ImageAPI.LIST_BY_AD(adInfo.adId)).then((imageResp) => {
            progressArr.value[1] = true
            for (const imageObj of imageResp.data.obj) {
              originalImages.value.push(imageObj)
            }
          })
        }
      })
      .catch(() => {
        progressArr.value[0] = true
        progressArr.value[1] = true
        useTemplateMessage(
          TemplateMessage,
          msgProps('Error loading contents, try refreshing page.', 'alert', 3000)
        )
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

  <scroll-wrapper height="80%" width="100%" class="mt-2" :show-bar="true">
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
              :scroll-padding="30"
              :show-bar="true"
            >
              <div class="p-4" v-html="detailsPreviewContent"></div>
            </scroll-wrapper>
          </div>
        </div>
      </div>

      <div class="ml-7">
        <div class="gs-r mt-8">Attach images...</div>
        <div class="grid grid-cols-3 grid-rows-3 gap-2 mt-3" style="height: 380px; width: 380px">
          <div v-for="(image, idx) in originalImages" :key="idx" class="relative">
            <img
              :src="`data:image/png;base64,${image.imageBase64}`"
              alt="Original image"
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
              alt="Image to add"
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
            <div class="gs-r text-5xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              +
            </div>
            <input ref="imageInput" type="file" class="opacity-0" @change="addImage($event)" />
          </div>
        </div>
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