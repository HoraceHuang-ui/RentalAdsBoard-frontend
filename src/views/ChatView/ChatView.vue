<script setup lang="ts">
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { ApiGet, ChatAPI, UserAPI } from '@/utils/req'
import { useRoute, useRouter } from 'vue-router'
import UserListItem from '@/views/ChatView/components/UserListItem.vue'
import MyInput from '@/components/MyInput.vue'
import ChatBubble from '@/views/ChatView/components/ChatBubble.vue'

type Message = {
  userFrom: string
  userTo: string
  message: string
}

const route = useRoute()
const router = useRouter()
const ws = inject('websocket')
const progressArr = inject('topProgressArr')
const msgUnread = inject('msgUnread')

const users = ref<any[]>([])
const curUserInfo = ref<any>({})
const curUsername = ref<string>()
const curIdx = computed(() => {
  for (const [idx, user] of users.value.entries()) {
    if (user.username === curUserInfo.value.username) {
      return idx
    }
  }
  return -1
})
const chatMessages = ref<Array<Message>>([])
const selfUserInfo = JSON.parse(localStorage.getItem('userInfo'))
const msgBuf = ref('')

const userClick = (username: string, idx: number) => {
  if (username === curUsername.value) {
    return
  }
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
  ApiGet(ChatAPI.HISTORY_MESSAGES(curUsername.value))
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

  users.value[curIdx.value].lastMsg = msgItem.message

  msgBuf.value = ''
}

onMounted(() => {
  curUsername.value = route.query.username

  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.userFrom === curUsername.value) {
      chatMessages.value.push(data)
    } else {
      let found = false
      for (const [idx, user] of users.value.entries()) {
        if (user.username === data.userFrom) {
          users.value[idx].unread = true
          users.value[idx].lastMsg = data.message
          const target = users.value.splice(idx, 1)[0]
          users.value.unshift(target)
          found = true
          break
        }
      }
      if (!found) {
        ApiGet(UserAPI.INFO_BY_USERNAME(data.userFrom)).then((resp) => {
          const user = resp.data.obj
          users.value.unshift({
            ...user,
            unread: true,
            lastMsg: data.message
          })
        })
      }
    }
  }

  msgUnread.value = false
  progressArr.value = [false, false]
  ApiGet(ChatAPI.HISTORY_USERS)
    .then((resp) => {
      for (let i = 0; i < resp.data.obj.length; i++) {
        progressArr.value.push(false)
      }

      progressArr.value[0] = true
      let curExist = false

      for (const [idx, user] of resp.data.obj.entries()) {
        if (user.username === selfUserInfo.username) {
          progressArr.value[idx + 2] = true
          continue
        }
        if (user.username === curUsername.value) {
          curExist = true
        }

        ApiGet(ChatAPI.LATEST_MSG(user.username))
          .then((msgResp) => {
            progressArr.value[idx + 2] = true
            let unread
            let lastMsg
            lastMsg = msgResp.data.obj.message
            unread =
              msgResp.data.obj.userFrom === selfUserInfo.username ? false : !msgResp.data.obj.read
            if (unread) {
              users.value.unshift({
                ...user,
                unread: unread,
                lastMsg: lastMsg
              })
            } else {
              users.value.push({
                ...user,
                unread: unread,
                lastMsg: lastMsg
              })
            }
          })
          .catch((err) => {
            progressArr.value[idx + 2] = true
            console.error(err)
          })
      }
      if (!curExist && curUsername.value && curUsername.value !== '') {
        ApiGet(UserAPI.INFO_BY_USERNAME(curUsername.value))
          .then((resp) => {
            progressArr.value[1] = true
            const user = resp.data.obj
            users.value.push({
              ...user,
              unread: false,
              lastMsg: ''
            })
          })
          .catch((err) => {
            progressArr.value = []
            console.error(err)
          })
      } else {
        progressArr.value[1] = true
      }
    })
    .catch((err) => {
      progressArr.value = []
      console.error(err)
    })
})
onUnmounted(() => {
  for (const user of users.value) {
    if (user.unread) {
      msgUnread.value = true
      break
    }
  }
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
          <chat-bubble
            v-for="(msg, idx) in chatMessages"
            :key="idx"
            :msg="msg.message"
            :self="msg.userFrom !== curUsername"
            :user="msg.userFrom === curUsername ? curUserInfo : selfUserInfo"
            class="pr-2"
          />
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