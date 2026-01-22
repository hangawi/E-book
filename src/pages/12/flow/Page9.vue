<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VideoComponent from '@/components/VideoComponent.vue'

import poster from '@/assets/img/common/poster.png'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['prevPage', 'nextPage', 'changePage'])

let json

const courseInfo = ref()
const pageInfo = ref()
const video = ref()
const scriptText = ref()

const isReady = ref(false)

axios.get('/data/12.json').then((result) => {
  json = result.data

  courseInfo.value = json.courseInfo
  pageInfo.value = json.pageInfo
  video.value = json.video_11 as string
  scriptText.value = json.scripts[9] as string

  setTimeout(() => {
    isReady.value = true
  }, 1)
}).catch(() => {
  console.log('error')
})

const handlePrev = () => {
  emit('prevPage')
}
const handleNext = () => {
  emit('nextPage')
}
const handleChangeIndex = (target: number) => {
  emit('changePage', target)
}

onMounted(() => {
  parent.setCurrentPageNumber(9)
})
</script>

<template>
  <VideoComponent
    v-if="isReady"
    :poster="poster"
    :video="video"
    :course-info="courseInfo"
    :page-info="pageInfo"
    :script-text="scriptText"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :auto-start="true"
    @handle-prev="handlePrev"
    @handle-next="handleNext"
    @handle-change-page="handleChangeIndex"
  />
  <div id="refInteractive" />
</template>

<style scoped>
#refInteractive {
  position: absolute;
  width: 1120px;
  height: 630px;
  overflow: hidden;
  pointer-events: none;
}
</style>
