<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import { computed, inject, onMounted, ref } from 'vue'
import { AdsAPI, ApiGet, ImageAPI, UserAPI } from '@/utils/req'
import MyPagination from '@/components/MyPagination.vue'
import { marked } from 'marked'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { useMessage, sysMsgProps } from '@/utils/template-message'
import SysMessage from '@/components/SysMessage.vue'

const route = useRoute()
const router = useRouter()
const progressArr = inject('topProgressArr')

const adId = route.query.adId
const adInfo = ref<any>({})
const images = ref<string[]>([])
const curImageNum = ref(1)
const adUserInfo = ref<any>({})
const selfUserInfo = JSON.parse(localStorage.getItem('userInfo')!!)

const adDetailsMarkdown = computed(() => {
  if ('description' in adInfo.value) {
    return marked(adInfo.value.description)
  } else return ''
})

const msgClick = () => {
  router.push({
    name: 'chat',
    query: {
      username: adUserInfo.value.username
    }
  })
}

onMounted(() => {
  progressArr.value = [false, false, false]
  ApiGet(AdsAPI.ADINFO_BY_ADID(adId))
    .then((adResp) => {
      progressArr.value[0] = true
      adInfo.value = adResp.data.obj

      ApiGet(UserAPI.INFO_BY_USERNAME(adInfo.value.username))
        .then((userResp) => {
          progressArr.value[1] = true
          adUserInfo.value = userResp.data.obj
        })
        .catch(() => {
          progressArr.value = []
          useMessage(
            SysMessage,
            sysMsgProps('Error loading contents, try refreshing page.', 'alert')
          )
        })
    })
    .catch(() => {
      progressArr.value = []
      useMessage(SysMessage, sysMsgProps('Error loading contents, try refreshing page.', 'alert'))
    })
  ApiGet(ImageAPI.LIST_BY_AD(adId))
    .then((imageResp) => {
      progressArr.value[2] = true
      for (const imageObj of imageResp.data.obj) {
        images.value.push(imageObj.imageBase64)
      }
    })
    .catch(() => {
      progressArr.value = []
      useMessage(SysMessage, sysMsgProps('Error loading contents, try refreshing page.', 'alert'))
    })
})
</script>

<template>
  <top-header />

  <scroll-wrapper
    height="86vh"
    width="96vw"
    :show-bar="true"
    :scroll-padding="30"
    class="mt-8 rounded-3xl bg-white"
    style="margin-left: 1vw"
  >
    <div v-if="images.length > 0" class="post-details-wrapper p-4 content-center justify-center">
      <div class="image-wrapper flex flex-col bg-green-50 rounded-2xl border-2 border-green-100">
        <img
          :src="`data:image/png;base64,${images[curImageNum - 1]}`"
          :alt="`Image ${curImageNum} of ${images.length}`"
          class="image object-contain w-full"
        />
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
          <div
            class="gs-b text-green-600 text-5xl"
            style="overflow-wrap: break-word; word-break: break-word"
          >
            {{ adInfo.title }}
          </div>
          <div class="flex flex-row justify-between">
            <div class="w-3/4">
              <div
                class="text-green-600 opacity-80 flex flex-row mt-2"
                style="overflow-wrap: break-word; word-break: break-word"
              >
                <i class="bi bi-geo-alt-fill" />
                <div class="ml-1">
                  {{ adInfo.address }}
                </div>
              </div>
              <div
                class="text-green-600 opacity-80"
                style="overflow-wrap: break-word; word-break: break-word"
              >
                <i class="bi bi-envelope-fill" />
                <a class="ml-1" :href="`mailto:${adUserInfo.email}`"> {{ adUserInfo.email }}</a>
              </div>
              <div
                class="text-green-600 opacity-80"
                style="overflow-wrap: break-word; word-break: break-word"
              >
                <i class="bi bi-person-circle" />
                {{ adInfo.username }}
              </div>
            </div>
            <div
              v-if="adUserInfo.username !== selfUserInfo.username"
              class="w-1/4 text-right text-xl mt-3 mr-5"
            >
              <i
                class="bi bi-chat-left-dots text-green-600 rounded-full py-2 px-2.5 cursor-pointer hover:bg-green-600 hover:text-white transition-all"
                @click="msgClick"
              />
            </div>
          </div>
          <div class="mt-4" v-html="adDetailsMarkdown"></div>
        </div>
      </scroll-wrapper>
    </div>
    <div v-else ref="noImageScrollContentRef" class="p-4">
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