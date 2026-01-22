<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VideoComponent from '@/components/VideoComponent.vue'

import QuizComponent from '@/components/QuizComponent.vue'

// import audio from '@/assets/sound/narr/quiz.mp3'
import imgQ1 from '@/assets/img/quiz/qNum_1.png'
import imgQ2 from '@/assets/img/quiz/qNum_2.png'
import imgQ3 from '@/assets/img/quiz/qNum_3.png'

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
const questionLists = ref()
const scriptText = ref()

const isReady = ref(false)

axios.get('/data/11.json').then((result) => {
  json = result.data

  courseInfo.value = json.courseInfo
  pageInfo.value = json.pageInfo
  video.value = json.video_9 as string
  questionLists.value = [
    {
      qNum:      imgQ1,
      question:  json.quiz[0].question,
      sentence:  json.quiz[0].sentence,
      tall:      json.quiz[0].tall,
      examLists: json.quiz[0].examLists,
      correct:   json.quiz[0].correct,
      explain:   json.quiz[0].explain,
    },
    {
      qNum:      imgQ2,
      question:  json.quiz[1].question,
      sentence:  json.quiz[1].sentence,
      tall:      json.quiz[1].tall,
      examLists: json.quiz[1].examLists,
      correct:   json.quiz[1].correct,
      explain:   json.quiz[1].explain,
    },
    {
      qNum:      imgQ3,
      question:  json.quiz[2].question,
      sentence:  json.quiz[2].sentence,
      tall:      json.quiz[2].tall,
      examLists: json.quiz[2].examLists,
      correct:   json.quiz[2].correct,
      explain:   json.quiz[2].explain,
    },
  ]

  scriptText.value = json.scripts[6] as string

  setTimeout(() => {
    isReady.value = true
  }, 1)
}).catch(() => {
  console.log('error')
})

const refQuiz = ref('')

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
  parent.setCurrentPageNumber(7)
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
  <div id="refInteractive" ref="refQuiz" class="animate__animated animate__fadeIn animate__delay-5s">
    <QuizComponent
      v-if="isReady"
      :course-info="courseInfo"
      :question-lists="questionLists"
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

