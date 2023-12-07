<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { inject, onMounted, ref, watch } from 'vue'
import HomePostCard from '@/views/HomeView/componenets/HomePostCard.vue'
import MyPagination from '@/components/MyPagination.vue'
import { AdsAPI, ApiGet } from '@/utils/req'
import { useRouter } from 'vue-router'

type Ad = {
  adId: number
  title: string
  address: string
  description: string
  userId: number
}
const adsList = ref<Ad[]>([])

const progressArr = inject('topProgressArr')
const router = useRouter()

const curPage = ref(1)
const totalPages = ref(1)

watch(curPage, () => {
  progressArr.value = [false]
  ApiGet(AdsAPI.LIST_BY_PAGINATION(curPage.value - 1, 6)).then((resp) => {
    adsList.value = resp.data.obj.voList
    totalPages.value = resp.data.obj.totalPages
    progressArr.value[0] = true
  })
})

watch(adsList, () => {
  progressArr.value = []

  for (let i = 0; i < adsList.value.length; i++) {
    progressArr.value.push(false)
  }
})

const toDetails = (adId: number) => {
  router.push({
    name: 'details',
    query: {
      adId: adId
    }
  })
}

onMounted(() => {
  // ApiPut('board/root/resetPassword?username=otto', null)
  progressArr.value = [false]
  ApiGet(AdsAPI.LIST_BY_PAGINATION(0, 6)).then((resp) => {
    adsList.value = resp.data.obj.voList
    totalPages.value = resp.data.obj.totalPages
    progressArr.value[0] = true
  })
})
</script>

<template>
  <top-header :selection="1" />
  <div class="pt-10"></div>
  <scroll-wrapper
    :show-bar="true"
    :scroll-padding="30"
    height="84vh"
    width="96vw"
    class="bg-white mx-2 pl-6 rounded-3xl border border-green-600 relative"
  >
    <my-pagination
      class="absolute right-8 top-2 z-10 shadow-green-200 shadow-xl border border-green-300"
      v-if="totalPages > 1"
      v-model="curPage"
      :total-pages="totalPages"
    />
    <div class="w-full gs-b text-5xl mt-8">Home</div>
    <div v-if="adsList.length > 0" class="main-cards-wrapper w-full gap-2 pr-4 mt-6 pb-4">
      <home-post-card
        v-for="(ad, idx) in adsList"
        :key="ad.adId"
        :ad="ad"
        @load-complete="progressArr[idx] = true"
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