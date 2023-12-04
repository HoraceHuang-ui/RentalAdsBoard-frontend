<script setup lang="ts">
import TemplateDialog from '@/components/TemplateDialog.vue'
import MyInput from '@/components/MyInput.vue'
import { ref, inject } from 'vue'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import { ApiPut } from '@/utils/req'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
})

const dialogRef = ref()

const avatar = ref(props.userInfo.avatarBase64)
const username = ref(props.userInfo.username)
const email = ref(props.userInfo.email)
const originPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const avatarChanged = ref(false)

const router = useRouter()

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
  // images.value.push('https://avatars.githubusercontent.com/u/67905897?v=4')
  const imageInput = document.getElementById('imageInput')
  if (imageInput) {
    imageInput.click()
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
      avatarChanged.value = true
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}

const confirmClick = () => {
  if (username.value.length > 20) {
    useTemplateMessage(TemplateDialog, msgProps('Username too long', 'alert'))
    return
  }
  if (originPwd.value !== '' && newPwd.value !== confirmPwd.value) {
    useTemplateMessage(TemplateDialog, msgProps('Inconsistent passwords', 'alert'))
    return
  }

  ApiPut('board/update', {
    username: username.value,
    email: email.value,
    avatarBase64: avatarChanged.value ? avatar.value : null
  })
    .then((resp) => {
      if (resp.data && resp.data.stateCode == 200) {
        useTemplateMessage(TemplateMessage, msgProps('User info updated', 'success'))
        if (originPwd.value !== '') {
          ApiPut('board/update/password', {
            originPassword: originPwd.value,
            newPassword: newPwd.value
          })
            .then((pwdResp) => {
              if (pwdResp.data && pwdResp.data.stateCode == 200) {
                useTemplateMessage(
                  TemplateMessage,
                  msgProps('Password changed successfully', 'success', 3000)
                )
                closeDialog(500)
              }
            })
            .catch((err) => {
              useTemplateMessage(TemplateMessage, msgProps(err.data.message, 'alert', 3000))
            })
        } else {
          closeDialog(500)
        }
      } else {
        useTemplateMessage(TemplateMessage, msgProps(resp.data.message, 'alert'))
      }
    })
    .catch((err) => {
      useTemplateMessage(TemplateMessage, msgProps(err.data.message, 'alert'))
    })
}
</script>

<template>
  <template-dialog
    ref="dialogRef"
    title="Edit User Info"
    :show-cancel="true"
    width="500px"
    @on-ok="confirmClick"
  >
    <div class="w-full justify-between flex flex-row mb-6 mt-6">
      <div class="w-0.5"></div>
      <div
        v-show="avatar === ''"
        @click="addAvatarClick"
        class="rounded-full w-16 h-16 border-4 border-dashed border-gray-400 text-center relative text-gray-500 hover:border-green-600 hover:text-green-600 transition-all cursor-pointer"
      >
        <input type="file" id="imageInput" class="opacity-0" @change="addAvatar($event)" />
        <div class="gs-r text-4xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          +
        </div>
      </div>
      <img
        v-show="avatar !== ''"
        :src="avatar"
        @click="addAvatarClick"
        class="rounded-full w-16 h-16 cursor-pointer"
      />
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
      <my-input type="inpujk ht" class="w-72" placeholder="Your email" v-model="email" />
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