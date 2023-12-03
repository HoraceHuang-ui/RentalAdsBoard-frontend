<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { computed, onMounted, ref } from 'vue'
import HomePostCard from '@/views/HomeView/componenets/HomePostCard.vue'
import MyPagination from '@/components/MyPagination.vue'
import { ApiGet } from '@/utils/req'
import { useRouter } from 'vue-router'

type Ad = {
  adId: number
  title: string
  address: string
  description: string
  userId: number
}
const adsList = ref<Ad[]>([])

const curPage = ref(1)
const totalPages = computed(() => {
  return Math.floor((adsList.value.length - 1) / 6) + 1
})
const curPageAds = computed(() => {
  return adsList.value.slice((curPage.value - 1) * 6, (curPage.value - 1) * 6 + 6)
})

const router = useRouter()
const toDetails = (adId: number) => {
  router.push({
    name: 'details',
    query: {
      adId: adId
    }
  })
}

onMounted(() => {
  ApiGet('ads/home')
    .then((resp) => {
      for (const ad of resp.data.obj) {
        adsList.value.push(ad)
      }
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>

<template>
  <top-header :selection="1" />
  <div class="pt-10"></div>
  <scroll-wrapper
    :show-bar="true"
    height="84vh"
    width="96vw"
    class="bg-white mx-2 pl-6 rounded-3xl border border-green-600 relative"
  >
    <div class="w-full gs-b text-5xl mt-8">Home</div>
    <my-pagination
      class="absolute right-8 top-2 z-10 shadow-green-200 shadow-xl border border-green-300"
      v-if="totalPages > 1"
      v-model="curPage"
      :total-pages="totalPages"
    />
    <div v-if="adsList.length > 0" class="main-cards-wrapper w-full gap-2 pr-4 mt-6 pb-4">
      <home-post-card
        v-for="ad in curPageAds"
        :key="ad.adId"
        :ad="ad"
        @click="toDetails(ad.adId)"
        class="border border-gray-400 rounded-3xl z-0"
      />
    </div>
    <div v-else class="text-center" style="margin-top: 15%">
      <i class="bi bi-emoji-frown text-4xl text-green-600 opacity-40" />
      <div class="mt-1">
        <span class="text-gray-400 cursor-default">Empty here...</span>
        <span
          class="text-green-600 cursor-pointer rounded-full px-2 py-1 hover:border hover:border-green-700 transition-all"
          @click="$router.push('/post')"
          >Post one!</span
        >
      </div>
    </div>
  </scroll-wrapper>
</template>

<style scoped>
@media (max-width: 1024px) {
  .main-cards-wrapper {
    @apply grid grid-cols-2;
  }
}

@media (min-width: 1024px) {
  .main-cards-wrapper {
    @apply grid grid-cols-3;
  }
}
</style>