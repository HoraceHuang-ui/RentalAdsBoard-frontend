import { defineStore } from 'pinia'
// import UserInfoApi from '@/api/user/user-info.api'
import { reactive, ref } from 'vue'

// export const useAuthStore = defineStore('auth', {
//   state: (): {
//     userInfo: object | undefined
//     token: string | undefined
//   } => ({
//     userInfo: undefined,
//     token: undefined
//   }),
//   getters: {
//     hasLogin(): boolean {
//       return !!this.token
//     },
//     getUserInfo(): object | undefined {
//       return JSON.parse(localStorage.getItem('userInfo')!!)
//     },
//     getToken(): string | null {
//       return localStorage.getItem('token')
//     }
//   },
//   actions: {
//     setLogin(userInfo: object, token?: string) {
//       localStorage.setItem('userInfo', JSON.stringify(userInfo))
//       if (token) {
//         localStorage.setItem('token', token)
//         this.token = token
//       }
//       this.userInfo = userInfo
//     },
//     logout() {
//       localStorage.removeItem('userInfo')
//       this.token = undefined
//       this.userInfo = undefined
//     }
//   }
// })

type UserInfo = {
  username: string
  avatarBase64: string
  email: string
  userId: number
}
export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref<UserInfo>({
    username: '',
    avatarBase64: '',
    email: '',
    userId: 0
  })

  // const userCache = reactive({})

  const setUserInfo = (_userInfo: UserInfo) => {
    userInfo.value = { ..._userInfo }
  }

  // const addUserCache = (_userInfo: UserInfo) => {
  //   userCache[_userInfo.username] = _userInfo
  // }

  return {
    userInfo,
    setUserInfo
    // userCache,
    // addUserCache
  }
})
