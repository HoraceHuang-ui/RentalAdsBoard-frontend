<script setup lang="ts">
// 1: home; 2: manage; 3: post/edit
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiGet, ApiPut } from '@/utils/req'
import { useTemplateMessage } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useTemplateDialog } from '@/utils/template-dialog'
import InfoEditDialog from '@/components/TopHeader/components/InfoEditDialog.vue'

defineProps(['selection'])
const userInfo = ref<any>({})
const userOptionsShow = ref(false)

const router = useRouter()
onMounted(() => {
  // userInfo.value = auth.userInfo
  ApiGet('board/home')
    .then((resp) => {
      userInfo.value = resp.data.obj
    })
    .catch((err) => {
      if (err.response.data === 'need to login') {
        useTemplateMessage(TemplateMessage, {
          msg: 'Auth expired, please re-login.',
          type: 'alert'
        })
        router.push('/')
      }
    })
})

const homeClick = () => {
  router.push('/home')
}
const manageClick = () => {
  router.push('/manage')
}
const postClick = () => {
  router.push('/post')
}

const adminManageUsersClick = () => {
  router.push('/admin')
}

const editUserInfoClick = () => {
  useTemplateDialog(InfoEditDialog, {
    userInfo: userInfo.value,
    onClose: () => {
      router.go(0)
    }
  })
}

const logout = () => {
  localStorage.clear()
  router.push('/')
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
    <div
      @mouseenter="userOptionsShow = true"
      @mouseleave="userOptionsShow = false"
      class="flex flex-row rounded-full mr-1 my-1 cursor-default text-green-100 hover:bg-green-100 hover:text-green-600 transition-all"
    >
      <div
        v-if="userInfo.role === '2'"
        class="gs-b rounded-full border-2 border-red-600 bg-red-100 text-red-600 text-sm my-1 py-1 px-2 ml-1"
      >
        Admin
      </div>
      <div class="gs-r rounded-full px-2 py-1 mt-0.5 mr-1">
        {{ userInfo.username }}
      </div>
      <img
        class="rounded-full h-10 w-10 object-cover"
        :src="userInfo.avatarBase64"
        alt="user avatar"
      />
      <div
        class="absolute right-2 top-11 transition-all z-50"
        :class="userOptionsShow ? '' : 'user-options-hide'"
        style="transition-duration: 300ms"
      >
        <div
          class="bg-green-50 rounded-3xl w-56 mt-4 text-lg px-5 py-4 border border-green-600 shadow-xl shadow-green-200"
        >
          <div
            v-if="userInfo.role === '2'"
            @click="adminManageUsersClick"
            class="flex flex-row text-gray-700 w-full py-1 pl-3 rounded-full hover:text-green-700 hover:bg-green-200 transition-all cursor-pointer"
          >
            <i class="bi bi-person-gear text-3xl" />
            <div class="ml-3 mt-1">Manage users</div>
          </div>
          <div
            @click="editUserInfoClick"
            class="flex flex-row text-gray-700 w-full py-1 pl-3 rounded-full hover:text-green-700 hover:bg-green-200 transition-all cursor-pointer"
          >
            <i class="bi bi-person-vcard text-3xl" />
            <div class="ml-3 mt-1">Edit user info</div>
          </div>
          <div
            @click="logout"
            class="flex flex-row text-red-600 w-full py-1 pl-3 rounded-full hover:bg-red-100 transition-all cursor-pointer"
          >
            <i class="bi bi-box-arrow-left text-3xl" />
            <div class="ml-3 mt-1">Log out</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.user-options-hide {
  @apply opacity-0 pointer-events-none translate-y-3;
}
</style>