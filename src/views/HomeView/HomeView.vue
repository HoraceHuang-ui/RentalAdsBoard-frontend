<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import CardTemplate from '@/components/CardTemplate.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import HomePostCard from '@/views/HomeView/componenets/HomePostCard.vue'

const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus malesuada efficitur neque, ut semper augue vestibulum vel. Mauris velit erat, sagittis egestas fringilla non, hendrerit vel purus. Cras nec efficitur turpis. Cras massa sem, aliquet quis elementum ut, auctor ornare massa. Maecenas vitae felis commodo odio ullamcorper dictum eu sit amet ante. Proin facilisis dapibus volutpat. Sed tempor nibh sed mattis cursus. Suspendisse molestie nisl quis rhoncus mattis. Aenean rhoncus sapien at est vulputate sagittis. Quisque elit justo, dictum at dignissim eget, semper nec lorem. Fusce sit amet ante fermentum, scelerisque lacus vitae, varius augue. Sed gravida sapien vitae massa venenatis feugiat. Mauris elementum rhoncus consequat. Aenean condimentum justo a quam semper sagittis. Nullam vitae metus sit amet lacus iaculis rutrum in sit amet mauris. Vestibulum efficitur sagittis dolor, nec posuere nisi fermentum sed.

Quisque euismod pretium dapibus. Nulla varius id metus a laoreet. Aliquam arcu orci, bibendum quis odio nec, blandit blandit tortor. Mauris efficitur nulla sit amet erat mollis, et volutpat lectus euismod. Curabitur suscipit sapien id fringilla aliquet. Mauris interdum, justo ut volutpat dignissim, enim leo porttitor libero, eu tincidunt quam lectus sit amet felis. Nam at cursus dui. Morbi quis nisl iaculis, elementum ipsum non, elementum arcu.

Nam aliquet ipsum quis viverra aliquam. Nam risus tortor, condimentum quis rutrum id, malesuada id purus. Mauris sit amet enim varius, placerat urna id, laoreet dui. Quisque quis elit id dui maximus fermentum. Aliquam gravida porttitor elit. Fusce vel ligula id ipsum condimentum consequat. Fusce tincidunt turpis massa, sed laoreet ligula suscipit et. Phasellus congue mattis convallis. Duis vitae dapibus ligula. Sed vitae augue laoreet, feugiat sapien at, porta lectus. Nulla fringilla mi quis nunc pretium, vel gravida mauris ullamcorper. Vestibulum sit amet orci vel tellus egestas gravida non et justo.

Nulla varius, urna vitae aliquam pellentesque, neque turpis laoreet quam, et volutpat ipsum justo pulvinar enim. Vivamus mauris justo, dignissim id tortor in, egestas volutpat mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In facilisis efficitur tempus. Sed sed placerat risus, in facilisis nisi. Maecenas ac elit diam. Nullam id ante neque. Phasellus bibendum nulla sit amet fringilla condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed lacinia augue mauris. Morbi at metus vehicula, tristique dui vel, blandit sem. Pellentesque enim est, tristique ut lorem et, facilisis tempus risus. Nam sapien dui, commodo quis convallis quis, mattis et mauris.

Vestibulum luctus arcu vitae tellus malesuada ullamcorper. Morbi in vehicula sapien, vitae lacinia magna. In eu urna semper, ornare eros a, pulvinar sapien. Sed fringilla pretium risus, eget molestie lacus feugiat vitae. Etiam mattis sem vitae ipsum sagittis finibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla faucibus tempus nisi, et mattis massa hendrerit ut. Vivamus auctor nec purus congue pellentesque. Aenean ornare, magna et aliquam dignissim, nibh neque sagittis tellus, in congue urna nulla vestibulum neque. Cras sit amet suscipit nisi. Nullam ornare sagittis eleifend. Aliquam erat volutpat. Aliquam aliquam, urna et gravida euismod, neque nunc vestibulum urna, id vehicula velit felis a lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`

type Ad = {
  adId: number
  title: string
  address: string
  description: string
  userId: number
}
const adsList = ref<Ad[]>([])

const getAdImages = async (ad: Ad) => {
  return await axios.get('/api/picture/get/first?ad_id=' + ad.adId)
}

onMounted(() => {
  axios
    .get('/api/ads/home')
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
    height="84vh"
    width="96vw"
    class="bg-white mx-2 pl-6 rounded-3xl border border-green-600"
  >
    <div class="w-full gs-b text-5xl mt-8">Home</div>
    <div v-if="adsList.length > 0" class="grid grid-cols-2 w-full gap-2 pr-4 mt-6 pb-4">
      <home-post-card
        v-for="ad in adsList"
        :key="ad.adId"
        :ad="ad"
        class="border border-gray-400 rounded-3xl"
      />
    </div>
    <div v-else class="gst-r text-center" style="margin-top: 15%">
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
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>