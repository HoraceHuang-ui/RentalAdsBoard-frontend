<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import { onMounted, ref } from 'vue'
import MyButton from '@/components/MyButton.vue'
import MyInput from '@/components/MyInput.vue'
import { useRouter } from 'vue-router'
import { ApiPost } from '@/utils/req'

// login
const username = ref('')
const pwd = ref('')

//reg exclusive
const avatar = ref('')
const confPwd = ref('')
const email = ref('')
const pwdErrorShow = ref(false)

const reg = ref(false)

const registerClick = () => {
  reg.value = true
}

const cancelRegisterClick = () => {
  reg.value = false
}

const router = useRouter()
// const auth = useAuthStore()
const loginClick = () => {
  console.log('login click')
  ApiPost('board/login', {
    username: username.value,
    password: pwd.value
  })
    .then((resp) => {
      if (resp.data.stateCode == 200) {
        localStorage.setItem('token', 'Bearer ' + resp.data.obj)
        router.push('/home')
      } else {
        pwd.value = ''
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const registerConfirm = () => {
  if (pwd.value !== confPwd.value) {
    pwdErrorShow.value = true
    return
  }
  if (username.value.length > 20) {
    return
  }
  ApiPost('board/register', {
    username: username.value,
    password: pwd.value,
    role: '1',
    email: email.value,
    avatarBase64: avatar.value
  })
    .then((resp) => {
      console.log(resp)
      if (resp.status == 200) {
        username.value = ''
        pwd.value = ''
        confPwd.value = ''
        email.value = ''
        avatar.value = ''
        reg.value = false
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const addAvatarClick = () => {
  // images.value.push('https://avatars.githubusercontent.com/u/67905897?v=4')
  console.log('avatar click')
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
    }
    reader.onerror = (error) => {
      console.error('Error reading file:', error)
    }
  }
}

onMounted(() => {
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    router.push('/home')
  }
})
</script>

<template>
  <CardTemplate
    v-if="reg"
    class="bg-green-50 rounded-3xl border border-green-600 shadow shadow-green-100"
    title="Register"
  >
    <div class="w-full justify-between flex flex-row mb-6">
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
    <div class="flex flex-row w-full gst-r mx-5 relative">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Username</div>
      <my-input
        type="input"
        class="w-72"
        placeholder="Your preferred username"
        v-model="username"
      />
      <div
        class="absolute right-14 top-0.5 h-7 py-1 gst-r px-2 rounded-full"
        :class="username.length <= 20 ? 'text-gray-400' : 'text-red-500'"
        style="background-color: rgba(255 255 255 / 0.8)"
      >
        {{ username.length }}/20
      </div>
    </div>
    <div class="flex flex-row gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Email</div>
      <my-input type="input" class="w-72" placeholder="Your email" v-model="email" />
    </div>
    <div class="flex flex-row gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Password</div>
      <my-input
        type="password"
        class="w-72"
        placeholder="Your password"
        v-model="pwd"
        @change="pwdErrorShow = false"
      />
    </div>
    <div class="flex flex-row gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Confirm Password</div>
      <my-input
        type="password"
        class="w-72"
        placeholder="Your password again"
        v-model="confPwd"
        @change="pwdErrorShow = false"
      />
    </div>
    <div v-if="pwdErrorShow" class="text-right gst-ri text-red-600 pr-10">
      Inconsistent passwords!
    </div>

    <div class="flex flex-row justify-between mt-4">
      <div class="w-1"></div>
      <div class="flex flex-row">
        <my-button
          @click="cancelRegisterClick"
          content-text="Back"
          class="text-gray-600 mr-2 mb-2 hover:bg-green-200 hover:text-green-800 active:scale-90 transition-all cursor-default"
        ></my-button>
        <my-button
          @click="registerConfirm"
          content-text="Confirm"
          class="bg-green-700 text-white mr-2 mb-2 hover:bg-green-900 active:scale-90 transition-all cursor-default"
        ></my-button>
      </div>
    </div>
  </CardTemplate>

  <CardTemplate
    v-else
    class="bg-green-50 rounded-3xl border border-green-600 shadow shadow-green-100 justify-center"
    title="Login"
  >
    <div class="flex flex-row w-full gst-r mx-7">
      <div class="gs-r mr-2 h-8 mt-1 w-20">Username</div>
      <my-input type="input" class="w-80" placeholder="Username or email" v-model="username" />
    </div>
    <div class="flex flex-row w-full gst-r mt-2 mx-7">
      <div class="gs-r mr-2 h-8 mt-1 w-20">Password</div>
      <my-input
        type="password"
        class="w-80"
        placeholder="Your password"
        v-model="pwd"
        @keyup.native.enter="loginClick"
      />
    </div>

    <div class="flex flex-row justify-between mt-4">
      <div class="w-1"></div>
      <div class="flex flex-row">
        <my-button
          @click="registerClick"
          content-text="Register"
          class="text-gray-600 mr-2 mb-2 hover:bg-green-200 hover:text-green-800 active:scale-90 transition-all cursor-default"
        ></my-button>
        <my-button
          @click="loginClick"
          content-text="Confirm"
          class="bg-green-700 text-white mr-2 mb-2 hover:bg-green-900 active:scale-90 transition-all cursor-default"
        ></my-button>
      </div>
    </div>
  </CardTemplate>
</template>

<style scoped></style>