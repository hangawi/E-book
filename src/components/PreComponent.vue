<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSound } from '@vueuse/sound'
import 'animate.css'

import sfxClick from '@/assets/sound/effect/click.mp3'

const props = defineProps({
  thinkContent: {
    type: Object,
    required: true,
  },
})

const soundClick = useSound(sfxClick)

const thinkSeq = ref(0)

const refThink = ref()

const isFinish = ref(false)

const score = ref([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

// 정답: 1=O, 2=X, 3=x, 4=x, 5=o, 6=x, 7=0, 8=0, 9=x, 10=X
const answers = [1, 2, 2, 2, 1, 2, 1, 1, 2, 2] // 1=O, 2=X

const level = ref('')

const handleStart = () => {
  if (thinkSeq.value > 0)
    return false

  soundClick.play()
  thinkSeq.value++

  // const elButton = document.querySelector('.btnStart') as HTMLElement
  const elAnswer = document.querySelector('.area-answer') as HTMLElement

  // elButton.classList.remove('animate__delay-2s')
  // elButton.classList.add('animate__flipOutX')

  setTimeout(() => {
    elAnswer.classList.remove('hidden')
    elAnswer.classList.add('animate__fadeIn')
  }, 500)
}

const handleCheck = (row, col, e) => {
  // if (isFinish.value)
  //   return false

  soundClick.play()
  const cols = document.querySelectorAll(`.cols-${row} button`)

  cols.forEach((v) => {
    const elButton = v as HTMLButtonElement
    if (elButton.classList.contains('checked'))
      elButton.classList.remove('checked')
  })
  e.target.classList.add('checked')

  // 정답 체크: 사용자 선택(col)과 정답(answers[row - 1])이 같으면 5점, 다르면 0점
  const isCorrect = col === answers[row - 1]
  score.value[row - 1] = isCorrect ? 5 : 0

  let isCompleted = false
  let totalScore = 0

  score.value.forEach((value) => {
    totalScore += value
  })

  const checkedEl = document.querySelectorAll('.checkCols button.checked')
  if (checkedEl.length === 10)
    isCompleted = true

  if (isCompleted) {
    isFinish.value = true

    if (totalScore <= 20)
      level.value = '초급'
    else if (totalScore < 40)
      level.value = '중급'
    else
      level.value = '고급'

    const elSubmit = document.querySelector('#btnSubmit') as HTMLButtonElement

    elSubmit.classList.remove('d-none')
    elSubmit.classList.add('d-flex', 'animate__flipInX')
  }
}

const handleDownload = (level) => {
  let res = ''

  if (level === 1)
    res = '/down/사전진단테스트 피드백 학습자료_초급.pdf'
  else if (level === 2)
    res = '/down/사전진단테스트 피드백 학습자료_중급.pdf'
  else
    res = '/down/사전진단테스트 피드백 학습자료_고급.pdf'

  window.open(res, '_blank')
}

const handleClose = () => {
  thinkSeq.value = 0
  soundClick.play()

  const elAnswer = document.querySelector('.area-answer') as HTMLElement

  setTimeout(() => {
    elAnswer.classList.remove('animate__fadeIn')
    elAnswer.classList.add('animate__fadeOut')
    setTimeout(() => {
      elAnswer.classList.add('hidden')
      elAnswer.classList.remove('animate__fadeOut')
    }, 500)
  }, 500)
}

onMounted(() => {
  const elProgress = document.querySelector('.video-js .vjs-progress-control') as HTMLElement
  const elPlayControl = document.querySelector('.vjs-play-control') as HTMLElement
  elProgress.classList.add('event-none')
  elPlayControl.classList.add('event-none')
})
</script>

<template>
  <v-container
    id="elOverlay"
    ref="refThink"
    class="w-100 pa-0 pre-intro-container animate__animated animate__fadeIn animate__slow"
  >
    <v-row v-for="row in 10" :key="row" class="checkLists">
      <v-col v-for="col in 2" :key="col" class="checkCols" :class="`cols-${row}`">
        <button type="button" :class="(col === 1) ? 'check_o' : 'check_x'" @click="handleCheck(row, col, $event)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <button
          id="btnSubmit"
          class="position-relative ma-auto animate__animated btnStart d-none"
          @click="handleStart"
        >
          Submit
        </button>
      </v-col>
    </v-row>
    <v-row class="ma-0 mt-6 area-answer hidden animate__animated">
      <v-col class="d-flex align-end mr-4">
        <p class="level animate__animated animate__delay-1s animate__rubberBand" v-html="level" />
        <v-row class="download-cols">
          <v-col>
            <button type="button" class="btnDown" @click="handleDownload(1)">
              download
            </button>
          </v-col>
          <v-col>
            <button type="button" class="btnDown" @click="handleDownload(2)">
              download
            </button>
          </v-col>
          <v-col>
            <button type="button" class="btnDown" @click="handleDownload(3)">
              download
            </button>
          </v-col>
        </v-row>
        <button type="button" class="btnClose" @click="handleClose">
          close
        </button>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
// 인트로 화면
.pre-intro-container {
  background: transparent url(@/assets/img/pre/bgPre.png) no-repeat 0 0;
  background-size: cover;
  width: 100%;
  height: 100%;
  max-width: 1120px;
  position: absolute;
}

// 인트로 스타트 버튼
.btnStart {
  background: transparent url(@/assets/img/pre/btnSubmit.png) no-repeat 0 0;
  background-size: contain;
  text-indent: -9999em;
  width: 194px;
  height: 120px;
  top: 142px;
  transition: background 300ms ease-in-out;
  &:hover {
    background: transparent url(@/assets/img/pre/btnSubmitOn.png) no-repeat 0 0;
    background-size: contain;
  }
}

.checkLists {
  position: relative;
  left: 905px; //위치
  top: 142px;
  .checkCols {
    position: relative;
    width: 20px; 
    height: 20px;
    margin-bottom:14px;
    max-width: 53px; //버튼 간 간격
    button {
      //background: transparent url(@/assets/img/pre/btnCheck.png) no-repeat 0 0;
      display: inline-block;
      width: 20px;
      height: 20px;
      &.check_o {
        background: transparent url(@/assets/img/pre/btnCheckO.png) no-repeat 0 0;
        background-size: contain;
        &:hover, &.checked {
          background: transparent url(@/assets/img/pre/btnCheckOOn.png) no-repeat 0 0;
          background-size: contain;
        }
      }
      &.check_x {
        background: transparent url(@/assets/img/pre/btnCheckX.png) no-repeat 0 0;
        background-size: contain;
        &:hover, &.checked {
          background: transparent url(@/assets/img/pre/btnCheckXOn.png) no-repeat 0 0;
          background-size: contain;
        }
      }
      //&:hover, &.checked {
      //  background: transparent url(@/assets/img/pre/btnCheckOn.png) no-repeat 0 0;
      //}
    }
  }
}

.questionHead {
  font-family: 'Paperlogy-5Medium', serif;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -1px;
  margin-left: 40px;
  margin-bottom: -40px;
  line-height: 1.2em;
  word-break: keep-all;
  color: #006699;
  position: absolute;
  top: 100px;
  left: 260px;
  max-width: 800px;
  p {
    position: absolute;
    width: 900px;
    img, span {
      position: relative;
      float: left;
      display: inline-block;
      height: 90px;
    }
    img {
      width: 30px;
      margin: 0 10px;
    }
    span {
      max-width: 800px;
      line-height: 45px;
      padding-top: 4px;
      text-align: center;
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
  background: transparent url(@/assets/img/pre/bgResult.png) no-repeat 0 0;
  background-size: contain;
  width: 1120px;
  height: 630px;
  bottom: 0;
  position: absolute;
  p.level {
    font-family: 'Paperlogy-8ExtraBold', serif;
    font-weight: 400;
    font-size: 42px;
    color: #0e7300;
    position: absolute;
    top: 163px;
    left: 643px;
    letter-spacing: -2px;
  }
  .download-cols {
    position: absolute;
    top: 392px;
    left: 205px;
    button.btnDown {
      background: transparent url(@/assets/img/pre/btnDownload.png) no-repeat 0 0;
      background-size: contain;
      width: 184px;
      height: 42px;
      margin-right: 60px;
      text-indent: -9999em;
      &:hover {
        background: transparent url(@/assets/img/pre/btnDownloadOn.png) no-repeat 0 0;
        background-size: contain;
      }
    }
  }
  .btnClose {
    background: transparent url(@/assets/img/pre/btnClose.png) no-repeat 0 0;
    background-size: contain;
    width: 44px;
    height: 44px;
    text-indent: -9999em;
    position: absolute;
    left: 930px;
    top: 132px;
    transition: transform .3s ease-in-out;
    &:hover {
      background: transparent url(@/assets/img/pre/btnCloseOn.png) no-repeat 0 0;
      background-size: contain;
      transform: rotate(180deg);
    }
  }
}
</style>
