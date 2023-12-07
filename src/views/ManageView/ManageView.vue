<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { computed, inject, onMounted, ref, watch } from 'vue'
import ManagePostCard from '@/views/ManageView/components/ManagePostCard.vue'
import MyPagination from '@/components/MyPagination.vue'
import { AdsAPI, ApiGet, UserAPI } from '@/utils/req'
import MySwitch from '@/components/MySwitch.vue'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import HomePostCard from '@/views/HomeView/componenets/HomePostCard.vue'

type Ad = {
  adId: number
  title: string
  address: string
  description: string
  userId: number
}
const adsList = ref<Ad[]>([])
const adminAdsList = ref<Ad[]>([])
const adminShowAll = ref(false)
const isAdmin = ref(false)

const progressArr = inject('topProgressArr')

const curPage = ref(1)
const totalPages = computed(() => {
  return Math.floor(((adminShowAll.value ? adminAdsList : adsList).value.length - 1) / 6) + 1
})
const curPageAds = computed(() => {
  return (adminShowAll.value ? adminAdsList : adsList).value.slice(
    (curPage.value - 1) * 6,
    (curPage.value - 1) * 6 + 6
  )
})

const scrollHeight = ref(0)
const scrollContentRef = ref<HTMLDivElement>()
const watchFlag = ref(true)
const debounce = (fn: Function, delay: number) => {
  let timer: number | undefined = undefined
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
const cancelDebounce = debounce(() => {
  if (scrollContentRef.value) {
    scrollHeight.value = scrollContentRef.value.scrollHeight
  }
}, 200)
watch(() => {
  const len = progressArr.value.length
  if (len > 0) {
    for (const flag of progressArr.value) {
      if (flag == false) {
        watchFlag.value = !watchFlag.value
        return watchFlag.value
      }
    }
    watchFlag.value = !watchFlag.value
    return watchFlag.value
  } else {
    watchFlag.value = !watchFlag.value
    return watchFlag.value
  }
}, cancelDebounce)
watch(adminShowAll, cancelDebounce)

const curProgressIdx = ref(0)
watch(curPageAds, (value, oldValue) => {
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

onMounted(() => {
  window.addEventListener('resize', cancelDebounce)

  progressArr.value = [false, false]
  ApiGet(UserAPI.INFO_SELF)
    .then((resp) => {
      progressArr.value[0] = true
      isAdmin.value = resp.data.obj.role === '2'
      if (isAdmin.value) {
        ApiGet(AdsAPI.LIST)
          .then((resp) => {
            for (const ad of resp.data.obj) {
              adminAdsList.value.push(ad)
            }
          })
          .catch((err) => {
            progressArr.value = []
            console.error(err)
            useTemplateMessage(
              TemplateMessage,
              msgProps('Error loading contents, try refreshing page.', 'alert', 3000)
            )
          })
      } else {
        progressArr.value = []
      }
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
      useTemplateMessage(
        TemplateMessage,
        msgProps('Error loading contents, try refreshing page.', 'alert', 3000)
      )
    })

  ApiGet(AdsAPI.SELF_LIST)
    .then((resp) => {
      for (const ad of resp.data.obj) {
        adsList.value.push(ad)
      }
      progressArr.value[1] = true
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
      useTemplateMessage(
        TemplateMessage,
        msgProps('Error loading contents, try refreshing page.', 'alert', 3000)
      )
    })
})
</script>

<template>
  <top-header :selection="2" />
  <div class="pt-10"></div>
  <scroll-wrapper
    :show-bar="true"
    :scroll-padding="30"
    :scroll-height="scrollHeight"
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

    <div ref="scrollContentRef">
      <div class="flex flex-row w-full mt-8">
        <div class="gs-b text-5xl">Manage Ads...</div>
        <my-switch
          v-if="isAdmin"
          text-l="All"
          text-r="Mine"
          wrapper-width="150px"
          track-width="75px"
          v-model="adminShowAll"
          class="ml-3 my-2"
        ></my-switch>
      </div>
      <div
        v-if="(adminShowAll ? adminAdsList : adsList).length > 0"
        class="main-cards-wrapper w-full gap-2 pr-4 mt-6 pb-4"
      >
        <manage-post-card
          v-for="(ad, idx) in curPageAds"
          :key="ad.adId"
          :ad="ad"
          @load-complete="progressArr[curProgressIdx++] = true"
          @delete="(adminShowAll ? adminAdsList : adsList).splice(idx + (curPage - 1) * 6, 1)"
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
    </div>
  </scroll-wrapper>
</template>

<style scoped>
@media (max-width: 900px) {
  .main-cards-wrapper {
    @apply flex flex-col;
  }
}

@media (min-width: 900px) {
  .main-cards-wrapper {
    @apply grid grid-cols-2;
  }
}
</style>