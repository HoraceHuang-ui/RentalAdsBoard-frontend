<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { inject, onMounted, ref, watch } from 'vue'
import { ApiGet, ChatAPI, UserAPI } from '@/utils/req'
import { useRoute, useRouter } from 'vue-router'
import UserListItem from '@/views/ChatView/components/UserListItem.vue'
import MyInput from '@/components/MyInput.vue'

type Message = {
  userFrom: string
  userTo: string
  message: string
}

const route = useRoute()
const router = useRouter()
const ws = inject('websocket')
const progressArr = inject('topProgressArr')

const users = ref([])
const curUserInfo = ref<any>({})
const curUsername = ref<string>()
const chatMessages = ref<Array<Message>>([])
const selfUserInfo = JSON.parse(localStorage.getItem('userInfo'))
const msgBuf = ref('')

const userClick = (username: string, idx: number) => {
  curUsername.value = username
  users.value[idx].unread = false
  chatMessages.value = []
  router.push({
    name: 'chat',
    query: {
      username: username
    }
  })
}

watch(curUsername, () => {
  progressArr.value = [false, false]
  ApiGet(UserAPI.INFO_BY_USERNAME(curUsername.value))
    .then((resp) => {
      progressArr.value[0] = true
      curUserInfo.value = resp.data.obj
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
    })
  ApiGet(ChatAPI.HISTORY_MESSAGES(selfUserInfo.username, curUsername.value))
    .then((resp) => {
      progressArr.value[1] = true
      chatMessages.value = resp.data.obj
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
    })
})

const sendMsg = () => {
  if (msgBuf.value === '') {
    return
  }

  const msgItem = {
    userFrom: selfUserInfo.username,
    userTo: curUsername.value,
    message: msgBuf.value
  }
  ws.value.send(JSON.stringify(msgItem))

  chatMessages.value.push(msgItem)

  msgBuf.value = ''
}

onMounted(() => {
  curUsername.value = route.query.username
  progressArr.value = [false, false]
  ApiGet(ChatAPI.HISTORY_USERS(selfUserInfo.username))
    .then((resp) => {
      progressArr.value[0] = true
      let curExist = false
      for (const user of resp.data.obj) {
        if (user.username === selfUserInfo.username) {
          continue
        }
        if (user.username === curUsername.value) {
          curExist = true
        }
        users.value.push({
          ...user,
          unread: false
        })
      }
      if (!curExist && curUsername.value && curUsername.value !== '') {
        ApiGet(UserAPI.INFO_BY_USERNAME(curUsername.value))
          .then((resp) => {
            progressArr.value[1] = true
            const user = resp.data.obj
            users.value.push({
              ...user,
              unread: false
            })
          })
          .catch((err) => {
            progressArr.value = []
            console.error(err)
          })
      } else {
        progressArr.value[1] = true
      }
      ws.value.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.userFrom === curUsername.value) {
          chatMessages.value.push(data)
        } else {
          let idx: number, user: any
          for ([idx, user] of users.value.entries()) {
            if (user.username === data.userFrom) {
              users.value[idx].unread = true
              const target = users.value.splice(idx, 1)[0]
              users.value.unshift(target)
              break
            }
          }
          if (idx == users.value.length) {
            ApiGet(UserAPI.INFO_BY_USERNAME(data.userFrom)).then((resp) => {
              const user = resp.data.obj
              users.value.push({
                ...user,
                unread: true
              })
            })
          }
        }
      }
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
    })
})
</script>

<template>
  <top-header :selection="4" />
  <div class="pt-10" />
  <div
    class="bg-white mx-2 rounded-3xl border border-green-600 flex flex-row overflow-hidden"
    style="height: 84vh; width: 96vw"
  >
    <div class="h-full w-1/4 border-r border-green-300 bg-green-50">
      <scroll-wrapper
        v-if="users && users.length > 0"
        width="100%"
        height="100%"
        :show-bar="true"
        :scroll-padding="0"
      >
        <div class="flex flex-col">
          <user-list-item
            v-for="(user, idx) in users"
            :key="idx"
            :user="user"
            :selected="curUsername === user.username"
            @click="userClick(user.username, idx)"
          />
        </div>
      </scroll-wrapper>
      <div v-else class="w-full h-full relative">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <i class="bi bi-person-raised-hand text-3xl text-green-600 opacity-50" />
          <div class="opacity-80 mt-2">It's quiet here...</div>
        </div>
      </div>
    </div>
    <div class="h-full w-3/4">
      <div v-if="!curUsername || curUsername === ''" class="w-full h-full relative">
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <i class="bi bi-chat-left-text text-3xl text-green-600 opacity-50" />
          <div class="opacity-80 mt-2">
            Start a conversation by selecting a user on the left or creating a session elsewhere!
          </div>
        </div>
      </div>
      <div v-else class="w-full h-full flex flex-col px-5">
        <div class="gs-b text-2xl mt-4">Chat with {{ curUsername }}</div>
        <scroll-wrapper
          v-if="chatMessages && chatMessages.length > 0"
          width="100%"
          height="100%"
          class="border rounded-3xl mt-4"
          :scroll-padding="20"
          :show-bar="true"
          :stick-bottom="true"
        >
          <div v-for="(msg, idx) in chatMessages" :key="idx" class="flex flex-col w-full pr-4">
            <div
              v-if="msg.userFrom === curUsername"
              class="flex flex-row m-3"
              style="overflow-wrap: break-word; word-break: break-word; max-width: 80%"
            >
              <img
                v-if="curUserInfo.avatarBase64"
                class="rounded-full object-cover bg-white w-10 h-10"
                :src="`data:image/png;base64,${curUserInfo.avatarBase64}`"
                :alt="`Avatar of user ${curUserInfo.username}`"
              />
              <img
                v-else
                class="rounded-full object-cover bg-white w-10 h-10"
                src="../../assets/images/default_avatar.webp"
                :alt="`Default avatar of user ${curUserInfo.username}`"
              />
              <div class="ml-2 rounded-3xl bg-gray-100 py-2 px-3">
                {{ msg.message }}
              </div>
            </div>
            <div
              v-else
              class="flex flex-row m-3 justify-between"
              style="overflow-wrap: break-word; word-break: break-word"
            >
              <div class="w-1" />
              <div class="flex flex-row" style="max-width: 80%">
                <div class="mr-2 rounded-3xl bg-green-600 py-2 px-3 text-white">
                  {{ msg.message }}
                </div>
                <img
                  v-if="selfUserInfo.avatarBase64"
                  class="rounded-full object-cover bg-white w-10 h-10"
                  :src="`data:image/png;base64,${selfUserInfo.avatarBase64}`"
                  :alt="`Avatar of user ${selfUserInfo.username}`"
                />
                <img
                  v-else
                  class="rounded-full object-cover bg-white w-10 h-10"
                  src="../../assets/images/default_avatar.webp"
                  :alt="`Default avatar of user ${selfUserInfo.username}`"
                />
              </div>
            </div>
          </div>
        </scroll-wrapper>
        <div v-else class="w-full h-full border rounded-3xl mt-4 relative">
          <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <i class="bi bi-chat-left-text text-3xl text-green-600 opacity-50" />
            <div class="opacity-80 mt-2">Type something below and break the ice!</div>
          </div>
        </div>
        <div class="flex flex-row mt-4 mb-4">
          <my-input
            type="input"
            placeholder="Type a message..."
            v-model="msgBuf"
            class="border w-full mr-2"
            @keyup.native.enter="sendMsg"
          />
          <i
            class="bi bi-arrow-up-circle-fill text-3xl cursor-pointer text-green-600 hover:text-green-500 transition-all"
            :class="msgBuf === '' ? 'send-disabled' : ''"
            @click="sendMsg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.send-disabled {
  @apply opacity-30 hover:text-green-600 cursor-not-allowed;
}
</style>