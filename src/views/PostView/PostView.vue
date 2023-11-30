<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { ref } from 'vue'

const title = ref('')
const addr = ref('')
const details = ref('')

const images = ref<string[]>([])

function toDataURL(url: string, callback: Function) {
  const xhr = new XMLHttpRequest()
  xhr.onload = function () {
    const reader = new FileReader()
    reader.onloadend = function () {
      callback(reader.result)
    }
    reader.readAsDataURL(xhr.response)
  }
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.send()
}

const addImageClick = () => {
  // images.value.push('https://avatars.githubusercontent.com/u/67905897?v=4')
  const imageInput = document.getElementById('imageInput')
  if (imageInput) {
    imageInput.click()
  }
}
const getBase64StringFromDataURL = (dataURL: string) =>
  dataURL.replace('data:', '').replace(/^.+,/, '')
// const addImage = async (e) => {
//   // var files = document.getElementById('imageInput')!!.value
//   // if (!/\.(jpg|jpeg|png|webp)$/i.test(files)) {
//   //   // ElMessage.warning("图片类型必须是jpeg,jpg,png中的一种,请重新上传")
//   //   return false
//   // }
//   let file = e.target.files[0]
//   // toDataURL(file, function (dataUrl: string) {
//   //   console.log('RESULT:', dataUrl)
//   //   images.value.push(dataUrl)
//   // })
//   const img = new Image()
//   // console.log()
//   img.src = document.getElementById('imageInput')!!.value
//   const canvas = document.createElement('canvas')
//   canvas.width = 300
//   canvas.height = 300
//   const ctx = canvas.getContext('2d')
//   ctx.drawImage(img, 0, 0)
//
//   images.value.push(canvas.toDataURL())
//   console.log(canvas.toDataURL())
// }

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
</script>

<template>
  <top-header :selection="3" />

  <div class="px-2 pt-8 justify-between w-full flex flex-row">
    <div class="gs-b text-5xl">Post an Ad...</div>
    <div
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
        <my-input type="input" v-model="title" style="width: 40vw" />
      </div>
      <div class="flex flex-row gst-r mx-7 mt-2">
        <div class="gs-r mr-2 h-8 mt-1 w-16">Address</div>
        <my-input type="input" v-model="addr" style="width: 40vw" />
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
            class="text-red-500 text-2xl absolute -top-1 left-0 cursor-pointer"
            @click="deleteImage(idx)"
          >
            <i class="bi bi-x-circle-fill"></i>
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