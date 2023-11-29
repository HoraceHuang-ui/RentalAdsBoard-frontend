<script setup lang="ts">
import CardTemplate from '@/components/CardTemplate.vue'
import MyInput from '@/components/MyInput.vue'
import { ref } from 'vue'
import MyButton from '@/components/MyButton.vue'

// login
const username = ref('')
const pwd = ref('')

//reg exclusive
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

const loginClick = () => {}

const registerConfirm = () => {
  if (pwd.value !== confPwd.value) {
    pwdErrorShow.value = true
  }
}
</script>

<template>
  <CardTemplate
    v-if="reg"
    class="bg-green-50 rounded-3xl border border-green-600 shadow shadow-green-100"
    title="Register"
  >
    <div class="flex flex-row w-full gst-r mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Username</div>
      <my-input class="w-64" placeholder="Your preferred username" v-model="username" />
    </div>
    <div class="flex flex-row w-full gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">email</div>
      <my-input class="w-64" placeholder="Your email" v-model="email" />
    </div>
    <div class="flex flex-row w-full gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Password</div>
      <my-input
        class="w-64"
        placeholder="Your password"
        v-model="pwd"
        @change="pwdErrorShow = false"
      />
    </div>
    <div class="flex flex-row w-full gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-32">Confirm Password</div>
      <my-input
        class="w-64"
        placeholder="Your password again"
        v-model="confPwd"
        @change="pwdErrorShow = false"
      />
    </div>
    <div v-if="pwdErrorShow" class="w-full text-right gst-i text-red-600 pr-6">
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
    class="bg-green-50 rounded-3xl border border-green-600 shadow shadow-green-100"
    title="Login"
  >
    <div class="flex flex-row w-full gst-r mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-20">Username</div>
      <my-input class="w-64" placeholder="Username or email" v-model="username" />
    </div>
    <div class="flex flex-row w-full gst-r mt-2 mx-5">
      <div class="gs-r mr-2 h-8 mt-1 w-20">Password</div>
      <my-input class="w-64" placeholder="Your password" v-model="pwd" />
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

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>