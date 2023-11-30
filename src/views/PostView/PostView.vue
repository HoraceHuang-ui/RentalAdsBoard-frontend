<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const userInfo = ref<any>({})
const title = ref('')
const addr = ref('')
const details = ref('')

const titleErrorShow = ref(false)
const addrErrorShow = ref(false)

const images = ref<string[]>([])
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
      images.value.push(base64)
    }
    console.log(images.value)
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}
const deleteImage = (idx: number) => {
  images.value.splice(idx, 1)
}

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
    axios.post('/api/ads/save', {
      title: title.value,
      address: addr.value,
      description: details.value,
      userId: userInfo.value.userId
    })
  }
}

onMounted(() => {
  userInfo.value = JSON.parse(localStorage.getItem('userInfo')!!)
})
</script>

<template>
  <top-header :selection="3" />

  <div class="px-2 pt-8 justify-between w-full flex flex-row">
    <div class="gs-b text-5xl">Post an Ad...</div>
    <div
      @click="postClick"
      class="rounded-full flex flex-row mr-16 px-4 py-1 text-green-700 border-2 border-green-600 hover:text-green-100 hover:bg-green-600 transition-all cursor-pointer"
    >
      <i class="bi bi-send text-3xl"></i>
      <div class="text-3xl gs-b ml-3">Post</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-4">
    <div>
      <div class="flex flex-row gst-r mx-7 mt-8">
        <div class="gs-r mr-2 h-8 mt-1 w-16">Title</div>
        <my-input
          type="input"
          v-model="title"
          style="width: 40vw"
          @change="titleErrorShow = false"
        />
      </div>
      <div v-if="titleErrorShow" class="w-full text-right gst-ri text-red-600 pr-8">
        Please provide a title
      </div>
      <div class="flex flex-row gst-r mx-7 mt-2">
        <div class="gs-r mr-2 h-8 mt-1 w-16">Address</div>
        <my-input type="input" v-model="addr" style="width: 40vw" @change="addrErrorShow = false" />
      </div>
      <div v-if="addrErrorShow" class="w-full text-right gst-ri text-red-600 pr-8">
        Please provide an address
      </div>
      <div class="flex flex-row gst-r mx-7 mt-2">
        <div class="gs-r mr-2 h-8 mt-1 w-16">Details</div>
        <div class="flex flex-col" style="width: 40vw">
          <my-input
            class="h-full"
            type="textarea"
            v-model="details"
            style="min-height: 30vh; max-height: 60vh"
          ></my-input>
          <div class="gst-r w-full text-right text-sm mt-0.5">
            Characters: {{ details.length }} / 9999
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="gs-r mt-8">Attach images...</div>
      <div class="grid grid-cols-3 grid-rows-3 gap-2 mt-3" style="height: 30rem; width: 30rem">
        <div v-for="(image, idx) in images" :key="idx" class="relative">
          <img
            :src="image"
            class="w-full h-full rounded-2xl shadow-lg shadow-green-300 object-cover"
          />
          <div
            class="text-white text-xl w-7 h-7 absolute top-0 left-0 cursor-pointer rounded-full bg-red-500 text-center"
            @click="deleteImage(idx)"
          >
            <i class="bi bi-x"></i>
          </div>
        </div>
        <div
          v-if="images.length < 9"
          @click="addImageClick"
          class="rounded-2xl w-full h-full border-4 border-dashed border-gray-400 text-center relative text-gray-500 hover:border-green-600 hover:text-green-600 transition-all cursor-pointer"
        >
          <div class="gs-r text-5xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            +
          </div>
          <input type="file" id="imageInput" class="opacity-0" @change="addImage($event)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>