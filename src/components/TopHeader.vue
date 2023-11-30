<script setup lang="ts">
// 1: home; 2: manage
import { useAuthStore } from '@/stores/auth'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps(['selection'])
const userInfo = ref({})

const auth = useAuthStore()
onMounted(() => {
  userInfo.value = auth.getUserInfo
  console.log(userInfo.value)
})

const router = useRouter()
const homeClick = () => {
  router.push('/home')
}
const manageClick = () => {
  router.push('/manage')
}
const postClick = () => {
  router.push('/post')
}
</script>

<template>
  <!-- LEFT PART -->
  <div
    class="sticky flex flex-row justify-between z-50 top-0 left-0 right-0 w-full h-12 bg-green-600 rounded-full shadow-green-300 shadow-xl text-xl"
  >
    <div class="flex flex-row">
      <div
        class="icontext-wrapper"
        :class="selection == 1 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="homeClick"
      >
        <i class="bi bi-house-fill"></i>
        <div class="gs-b ml-2 mt-0.5">Home</div>
      </div>
      <div class="v-divisor"></div>
      <div
        class="icontext-wrapper"
        :class="selection == 2 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="manageClick"
      >
        <i class="bi bi-menu-app-fill"></i>
        <div class="gs-b ml-2 mt-0.5">Manage</div>
      </div>
      <div class="v-divisor"></div>
      <div
        class="icontext-wrapper"
        :class="selection == 3 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="postClick"
      >
        <i class="bi bi-send-fill"></i>
        <div class="gs-b ml-2 mt-0.5">Post Ad...</div>
      </div>
    </div>

    <!-- MID PART -->

    <!-- RIGHT PART -->
    <div class="flex flex-row mr-1 my-1">
      <div class="gs-r rounded-full px-2 py-1 text-green-100 mt-0.5 mr-1">
        {{ userInfo.username }}
      </div>
      <img
        class="rounded-full h-10 w-10 object-cover"
        src="https://avatars.githubusercontent.com/u/67905897?v=4"
        alt="user avatar"
      />
    </div>
  </div>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.icontext-wrapper {
  @apply rounded-full flex flex-row px-2 py-1 ml-1 my-1 cursor-pointer transition-all;
}

.icontext-chosen {
  @apply text-green-700 bg-green-100 hover:bg-green-200;
}

.icontext-unchosen {
  @apply text-green-100 hover:text-green-700 hover:bg-green-100;
}

.v-divisor {
  @apply my-2 bg-green-300 mx-2;
  width: 1px;
}
</style>