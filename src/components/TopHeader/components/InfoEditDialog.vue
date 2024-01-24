<script setup lang="ts">
import TemplateDialog from '@/components/TemplateDialog.vue'
import MyInput from '@/components/MyInput.vue'
import { ref, inject } from 'vue'
import { useMessage, sysMsgProps } from '@/utils/template-message'
import { ApiPut, UserAPI } from '@/utils/req'
import SysMessage from '@/components/SysMessage.vue'
import TopProgressBar from '@/components/TopProgressBar.vue'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  },
  onClose: {
    type: Function,
    required: true
  }
})

const imageInput = ref<HTMLInputElement>()

const avatar = ref(props.userInfo.avatarBase64)
const username = ref(props.userInfo.username)
const email = ref(props.userInfo.email)
const originPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const progressArr = ref<boolean[]>([])

const show = inject('app/showDialog', false)
const unmount: () => void = inject('app/unmountDialog', () => undefined)
const cShow = ref(show)

const closeDialog = (timeout: number) => {
  cShow.value = false
  setTimeout(() => {
    unmount()
  }, timeout)
}

const addAvatarClick = () => {
  if (imageInput.value) {
    imageInput.value.click()
  }
}

const addAvatar = (event) => {
  let base64 = ''
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      base64 = reader.result
      avatar.value = base64
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}

const strContains = (source: string, target: string) => {
  for (let i = 0; i < source.length - target.length; i++) {
    if (target == source.substring(i, i + target.length)) {
      return true
    }
  }
  return false
}

const confirmClick = () => {
  if (username.value.length > 20) {
    useMessage(SysMessage, sysMsgProps('Username too long', 'warn'))
    return
  }
  if (email.value.length == 0 || !strContains(email.value, '@')) {
    useMessage(SysMessage, sysMsgProps('Invalid email', 'warn'))
    return
  }
  if (originPwd.value !== '' && newPwd.value !== confirmPwd.value) {
    useMessage(SysMessage, sysMsgProps('Inconsistent passwords', 'warn'))
    return
  }

  progressArr.value = [false, false]
  ApiPut(UserAPI.UPDATE_INFO, {
    username: username.value.toLowerCase(),
    email: email.value,
    avatarBase64: avatar.value.replace(new RegExp('data:image/\\w+;base64,'), '')
  })
    .then((resp) => {
      progressArr.value[0] = true
      localStorage.setItem(
        'userInfo',
        JSON.stringify({
          username: username.value.toLowerCase(),
          email: email.value,
          avatarBase64: avatar.value,
          role: props.userInfo.role
        })
      )

      if (resp.data && resp.data.stateCode == 200) {
        if (originPwd.value !== '') {
          if (originPwd.value === newPwd.value) {
            progressArr.value = []
            useMessage(
              SysMessage,
              sysMsgProps(`The new password can't be the same as the original one`, 'warn', 3000)
            )
            return
          }
          ApiPut(UserAPI.UPDATE_PWD, {
            originPassword: originPwd.value,
            newPassword: newPwd.value
          })
            .then((pwdResp) => {
              progressArr.value[1] = true
              if (pwdResp.data && pwdResp.data.stateCode == 200) {
                useMessage(SysMessage, sysMsgProps('User info updated', 'success'))
                props.onClose()
                closeDialog(500)
              } else {
                progressArr.value = []
                useMessage(SysMessage, sysMsgProps(pwdResp.data.message, 'warn', 3000))
              }
            })
            .catch(() => {
              progressArr.value = []
              useMessage(SysMessage, sysMsgProps('Wrong password', 'warn', 3000))
            })
        } else {
          progressArr.value[1] = true
          useMessage(SysMessage, sysMsgProps('User info updated', 'success'))
          props.onClose()
          closeDialog(500)
        }
      } else {
        progressArr.value = []
        useMessage(SysMessage, sysMsgProps(resp.data.message, 'warn'))
      }
    })
    .catch((err) => {
      progressArr.value = []
      useMessage(SysMessage, sysMsgProps(err.message, 'warn'))
    })
}
</script>

<template>
  <template-dialog title="Edit User Info" :show-cancel="true" width="500px" @on-ok="confirmClick">
    <top-progress-bar class="rounded-t-3xl mx-4" :progress-arr="progressArr" />

    <div class="w-full justify-between flex flex-row mb-6 mt-6">
      <div class="w-0.5"></div>
      <div
        v-show="!avatar || avatar === ''"
        @click="addAvatarClick"
        class="rounded-full w-16 h-16 border-4 border-dashed border-gray-400 text-center relative text-gray-500 hover:border-green-600 hover:text-green-600 transition-all cursor-pointer"
      >
        <input ref="imageInput" type="file" class="opacity-0" @change="addAvatar($event)" />
        <div class="gs-r text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          +
        </div>
      </div>
      <div v-show="avatar !== ''" class="bg-white rounded-full w-16 h-16">
        <img
          @click="addAvatarClick"
          class="rounded-full w-16 h-16 cursor-pointer object-cover"
          :src="`data:image/png;base64,${avatar}`"
          alt="Current avatar"
        />
      </div>
      <div class="w-0.5"></div>
    </div>
    <div class="flex flex-row w-full mx-5 relative">
      <div class="gs-r mr-4 h-8 mt-1 w-28">Username</div>
      <my-input
        type="input"
        style="width: 16.75rem"
        placeholder="Your preferred username"
        v-model="username"
      />
      <div
        class="absolute right-12 top-0.5 h-7 py-1 px-2 rounded-full"
        :class="username.length <= 20 ? 'text-gray-400' : 'text-red-500'"
        style="background-color: rgba(255 255 255 / 0.8)"
      >
        {{ username.length }}/20
      </div>
    </div>
    <div class="flex flex-row mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Email</div>
      <my-input type="input" class="w-72" placeholder="Your email" v-model="email" />
    </div>
    <details class="mt-4">
      <summary class="cursor-pointer">Password</summary>
      <div class="flex flex-row mt-2 mx-5">
        <div class="gs-r mr-2 h-8 mt-1 w-32">Present</div>
        <my-input
          type="password"
          class="w-72"
          placeholder="Your old password"
          v-model="originPwd"
        />
      </div>
      <div class="flex flex-row mt-2 mx-5">
        <div class="gs-r mr-2 h-8 mt-1 w-32">New</div>
        <my-input type="password" class="w-72" placeholder="Your new password" v-model="newPwd" />
      </div>
      <div class="flex flex-row mt-2 mx-5">
        <div class="gs-r mr-2 h-8 mt-1 w-32">Confirm</div>
        <my-input
          type="password"
          class="w-72"
          placeholder="Your new password again"
          v-model="confirmPwd"
        />
      </div>
    </details>
  </template-dialog>
</template>

<style scoped></style>