<script setup lang="ts">
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import TopHeader from '@/components/TopHeader/TopHeader.vue'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { ApiDelete, ApiGet, ApiPut } from '@/utils/req'
import { useTemplateMessage, msgProps } from '@/utils/template-message'
import TemplateMessage from '@/components/TemplateMessage.vue'
import { useRouter } from 'vue-router'
import MyPagination from '@/components/MyPagination.vue'
import { useTemplateDialog } from '@/utils/template-dialog'
import ConfirmDialog from '@/views/AdminView/components/ConfirmDialog.vue'

type UserInfo = {
  avatarBase64: string
  email: string
  role: string
  username: string
}

const progressArr = inject('topProgressArr')
const usersList = ref<UserInfo[]>([])
const thisUserInfo = ref<any>({})

const curPage = ref(1)
const totalPages = computed(() => {
  return Math.floor((usersList.value.length - 1) / 10) + 1
})
const curPageUsers = computed(() => {
  return usersList.value.slice((curPage.value - 1) * 10, (curPage.value - 1) * 10 + 10)
})

const scrollHeight = ref(0)
const scrollContentRef = ref<HTMLDivElement>()
const watchFlag = ref(true)
watch(
  () => {
    const len = progressArr.value.length
    if (len > 0) {
      for (const flag of progressArr.value) {
        if (flag == false) {
          watchFlag.value = !watchFlag.value
          return watchFlag.value
        }
      }
      watchFlag.value = !watchFlag.value
      return watchFlag.value
    } else {
      watchFlag.value = !watchFlag.value
      return watchFlag.value
    }
  },
  () => {
    if (scrollContentRef.value) {
      scrollHeight.value = scrollContentRef.value.scrollHeight
    }
  }
)

const switchRole = (idx: number) => {
  const user = usersList.value[idx]
  progressArr.value = [false]
  if (user.role === '1') {
    ApiPut(`board/root/manage?roleChanged=2&username=${user.username}`)
      .then((resp) => {
        if (resp.data && resp.data.stateCode == 200) {
          progressArr.value[0] = true
          usersList.value[idx].role = '2'
          useTemplateMessage(
            TemplateMessage,
            msgProps(`Upgraded '${user.username}' to Admin.`, 'success')
          )
        } else {
          progressArr.value = []
          useTemplateMessage(TemplateMessage, msgProps(resp.data.msg, 'alert', 3000))
        }
      })
      .catch(() => {
        progressArr.value = []
        useTemplateMessage(TemplateMessage, msgProps('Error switching role', 'alert', 3000))
      })
  } else {
    ApiPut(`board/root/manage?roleChanged=1&username=${user.username}`)
      .then((resp) => {
        if (resp.data && resp.data.stateCode == 200) {
          progressArr.value[0] = true
          usersList.value[idx].role = '1'
          useTemplateMessage(
            TemplateMessage,
            msgProps(`Downgraded '${user.username}' to average user.`, 'success')
          )
        } else {
          progressArr.value = []
          useTemplateMessage(TemplateMessage, msgProps(resp.data.msg, 'alert', 3000))
        }
      })
      .catch(() => {
        progressArr.value = []
        useTemplateMessage(TemplateMessage, msgProps('Error switching role', 'alert', 3000))
      })
  }
}
const resetPwd = (idx: number) => {
  const user = usersList.value[idx]
  useTemplateDialog(ConfirmDialog, {
    title: 'Reset Password',
    contents: `The password of this user will be reset to '12345', please inform this user of the action. Continue?`,
    onOk: () => {
      progressArr.value = [false]

      ApiPut(`board/root/resetPassword?username=${user.username}`)
        .then((resp) => {
          if (resp.data && resp.data.stateCode == 200) {
            progressArr.value[0] = true
            useTemplateMessage(
              TemplateMessage,
              msgProps(`Successfully reset password of '${user.username}'.`, 'success')
            )
          } else {
            progressArr.value = []
            useTemplateMessage(TemplateMessage, msgProps(resp.data.msg, 'alert', 3000))
          }
        })
        .catch(() => {
          progressArr.value = []
          useTemplateMessage(TemplateMessage, msgProps('Error deleting user', 'alert', 3000))
        })
    }
  })
}
const deleteUser = (idx: number) => {
  const user = usersList.value[idx]
  useTemplateDialog(ConfirmDialog, {
    title: 'Delete User',
    contents: `This user as well as all related ads will be permanently deleted from database, this action can't be undone. Are you sure?`,
    onOk: () => {
      progressArr.value = [false]

      ApiDelete(`board/root/delete?username=${user.username}`)
        .then((resp) => {
          if (resp.data && resp.data.stateCode == 200) {
            progressArr.value[0] = true
            usersList.value.splice(idx, 1)
            useTemplateMessage(
              TemplateMessage,
              msgProps(`Deleted '${user.username}' from database`, 'success')
            )
          } else {
            progressArr.value = []
            useTemplateMessage(TemplateMessage, msgProps(resp.data.msg, 'alert', 3000))
          }
        })
        .catch(() => {
          progressArr.value = []
          useTemplateMessage(TemplateMessage, msgProps('Error deleting user', 'alert', 3000))
        })
    }
  })
}

const router = useRouter()
onMounted(() => {
  progressArr.value = [false, false]
  ApiGet('board/root')
    .then((resp) => {
      if (resp.data && resp.data.stateCode == 200) {
        progressArr.value[0] = true

        for (const user of resp.data.obj) {
          usersList.value.push(user)
        }
      } else {
        progressArr.value = []
        useTemplateMessage(TemplateMessage, msgProps(resp.data.msg, 'alert', 3000))
      }
    })
    .catch(() => {
      progressArr.value = []
      useTemplateMessage(
        TemplateMessage,
        msgProps('Error loading content, try refreshing page.', 'alert', 3000)
      )
    })

  ApiGet('board/home')
    .then((resp) => {
      thisUserInfo.value = resp.data.obj
      progressArr.value[1] = true
    })
    .catch((err) => {
      progressArr.value = []
      if (err.response.data === 'need to login') {
        useTemplateMessage(TemplateMessage, {
          msg: 'Auth expired, please re-login.',
          type: 'alert'
        })
        router.push('/')
      }
    })
})
</script>

<template>
  <top-header />
  <div class="pt-10"></div>

  <div
    class="rounded-t-3xl bg-white border border-b-0 border-green-600 mx-2 pl-10 pr-14"
    style="height: 6vh; width: 96vw"
  >
    <div class="grid grid-cols-3 text-2xl gs-b text-green-600 py-1.5">
      <div>User</div>
      <div class="text-center">Admin</div>
      <div class="text-right">Actions</div>
    </div>
  </div>

  <scroll-wrapper
    :show-bar="false"
    :scroll-padding="50"
    :scroll-height="scrollHeight"
    height="78vh"
    width="96vw"
    class="bg-white mx-2 rounded-b-3xl border border-green-600 relative"
  >
    <div class="w-full flex flex-row justify-center content-center pt-3">
      <my-pagination
        v-model="curPage"
        :total-pages="totalPages"
        class="absolute bottom-2 w-64 border border-green-400"
      />
    </div>
    <div ref="scrollContentRef">
      <div class="mt-4 mb-16 pl-8">
        <div
          v-for="(user, idx) in curPageUsers"
          :key="idx"
          class="h-16 grid grid-cols-3 rounded-full px-2 mr-10"
          :class="idx % 2 == 0 ? 'bg-green-100' : 'bg-white'"
        >
          <div class="flex flex-row mt-2 ml-2">
            <div class="bg-white rounded-full h-10 w-10 mt-1">
              <img
                v-if="user.avatarBase64"
                class="rounded-full w-10 h-10 object-cover"
                :src="user.avatarBase64"
              />
              <img
                v-else
                class="rounded-full object-cover"
                src="../../assets/images/default_avatar.webp"
              />
            </div>
            <div class="ml-4 mt-3">{{ user.username }}</div>
          </div>
          <div class="text-center text-xl py-5">
            <i
              @click="switchRole(idx + (curPage - 1) * 20)"
              class="bi hover:text-green-600 cursor-pointer"
              :class="
                user.role === '1'
                  ? 'bi-square'
                  : user.username === thisUserInfo.username
                    ? 'bi-check-square-fill check-disabled'
                    : 'bi-check-square-fill'
              "
            />
          </div>
          <div class="text-center justify-between flex flex-row mt-3 pr-1">
            <div class="w-1" />
            <div class="flex flex-row">
              <div
                @click="resetPwd(idx + (curPage - 1) * 10)"
                class="h-10 mr-2 flex flex-row rounded-full text-blue-600 border border-blue-400 pl-1 pr-3 bg-white cursor-pointer hover:text-blue-100 hover:bg-blue-600 transition-all"
                :class="user.username === thisUserInfo.username ? 'button-disabled' : ''"
              >
                <i class="bi bi-arrow-clockwise text-2xl mr-2 pt-1"></i>
                <div class="pt-2">Reset PWD.</div>
              </div>
              <div
                @click="deleteUser(idx + (curPage - 1) * 10)"
                class="h-10 w-10 rounded-full text-red-600 border border-red-400 px-1 pt-2 bg-white cursor-pointer hover:text-red-100 hover:bg-red-600 transition-all"
                :class="user.username === thisUserInfo.username ? 'button-disabled' : ''"
              >
                <i class="bi bi-trash-fill"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </scroll-wrapper>
</template>

<style scoped>
.check-disabled {
  @apply text-gray-300 pointer-events-none;
}

.button-disabled {
  @apply text-gray-400 bg-gray-100 border-gray-400 pointer-events-none;
}
</style>