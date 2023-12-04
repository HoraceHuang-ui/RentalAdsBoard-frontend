<script setup lang="ts">
import { useRoute } from 'vue-router'
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import { computed, inject, onMounted, ref } from 'vue'
import { ApiGet } from '@/utils/req'
import MyPagination from '@/components/MyPagination.vue'
import { marked } from 'marked'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'

const route = useRoute()
const progressArr = inject('topProgressArr')

const adId = route.query.adId
const adInfo = ref<any>({})
const images = ref<string[]>([])
const curImageNum = ref(1)

const adDetailsMarkdown = computed(() => {
  if ('description' in adInfo.value) {
    return marked(adInfo.value.description)
  } else return ''
})

onMounted(() => {
  progressArr.value = [false, false]
  ApiGet(`ads/user/get?ad_id=${adId}`)
    .then((adResp) => {
      progressArr.value[0] = true
      adInfo.value = adResp.data.obj
    })
    .catch(() => {
      progressArr.value = []
      useTemplateMessage(
        TemplateMessage,
        msgProps('Error loading contents, try refreshing page.', 'alert')
      )
    })
  ApiGet(`picture/list?ad_id=${adId}`)
    .then((pictureResp) => {
      progressArr.value[1] = true
      console.log(pictureResp)
      for (const pictureObj of pictureResp.data.obj) {
        images.value.push(pictureObj.pictureBase64)
      }
    })
    .catch(() => {
      progressArr.value = []
      useTemplateMessage(
        TemplateMessage,
        msgProps('Error loading contents, try refreshing page.', 'alert')
      )
    })
})
</script>

<template>
  <top-header />

  <scroll-wrapper
    height="86vh"
    width="96vw"
    class="mt-8 rounded-3xl bg-white border border-green-600"
    style="margin-left: 1vw"
  >
    <div v-if="images.length > 0" class="post-details-wrapper p-4 content-center justify-center">
      <div class="image-wrapper flex flex-col bg-green-50 rounded-2xl border-2 border-green-100">
        <img :src="images[curImageNum - 1]" class="image object-contain w-full" />
        <div class="w-full flex flex-row justify-center content-center align-middle pt-3">
          <my-pagination
            v-model="curImageNum"
            :total-pages="images.length"
            class="w-64 border border-green-300"
          />
        </div>
      </div>
      <scroll-wrapper height="100%" width="100%" :show-bar="true" class="details-wrapper">
        <div class="w-full pr-4">
          <div class="gs-b text-green-600 text-5xl">{{ adInfo.title }}</div>
          <div class="text-green-600 opacity-80 flex flex-row mt-2">
            <i class="bi bi-geo-alt-fill" />
            <div class="ml-1">
              {{ adInfo.address }}
            </div>
          </div>
          <div class="text-green-600 opacity-80">
            <i class="bi bi-person-circle" />
            {{ adInfo.username }}
          </div>
          <div class="mt-4" v-html="adDetailsMarkdown"></div>
        </div>
      </scroll-wrapper>
    </div>
    <div v-else class="p-4">
      <div v-html="adDetailsMarkdown"></div>
    </div>
  </scroll-wrapper>
</template>

<style scoped>
@media (min-width: 900px) {
  .post-details-wrapper {
    @apply grid grid-cols-2 gap-4;
    height: 86vh;
  }

  .image-wrapper {
    @apply w-full h-full;
  }

  .image {
    height: 73vh;
  }
}

@media (max-width: 900px) {
  .post-details-wrapper {
    @apply flex flex-col w-full;
  }

  .image-wrapper {
    @apply w-full;
    height: 40vh;
  }

  .image {
    height: 33vh;
  }

  .details-wrapper {
    @apply mt-6;
  }
}
</style>