<script setup lang="ts">
defineProps({
  msg: {
    type: String,
    default: 'Test chat bubble'
  },
  user: {
    type: Object,
    required: true
  },
  self: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    v-if="!self"
    class="flex flex-row mx-3 my-5"
    style="overflow-wrap: break-word; word-break: break-word; max-width: 80%"
  >
    <img
      v-if="user.avatarBase64"
      class="rounded-full object-cover bg-white w-10 h-10"
      :src="`data:image/png;base64,${user.avatarBase64}`"
      :alt="`Avatar of user ${user.username}`"
    />
    <img
      v-else
      class="rounded-full object-cover bg-white w-10 h-10"
      src="../../assets/images/default_avatar.webp"
      :alt="`Default avatar of user ${user.username}`"
    />
    <div class="ml-2 rounded-3xl bg-gray-100 py-2 px-3">
      {{ msg }}
    </div>
  </div>
  <div
    v-else
    class="flex flex-row mx-3 my-5 justify-between"
    style="overflow-wrap: break-word; word-break: break-word"
  >
    <div class="w-1" />
    <div class="flex flex-row" style="max-width: 80%">
      <div class="mr-2 rounded-3xl bg-green-600 py-2 px-3 text-white">
        {{ msg }}
      </div>
      <img
        v-if="user.avatarBase64"
        class="rounded-full object-cover bg-white w-10 h-10"
        :src="`data:image/png;base64,${user.avatarBase64}`"
        :alt="`Avatar of user ${user.username}`"
      />
      <img
        v-else
        class="rounded-full object-cover bg-white w-10 h-10"
        src="../../assets/images/default_avatar.webp"
        :alt="`Default avatar of user ${user.username}`"
      />
    </div>
  </div>
</template>

<style scoped></style>