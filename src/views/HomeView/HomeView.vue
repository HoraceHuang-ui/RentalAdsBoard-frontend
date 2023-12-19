<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { inject, onMounted, provide, ref, watch } from 'vue'
import HomePostCard from '@/views/HomeView/components/HomePostCard.vue'
import MyPagination from '@/components/MyPagination.vue'
import { AdsAPI, ApiGet } from '@/utils/req'
import { useRouter } from 'vue-router'
import MySearch from '@/views/HomeView/components/MySearch.vue'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'

type Ad = {
  adId: number
  title: string
  address: string
  description: string
  userId: number
}
const adsList = ref<Ad[]>([])

const searchKeyword = ref('')
const curKeyword = ref('')

const progressArr = inject('topProgressArr')
const router = useRouter()

const curPage = ref(1)
const totalPages = ref(1)

const updateCurPage = () => {
  progressArr.value = [false]
  ApiGet(
    curKeyword.value === ''
      ? AdsAPI.LIST_WITH_PAGINATION(curPage.value - 1, 6)
      : AdsAPI.SEARCH_KEYWORD_WITH_PAGINATION(curKeyword.value, curPage.value - 1, 6)
  )
    .then((resp) => {
      if (resp.data.stateCode == 200) {
        progressArr.value[0] = true
        adsList.value = resp.data.obj.voList
        totalPages.value = resp.data.obj.totalPages
      } else {
        progressArr.value = []
        useTemplateMessage(
          TemplateMessage,
          msgProps('Failed loading content, try refreshing page.', 'alert', 3000)
        )
      }
    })
    .catch(() => {
      progressArr.value = []
      useTemplateMessage(
        TemplateMessage,
        msgProps('Failed loading content, try refreshing page.', 'alert', 3000)
      )
    })
}

watch(curPage, updateCurPage)

const curProgressIdx = ref(0)
watch(adsList, (value, oldValue) => {
  curProgressIdx.value = 0
  progressArr.value = []

  let count = 0
  for (const oldAd of oldValue) {
    for (const newAd of value) {
      if (oldAd.adId == newAd.adId) {
        count++
      }
    }
  }

  for (let i = 0; i < value.length - count; i++) {
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

const searchSubmit = () => {
  curKeyword.value = searchKeyword.value
  curPage.value = 1
  updateCurPage()
}

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

onMounted(() => {
  // ApiPut('board/root/resetPassword?username=otto', null)
  updateCurPage()
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
    <my-search v-model="searchKeyword" @submit="searchSubmit" @clear="searchSubmit" />
    <my-pagination
      class="absolute right-16 top-2 h-9 z-10 shadow-green-200 shadow-xl border border-green-300"
      v-if="totalPages > 1"
      v-model="curPage"
      :total-pages="totalPages"
    />
    <div v-if="curKeyword === ''" class="w-full gs-b text-5xl mt-8">Home</div>
    <div v-else class="w-full gs-b text-3xl mt-14">
      Results for '{{ clipString(curKeyword, 15) }}'
    </div>
    <div v-if="adsList.length > 0" class="main-cards-wrapper w-full gap-2 pr-4 mt-6 pb-4">
      <home-post-card
        v-for="ad in adsList"
        :key="ad.adId"
        :ad="ad"
        @load-complete="progressArr[curProgressIdx++] = true"
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