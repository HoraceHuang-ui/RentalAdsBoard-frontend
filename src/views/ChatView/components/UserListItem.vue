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
    class="h-16 flex flex-row justify-between w-full cursor-default hover:bg-green-200 hover:text-green-600 transition-all"
    :class="selected ? 'item-selected' : ''"
  >
    <div class="flex flex-row">
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
      <div class="flex flex-col justify-center">
        <div class="mt-1" style="font-size: 1.25rem; line-height: 1rem">
          {{ user.username }}
        </div>
        <div
          v-if="!selected && user.lastMsg && user.lastMsg !== ''"
          class="last-msg-preview mt-1 pr-2 gst-r opacity-70"
        >
          {{ user.lastMsg }}
        </div>
      </div>
    </div>
    <div
      v-if="user.unread"
      class="w-2 h-2 rounded-full bg-red-500 my-7 mr-2"
      style="min-width: 0.5rem"
    />
  </div>
</template>

<style scoped>
.item-selected {
  @apply bg-green-600 text-green-100 hover:bg-green-500;
  font-family: google-sans-text-bold, sans-serif;
}

.last-msg-preview {
  text-align: left;
  font-size: 0.875rem;
  line-height: 1rem;
  max-height: 1rem;
  overflow: hidden;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
  word-break: break-word;
}
</style>