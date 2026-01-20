<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VideoComponent from '@/components/VideoComponent.vue'
import 'video.js/dist/video-js.css'

import PreComponent from '@/components/PreComponent.vue'

import audio from '@/assets/sound/narr/pre.mp3'

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
const thinkContent = ref()
const scriptText = ref()

const isReady = ref(false)

axios.get('/data/03.json').then((result) => {
  json = result.data

  courseInfo.value = json.courseInfo
  pageInfo.value = json.pageInfo
  thinkContent.value = {
    question: json.think.question,
    answer:   json.think.answer,
  }

  scriptText.value = json.scripts[1] as string

  setTimeout(() => {
    isReady.value = true
  }, 1)
}).catch(() => {
  console.log('error')
})

const refThink = ref('')

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
  setTimeout(() => {
    const elMain = document.querySelector('#refInteractive') as HTMLDivElement
    const elVideo = document.querySelector('#videoPlayer') as HTMLVideoElement
    elVideo.appendChild(elMain)
  }, 100)
  parent.setCurrentPageNumber(2)
})
</script>

<template>
  <VideoComponent
    v-if="isReady"
    :video="audio"
    :course-info="courseInfo"
    :page-info="pageInfo"
    :script-text="scriptText"
    :current-page="props.currentPage"
    :total-pages="props.totalPages"
    :auto-start="true"
    :is-audio="true"
    @handle-prev="handlePrev"
    @handle-next="handleNext"
    @handle-change-page="handleChangeIndex"
  />
  <div id="refInteractive" ref="refThink">
    <PreComponent
      v-if="isReady"
      :think-content="thinkContent"
      @handle-next="handleNext"
    />
  </div>
</template>

<style scoped>
.video-js .vjs-tech {
  display: none;
}
#refInteractive {
  position: absolute;
  width: 1120px;
  height: 630px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.75);
}
</style>
