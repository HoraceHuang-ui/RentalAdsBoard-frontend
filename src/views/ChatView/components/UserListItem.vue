<script setup lang="ts">
defineProps({
  user: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="h-16 flex flex-row cursor-default hover:bg-green-200 hover:text-green-600 transition-all"
    :class="selected ? 'item-selected' : ''"
  >
    <img
      v-if="user.avatarBase64"
      class="rounded-full object-cover bg-white w-10 h-10 m-3"
      :src="`data:image/png;base64,${user.avatarBase64}`"
      :alt="`Avatar of user ${user.username}`"
    />
    <img
      v-else
      class="rounded-full object-cover bg-white w-10 h-10 m-3"
      src="../../../assets/images/default_avatar.webp"
      :alt="`Default avatar of user ${user.username}`"
    />
    <div class="text-xl my-5">{{ user.username }}</div>
  </div>
</template>

<style scoped>
.item-selected {
  @apply bg-green-600 text-green-100 hover:bg-green-500;
  font-family: google-sans-text-bold, sans-serif;
}
</style>