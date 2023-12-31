<script setup lang="ts">
// 1: home; 2: manage; 3: post/edit
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ApiDelete, ApiGet, UserAPI } from '@/utils/req'
import { chatMsgProps, sysMsgProps, useMessage } from '@/utils/template-message'
import SysMessage from '@/components/SysMessage.vue'
import { useTemplateDialog } from '@/utils/template-dialog'
import InfoEditDialog from '@/components/TopHeader/components/InfoEditDialog.vue'
import ConfirmDialog from '@/views/AdminView/components/ConfirmDialog.vue'
import ChatMessage from '@/components/ChatMessage.vue'

const props = defineProps(['selection'])
const userInfo = ref<any>({})
const userOptionsShow = ref(false)

const ws = inject('websocket')
const msgUnread = inject('msgUnread')

const router = useRouter()
onMounted(() => {
  userInfo.value = localStorage.getItem('userInfo')
  if (userInfo.value) {
    userInfo.value = JSON.parse(userInfo.value)
    if (!ws.value) {
      ws.value = new WebSocket(`ws://localhost:9810/websocket/${userInfo.value.username}`)
    }
    if (props.selection != 4) {
      ws.value.onmessage = (event) => {
        const data = JSON.parse(event.data)
        useMessage(
          ChatMessage,
          chatMsgProps(data.userFrom, data.message, () => {
            router.push({
              name: 'chat',
              query: {
                username: data.userFrom
              }
            })
          })
        )
        msgUnread.value = true
      }
    }
  }
  ApiGet(UserAPI.INFO_SELF)
    .then((resp) => {
      userInfo.value = resp.data.obj
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      if (!ws.value) {
        ws.value = new WebSocket(`ws://localhost:9810/websocket/${userInfo.value.username}`)
      }
      if (props.selection != 4) {
        ws.value.onmessage = (event) => {
          const data = JSON.parse(event.data)
          useMessage(
            ChatMessage,
            chatMsgProps(data.userFrom, data.message, () => {
              router.push({
                name: 'chat',
                query: {
                  username: data.userFrom
                }
              })
            })
          )
          msgUnread.value = true
        }
      }
    })
    .catch((err) => {
      console.error(err)
      useMessage(SysMessage, {
        msg: 'Auth expired, please re-login.',
        type: 'alert'
      })
      localStorage.clear()
      router.push('/')
    })
})
onUnmounted(() => {
  if (ws.value) {
    ws.value.close()
  }
  ws.value = undefined
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
const chatClick = () => {
  router.push('/chat')
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

const deleteAccount = () => {
  useTemplateDialog(ConfirmDialog, {
    title: 'Delete Account',
    contents: `Your account as well as all ads posted by you will be permanently deleted from database, this action can't be undone. Are you sure?`,
    onOk: () => {
      ApiDelete(UserAPI.DELETE_SELF)
        .then((resp) => {
          if (resp.data && resp.data.stateCode == 200) {
            useMessage(SysMessage, sysMsgProps(`Account deleted from database.`, 'success'))
            logout()
          } else {
            useMessage(SysMessage, sysMsgProps(resp.data.msg, 'alert', 3000))
          }
        })
        .catch(() => {
          useMessage(SysMessage, sysMsgProps('Error deleting account', 'alert', 3000))
        })
    }
  })
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
      <div class="v-divisor" />
      <div
        class="icontext-wrapper"
        :class="selection == 2 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="manageClick"
      >
        <i class="bi bi-menu-app-fill"></i>
        <div class="gs-b ml-2 mt-0.5">Manage</div>
      </div>
      <div class="v-divisor" />
      <div
        class="icontext-wrapper"
        :class="selection == 3 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="postClick"
      >
        <i class="bi bi-send-fill"></i>
        <div class="gs-b ml-2 mt-0.5">Post Ad...</div>
      </div>
      <div class="v-divisor" />
      <div
        class="icontext-wrapper pt-1 relative"
        :class="selection == 4 ? 'icontext-chosen' : 'icontext-unchosen'"
        @click="chatClick"
      >
        <i v-if="msgUnread && msgUnread > 0" class="bi bi-envelope-open-fill" />
        <i v-else class="bi bi-envelope-open" />
        <div class="gs-b ml-2 mt-0.5">Chat</div>
        <div
          v-if="msgUnread && msgUnread > 0"
          class="absolute top-2 left-1 w-2 h-2 rounded-full bg-red-500"
        />
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
      <div class="gs-r rounded-full px-3 pr-2 py-1 mt-0.5 mr-1">
        {{ userInfo.username }}
      </div>
      <div v-if="userInfo.avatarBase64" class="bg-white rounded-full h-10 w-10">
        <img
          class="rounded-full object-cover h-10 w-10"
          :src="`data:image/png;base64,${userInfo.avatarBase64}`"
        />
      </div>
      <div v-else class="bg-white rounded-full h-10 w-10">
        <img class="rounded-full object-cover" src="../../assets/images/default_avatar.webp" />
      </div>
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
          <div class="h-0.5 bg-red-600 opacity-50 rounded-full my-2 mx-2"></div>
          <div
            @click="deleteAccount"
            class="flex flex-row text-red-600 w-full py-1 pl-3 rounded-full hover:bg-red-100 transition-all cursor-pointer"
          >
            <i class="bi bi-person-x text-3xl" />
            <div class="ml-3 mt-1">Delete account</div>
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