<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import MyInput from '@/components/MyInput.vue'
import { ref } from 'vue'

const title = ref('')
const addr = ref('')
const details = ref('')
</script>

<template>
  <top-header :selection="3" />
  <div class="px-2 gs-b text-5xl pt-8">Post an Ad...</div>

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
        <div v-for="_ in 7" class="relative">
          <img
            src="https://avatars.githubusercontent.com/u/67905897?v=4"
            class="w-full h-full rounded-2xl shadow-lg shadow-green-300"
          />
          <div class="text-red-500 text-2xl absolute -top-1 left-0 cursor-pointer">
            <i class="bi bi-x-circle-fill"></i>
          </div>
        </div>
        <div
          class="rounded-2xl w-full h-full border-4 border-dashed border-gray-400 text-center relative text-gray-500 hover:border-green-600 hover:text-green-600 transition-all cursor-pointer"
        >
          <div class="gs-r text-5xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            +
          </div>
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