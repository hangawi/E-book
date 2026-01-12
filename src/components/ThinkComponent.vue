<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSound } from '@vueuse/sound'
import 'animate.css'

import sfxClick from '@/assets/sound/effect/click.mp3'

import imgQuestionLeft from '@/assets/img/think/questionLeft.png'
import imgQuestionRight from '@/assets/img/think/questionRight.png'

const props = defineProps({
  thinkContent: {
    type: Object,
    required: true,
  },
})

const soundClick = useSound(sfxClick)

const thinkSeq = ref(0)

const refThink = ref()

const thinkContent = props.thinkContent

const handleStart = () => {
  if (thinkSeq.value > 0)
    return false

  soundClick.play()
  thinkSeq.value++

  const elButton = document.querySelector('.think-intro-container .btnStart') as HTMLElement
  const elAnswer = document.querySelector('.think-intro-container .area-answer') as HTMLElement

  elButton.classList.remove('animate__delay-2s')
  elButton.classList.add('animate__flipOutX')

  setTimeout(() => {
    elAnswer.classList.remove('hidden')
    elAnswer.classList.add('animate__fadeIn')
  }, 500)
}

onMounted(() => {
  const elProgress = document.querySelector('.video-js .vjs-progress-control') as HTMLElement
  const elPlayControl = document.querySelector('.vjs-play-control') as HTMLElement
  elProgress.classList.add('event-none')
  elPlayControl.classList.add('event-none')
  setTimeout(() => {
    handleStart()
  }, 12000)
})
</script>

<template>
  <v-container
    id="elOverlay"
    ref="refThink"
    class="w-100 pa-0 think-intro-container animate__animated animate__fadeIn animate__slow"
  >
    <v-row>
      <v-col class="think-question questionHead">
        <p>
<!--          <img class="animate__animated animate__fadeInLeftBig animate__delay-1s" :src="imgQuestionLeft" alt="">-->
          <span class="animate__animated animate__fadeIn animate__delay-1_6s" v-html="thinkContent.question" />
<!--          <img class="animate__animated animate__fadeInRightBig animate__delay-1s" :src="imgQuestionRight" alt="">-->
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <button
          class="d-flex position-relative ma-auto animate__animated animate__delay-2s animate__flipInX btnStart"
          @click="handleStart"
        >
          START
        </button>
      </v-col>
    </v-row>
    <v-row class="ma-0 mt-6 area-answer hidden animate__animated">
      <v-col class="d-flex align-end mr-4">
        <div class="answerContent animate__animated animate__fadeIn animate__delay-1s">
          <p v-html="thinkContent.answer" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
// 인트로 화면
.think-intro-container {
  background: transparent url(@/assets/img/think/bgThink.png) no-repeat 0 0;
  background-size: contain;
  width: 100%;
  height: 100%;
  max-width: 1120px;
  position: absolute;
}

// 인트로 스타트 버튼
.btnStart {
  background: transparent url(@/assets/img/think/btnThink.png) no-repeat 0 0;
  background-size: contain;
  text-indent: -9999em;
  width: 273px;
  height: 53px;
  top: 512px;
  left: 0;
  transition: background 300ms ease-in-out;
  &:hover {
    background: transparent url(@/assets/img/think/btnThinkOn.png) no-repeat 0 0;
    background-size: contain;
  }
}

.questionHead {
  font-family: 'S-CoreDream-5Medium', serif;
  font-size: 28px; //생각해보기 제목 폰트 사이즈
  font-weight: 400;
  letter-spacing: -1px;
  margin-left: 40px;
  margin-bottom: -40px;
  line-height: 1.2em;
  word-break: keep-all;
  color: #332e8e;
  position: absolute;
  top: 100px;
  left: 90px;
  max-width: 800px;
  p {
    position: absolute;
    width: 900px;
    display: table;
    img, span {
      position: relative;
      //float: left;
      display: inline-block;
      height: 90px;
    }
    img {
      width: 30px;
      margin: 0 10px;
    }
    span {
      display: table-cell;
      vertical-align: middle;
      max-width: 800px;
      line-height: 40px;
      top: -5px;
      text-align: left;
      letter-spacing: -2px;
    }
  }
  span.positive {
    color: #ff6699;
    border-bottom: 2px solid;
  }

  span.negative {
    color: #ff6699;
    border-bottom: 2px solid;
  }
}

.area-answer {
  //background: transparent url(@/assets/img/think/bgAnswer.png) no-repeat 0 0;
  //background-size: contain;
  width: 1120px;
  height: 500px;
  bottom: 0;
  position: absolute;
  .answerContent {
    position: absolute;
    top: 100px;
    left: 144px;
    max-width: 844px;
    height: 320px;
    line-height: 1.2em;
    overflow-y: auto;
    word-break: keep-all;
    font-family: 'S-CoreDream-5Medium', sans-serif;
    font-size: 25px; //답변 글씨 크기
    font-weight: 400;
    color: #333;
    &::-webkit-scrollbar {
      width: 10px;
      background-color: rgba(200, 200, 200, 0.75);
    }
    &::-webkit-scrollbar-thumb {
      background-color: #6699ff;
      border-radius: 100px;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(200, 200, 200, 0.75);
      border-radius: 0;
    }
  }
}
</style>
