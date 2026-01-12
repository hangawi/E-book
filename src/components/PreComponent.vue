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
  score.value[row - 1] = (col === 1) ? 5 : 0

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
    res = '../down/[초급]Windows System Programming.pdf'
  else if (level === 2)
    res = '../down/[중급]Windows System Programming.pdf'
  else
    res = '../down/[고급]Windows System Programming.pdf'

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
  width: 144px;
  height: 40px;
  top: 134px;
  transition: background 300ms ease-in-out;
  &:hover {
    background: transparent url(@/assets/img/pre/btnSubmitOn.png) no-repeat 0 0;
    background-size: contain;
  }
}

.checkLists {
  position: relative;
  left: 926px;
  top: 132px;
  .checkCols {
    position: relative;
    width: 30px;
    height: 30px;
    margin-bottom: 9px;
    max-width: 63px;
    button {
      //background: transparent url(@/assets/img/pre/btnCheck.png) no-repeat 0 0;
      display: inline-block;
      width: 30px;
      height: 30px;
      &.check_o {
        background: transparent url(@/assets/img/pre/btnCheckO.png) no-repeat 0 0;
        &:hover, &.checked {
          background: transparent url(@/assets/img/pre/btnCheckOOn.png) no-repeat 0 0;
        }
      }
      &.check_x {
        background: transparent url(@/assets/img/pre/btnCheckX.png) no-repeat 0 0;
        &:hover, &.checked {
          background: transparent url(@/assets/img/pre/btnCheckXOn.png) no-repeat 0 0;
        }
      }
      //&:hover, &.checked {
      //  background: transparent url(@/assets/img/pre/btnCheckOn.png) no-repeat 0 0;
      //}
    }
  }
}

.questionHead {
  font-family: 'S-CoreDream-5Medium', serif;
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
    font-family: 'S-CoreDream-5Medium', serif;
    font-weight: 400;
    font-size: 50px;
    color: #6c49ca;
    position: absolute;
    top: 125px;
    left: 655px;
    letter-spacing: -2px;
  }
  .download-cols {
    position: absolute;
    top: 444px;
    left: 172px;
    button.btnDown {
      background: transparent url(@/assets/img/pre/btnDownload.png) no-repeat 0 0;
      background-size: contain;
      width: 184px;
      height: 30px;
      margin-right: 90px;
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
    left: 975px;
    top: 105px;
    transition: transform .3s ease-in-out;
    &:hover {
      background: transparent url(@/assets/img/pre/btnCloseOn.png) no-repeat 0 0;
      background-size: contain;
      transform: rotate(180deg);
    }
  }
}
</style>
