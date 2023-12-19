import './assets/main.css'
import './assets/fonts/fonts.css'

import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const progressArr = ref<boolean[]>([])
const ws = ref<WebSocket>()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.provide('topProgressArr', progressArr)
app.provide('websocket', ws)

app.mount('#app')
