<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'

const props = defineProps(['ad'])

const images = ref<string[]>([])

onMounted(() => {
  axios
    .get('/api/picture/list?ad_id=' + props.ad.adId)
    .then((resp) => {
      console.log(resp)
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <card-template :title="ad.title" class="border border-gray-400 rounded-3xl">
    <div v-if="images.length > 0" class="h-40 px-4 py-2 flex flex-row justify-center">
      <img v-for="image in images" class="rounded-xl mx-3" :src="image" />
    </div>
    <div class="body-detail gst-r m-6">{{ ad.description }}</div>
  </card-template>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>