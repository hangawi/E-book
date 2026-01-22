<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VideoComponent from '@/components/VideoComponent.vue'

import ThinkComponent from '@/components/ThinkComponent.vue'

// import audio from '@/assets/sound/narr/think.mp3'

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
const thinkContent = ref()
const scriptText = ref()

const isReady = ref(false)

axios.get('/data/11.json').then((result) => {
  json = result.data

  courseInfo.value = json.courseInfo
  pageInfo.value = json.pageInfo
  video.value = json.video_8 as string

  // think가 있을 때만 설정
  if (json.think && json.think.question) {
    thinkContent.value = {
      question: json.think.question,
      answer:   json.think.answer,
    }
  }

  scriptText.value = json.scripts[5] as string

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
  parent.setCurrentPageNumber(6)
})
</script>

<template>
  <VideoComponent
    v-if="isReady"
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
  <div id="refInteractive" ref="refThink" class="animate__animated animate__fadeIn animate__delay-3s">
    <ThinkComponent
      v-if="isReady && thinkContent"
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
}
</style>
