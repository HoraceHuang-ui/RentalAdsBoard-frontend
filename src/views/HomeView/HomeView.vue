<script setup lang="ts">
import TopHeader from '@/components/TopHeader.vue'
import ScrollWrapper from '@/components/ScrollWrapper.vue'
import CardTemplate from '@/components/CardTemplate.vue'

const lipsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus malesuada efficitur neque, ut semper augue vestibulum vel. Mauris velit erat, sagittis egestas fringilla non, hendrerit vel purus. Cras nec efficitur turpis. Cras massa sem, aliquet quis elementum ut, auctor ornare massa. Maecenas vitae felis commodo odio ullamcorper dictum eu sit amet ante. Proin facilisis dapibus volutpat. Sed tempor nibh sed mattis cursus. Suspendisse molestie nisl quis rhoncus mattis. Aenean rhoncus sapien at est vulputate sagittis. Quisque elit justo, dictum at dignissim eget, semper nec lorem. Fusce sit amet ante fermentum, scelerisque lacus vitae, varius augue. Sed gravida sapien vitae massa venenatis feugiat. Mauris elementum rhoncus consequat. Aenean condimentum justo a quam semper sagittis. Nullam vitae metus sit amet lacus iaculis rutrum in sit amet mauris. Vestibulum efficitur sagittis dolor, nec posuere nisi fermentum sed.

Quisque euismod pretium dapibus. Nulla varius id metus a laoreet. Aliquam arcu orci, bibendum quis odio nec, blandit blandit tortor. Mauris efficitur nulla sit amet erat mollis, et volutpat lectus euismod. Curabitur suscipit sapien id fringilla aliquet. Mauris interdum, justo ut volutpat dignissim, enim leo porttitor libero, eu tincidunt quam lectus sit amet felis. Nam at cursus dui. Morbi quis nisl iaculis, elementum ipsum non, elementum arcu.

Nam aliquet ipsum quis viverra aliquam. Nam risus tortor, condimentum quis rutrum id, malesuada id purus. Mauris sit amet enim varius, placerat urna id, laoreet dui. Quisque quis elit id dui maximus fermentum. Aliquam gravida porttitor elit. Fusce vel ligula id ipsum condimentum consequat. Fusce tincidunt turpis massa, sed laoreet ligula suscipit et. Phasellus congue mattis convallis. Duis vitae dapibus ligula. Sed vitae augue laoreet, feugiat sapien at, porta lectus. Nulla fringilla mi quis nunc pretium, vel gravida mauris ullamcorper. Vestibulum sit amet orci vel tellus egestas gravida non et justo.

Nulla varius, urna vitae aliquam pellentesque, neque turpis laoreet quam, et volutpat ipsum justo pulvinar enim. Vivamus mauris justo, dignissim id tortor in, egestas volutpat mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In facilisis efficitur tempus. Sed sed placerat risus, in facilisis nisi. Maecenas ac elit diam. Nullam id ante neque. Phasellus bibendum nulla sit amet fringilla condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed lacinia augue mauris. Morbi at metus vehicula, tristique dui vel, blandit sem. Pellentesque enim est, tristique ut lorem et, facilisis tempus risus. Nam sapien dui, commodo quis convallis quis, mattis et mauris.

Vestibulum luctus arcu vitae tellus malesuada ullamcorper. Morbi in vehicula sapien, vitae lacinia magna. In eu urna semper, ornare eros a, pulvinar sapien. Sed fringilla pretium risus, eget molestie lacus feugiat vitae. Etiam mattis sem vitae ipsum sagittis finibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla faucibus tempus nisi, et mattis massa hendrerit ut. Vivamus auctor nec purus congue pellentesque. Aenean ornare, magna et aliquam dignissim, nibh neque sagittis tellus, in congue urna nulla vestibulum neque. Cras sit amet suscipit nisi. Nullam ornare sagittis eleifend. Aliquam erat volutpat. Aliquam aliquam, urna et gravida euismod, neque nunc vestibulum urna, id vehicula velit felis a lectus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`
</script>

<template>
  <top-header :selection="1" />
  <div class="pt-10"></div>
  <scroll-wrapper
    height="84vh"
    width="96vw"
    class="bg-white mx-2 pl-6 rounded-3xl border border-green-600"
  >
    <div class="w-full gs-b text-5xl mt-8">Home</div>
    <div class="grid grid-cols-2 w-full gap-2 pr-4 mt-6 pb-4">
      <card-template title="Sample Ad" class="border rounded-3xl">
        <div class="h-40 px-4 py-2 flex flex-row justify-center">
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
        </div>
        <div class="body-detail gst-r m-6">{{ lipsum }}</div>
      </card-template>
      <card-template title="Sample Ad 2" class="border rounded-3xl"></card-template>
      <card-template title="Sample Ad 3" class="border rounded-3xl">
        <div class="h-40 px-4 py-2 flex flex-row justify-center">
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
        </div>
        <div class="body-detail gst-r m-6">{{ lipsum }}</div>
      </card-template>
      <card-template title="Sample Ad 4" class="border rounded-3xl"></card-template>
      <card-template title="Sample Ad 5" class="border rounded-3xl">
        <div class="h-40 px-4 py-2 flex flex-row justify-center">
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
          <img class="rounded-xl mx-3" src="https://avatars.githubusercontent.com/u/67905897?v=4" />
        </div>
        <div class="body-detail gst-r m-6">{{ lipsum }}</div>
      </card-template>
      <card-template title="Sample Ad 6" class="border rounded-3xl"></card-template>
    </div>
  </scroll-wrapper>
</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.body-detail {
  text-align: left;
  font-size: 15px;
  position: relative;
  margin-top: 1vh;
  line-height: 20px;
  max-height: 80px;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}
</style>