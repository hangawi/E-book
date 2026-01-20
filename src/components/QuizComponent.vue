<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSound } from '@vueuse/sound'
import 'animate.css'

import videojs from 'video.js'
import sfxClick from '@/assets/sound/effect/click.mp3'
import sfxCorrect from '@/assets/sound/effect/correct.mp3'
import sfxWrong from '@/assets/sound/effect/wrong.mp3'

import imgMarkCorrect from '@/assets/img/quiz/markCorrect.png'
import imgMarkWrong from '@/assets/img/quiz/markWrong.png'

import imgResultCorrect from '@/assets/img/quiz/resultCorrect.png'
import imgResultWrong from '@/assets/img/quiz/resultWrong.png'

import imgAlertRetry from '@/assets/img/quiz/alertRetry.png'
import imgAlertWrong from '@/assets/img/quiz/alertWrong.png'
import imgAlertCorrect from '@/assets/img/quiz/alertCorrect.png'

const props = defineProps({
  courseInfo: {
    type: Object,
    required: true,
  },
  questionLists: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['handleNext'])

const soundClick = useSound(sfxClick)
const soundCorrect = useSound(sfxCorrect)
const soundWrong = useSound(sfxWrong)

const gameSeq = ref(0)
const quizSeq = ref(0)
const quizCompleted = ref(false)
const showResult = ref(false)
const alert = ref(false)

const isReady = ref(false)

const refQuiz = ref()

const questionLists = props.questionLists

const userAnswer = ref([null, null])
const correctCount = ref(0)
const feedbackAlert = ref('')
let challengeCount = 0

const itostr = (arg: number) => arg.toString().padStart(2, '0')

const chapterTitle = computed(() =>
    `${itostr(props.courseInfo.chapterNumber)}. ${props.courseInfo.chapterTitle}`,
)

const showCountdown = ref(false)
const countdown = ref(3)
let countdownTimer: number | null = null

const TOTAL_TIME = 20

const timeLeft = ref(TOTAL_TIME)
const progress = ref(TOTAL_TIME)

let timer: number | null = null

const handleReady = () => {
  isReady.value = false
  setTimeout(() => {
    isReady.value = true
  }, 2500)
}

const handleStart = () => {
  soundClick.play()
  if (gameSeq.value < 1) {
    gameSeq.value++
    const player = videojs('videoPlayer')
    player.currentTime(19)
  }
  handleReady()
}

const handleDisableExamLists = () => {
  const elExamLists = document.querySelectorAll('.exam-lists')
  elExamLists.forEach((list) => {
    const _list = list as HTMLLIElement
    _list.style.pointerEvents = 'none'
  })
}

const handleTimeOver = () => {
  if (quizCompleted.value)
    return

  quizCompleted.value = true
  feedbackAlert.value = 'wrong'
  alert.value = true
  handleDisableExamLists()

  // ✅ 2초 후 자동으로 alert 닫기
  setTimeout(() => {
    alert.value = false
  }, 2000)
}

const stopTimer = () => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

const startTimer = () => {
  stopTimer() // 중복 방지

  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      progress.value = timeLeft.value
    }
    else {
      stopTimer()
      // ⛔ 시간 초과 처리
      handleTimeOver()
    }
  }, 1000)
}

const resetTimer = () => {
  timeLeft.value = TOTAL_TIME
  progress.value = TOTAL_TIME
}

const startCountdown = () => {
  showCountdown.value = true
  countdown.value = 3

  countdownTimer = window.setInterval(() => {
    if (countdown.value > 1) {
      countdown.value--
    }
    else if (countdown.value === 1) {
      countdown.value = 0 // GO!
    }
    else {
      // GO! 종료
      clearInterval(countdownTimer!)
      countdownTimer = null

      showCountdown.value = false

      // ✅ 여기서 타이머 시작
      resetTimer()
      startTimer()
    }
  }, 1000)
}

const handleClickExam = (event, index) => {
  if (challengeCount > 1 || !isReady.value)
    return false

  alert.value = true

  const elCurrent = event.target as HTMLLIElement
  elCurrent.classList.add('selected')

  userAnswer.value[quizSeq.value] = index

  if (questionLists[quizSeq.value].correct === (index + 1)) {
    soundCorrect.play()
    feedbackAlert.value = 'correct'
    challengeCount = 0
    quizCompleted.value = true
    elCurrent.classList.add('correct')

    // ✅ 정답 → 타이머 멈춤
    stopTimer()
  }
  else {
    soundWrong.play()
    if (challengeCount === 0)
      feedbackAlert.value = 'retry'
    else
      feedbackAlert.value = 'wrong'
    challengeCount++
    if (challengeCount === 2) {
      const elAnswerNumber = document.querySelector(`#exam_number_${questionLists[quizSeq.value].correct - 1}`) as HTMLLIElement
      elAnswerNumber.classList.add('correct')
      quizCompleted.value = true

      // ✅ 오답 종료 → 타이머 멈춤
      stopTimer()
    }
  }

  setTimeout(() => {
    if (alert.value) {
      alert.value = false
      // if (challengeCount === 1)
      //   elCurrent.classList.remove('selected')
      // else
      //   handleDisableExamLists()
      if (challengeCount !== 1)
        handleDisableExamLists()
    }
  }, 2000)
}

const handleResult = () => {
  correctCount.value = 0
  userAnswer.value.forEach((answer, index) => {
    if (answer !== null && (answer + 1) === questionLists[index].correct)
      correctCount.value++
  })

  showResult.value = true
  soundClick.play()
}

const handleRetry = () => {
  showResult.value = false
  challengeCount = 0
  quizSeq.value = 0
  quizCompleted.value = false
  soundClick.play()

  stopTimer()
  startCountdown()

  handleReady()
}

const handleNext = () => {
  challengeCount = 0
  quizCompleted.value = false
  quizSeq.value++
  soundClick.play()

  stopTimer()
  startCountdown()

  handleReady()
}

const questionTitle = computed(() => {
  const order = quizSeq.value + 1

  const orderText
      = order === 1
        ? '첫 번째'
        : order === 2
          ? '두 번째'
          : order === 3
            ? '세 번째'
            : `${order}번째`

  return `${orderText} 문제`
})

const isCorrectAnswer = (index: number): boolean => {
  const answer = userAnswer.value[index]
  return answer !== null && answer + 1 === questionLists[index].correct
}

watch(gameSeq, (value) => {
  if (value === 1) {
    stopTimer()          // 혹시 모를 타이머 정리
    startCountdown()     // ⬅️ 여기!
  }
  else {
    stopTimer()
  }
})

onMounted(() => {
  // const elVideo = document.querySelector('.is-audio') as HTMLDivElement
  const elProgress = document.querySelector('.video-js .vjs-progress-control') as HTMLElement
  const elPlayControl = document.querySelector('.vjs-play-control') as HTMLElement
  elProgress.classList.add('event-none')
  elPlayControl.classList.add('event-none')

  // setTimeout(() => {
  //   handleStart()
  // }, 15000000)
})
</script>

<template>
  <v-container
    v-if="gameSeq === 0"
    id="elOverlay"
    ref="refQuiz"
    class="w-100 pa-0 quiz-intro-container animate__animated animate__fadeIn animate__slow"
  >
    <v-row class="ma-0 mt-6 area-chapter">
      <v-col>
<!--        <p>{{ chapterTitle }}</p>-->
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <button
          class="d-flex position-relative ma-auto animate__animated animate__delay-1s animate__flipInX btnStart"
          style="margin-top: -260px;"
          @click="handleStart"
        >
          START
        </button>
      </v-col>
    </v-row>
  </v-container>

  <v-container
    v-if="gameSeq === 1"
    id="elOverlay"
    :key="quizSeq"
    :class="quizSeq === 0 ? `w-100 pa-0 quiz-main-container animate__animated animate__fadeIn animate__slow` : `w-100 pa-0 quiz-main-container animate__animated animate__fadeIn`"
  >
    <v-row class="ma-0 mt-6 area-chapter">
      <v-col>
<!--        <p>{{ chapterTitle }}</p>-->
      </v-col>
    </v-row>

    <v-row class="ma-0 mt-1 area-progress">
      <v-col class="pa-0">
        <div class="question-number-wrapper">
          <img :src="questionLists[quizSeq].qNum" :alt="`question_${quizSeq}`" class="animate__animated animate__flipInY animate__delay-4_0s questionNumber">
          <img
            v-if="quizCompleted && feedbackAlert === 'correct'"
            :src="imgMarkCorrect"
            alt="correct"
            class="animate__animated animate__bounceIn animate__delay-2s mark-ox"
          >
          <img
            v-if="quizCompleted && feedbackAlert === 'wrong'"
            :src="imgMarkWrong"
            alt="wrong"
            class="animate__animated animate__bounceIn animate__delay-2s mark-ox"
          >
        </div>
        <div class="timer-section">
          <div class="timer-left">
            <p class="title">
              시간 내에 문제를 풀어보세요.
            </p>
            <v-sheet
              class="d-flex align-center px-0 py-0"
              color="transparent"
            >
              <v-progress-linear
                bg-color="#e9e9e9"
                bg-opacity="100"
                color="#6ab554"
                height="12"
                :max="TOTAL_TIME"
                :model-value="progress"
              />
            </v-sheet>
          </div>
          <p class="timer" :class="`timer-${timeLeft}`">
            {{ timeLeft }}
          </p>
        </div>
      </v-col>
    </v-row>

    <v-row class="ma-0 area-question">
      <v-col class="pa-0">
        <div class="questionHead animate__animated animate__flipInX animate__delay-4_0s">
          <p v-html="questionLists[quizSeq].question" />
        </div>
      </v-col>
    </v-row>
    <v-row
      v-if="questionLists[quizSeq].sentence"
      class="mt-8 area-sentence animate__animated animate__flipInX animate__delay-5_0s"
    >
      <v-col class="pa-0">
        <div>
          <p v-html="questionLists[quizSeq].sentence" />
        </div>
      </v-col>
    </v-row>
    <v-row
      class="ma-0 area-exam"
      :class="[questionLists[quizSeq].tall ? 'mt-16' : (questionLists[quizSeq].sentence ? 'mt-0' : 'mt-0')]">
      <v-col>
        <ul id="exam-list">
          <li
            v-for="(exam, index) in questionLists[quizSeq].examLists"
            :id="`exam_number_${index}`"
            :key="index"
            :class="`exam-lists animate__animated animate__fadeIn animate__delay-5_${index * 2}s`"
            @click="handleClickExam($event, index)"
          >
            <div
              v-if="questionLists[quizSeq].correct === (index) && quizCompleted"
              class="d-inline-block exam-answer animate__animated animate__lightSpeedInLeft animate__delay-5_0s"
            />
            <div class="d-inline-block exam-number rounded-circle" v-html="(index + 1)" />
            <div class="d-inline-block exam-text" v-html="exam" />
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row
      v-if="quizCompleted"
      class="ma-0 position-absolute area-explain animate__animated animate__flipInX animate__delay-2s"
    >
      <v-col class="animate__">
        <button v-if="quizSeq < 2" class="btn-next animate__animated animate__swing animate__delay-3s animate__repeat-2" @click="handleNext">
          next
        </button>
        <button v-if="quizSeq === 2" class="btn-result animate__animated animate__swing animate__delay-3s animate__repeat-2" @click="handleResult">
          result
        </button>
        <div class="correctNumber animate__animated animate__delay-3s animate__fadeIn" v-html="questionLists[quizSeq].correct" />
        <div class="text" v-html="questionLists[quizSeq].explain" />
      </v-col>
    </v-row>
    <v-overlay
      v-model="alert"
      no-click-animation
      persistent
      scrim="#000"
      class="align-center justify-center alert-overlay"
    >
      <v-card v-if="feedbackAlert === 'retry'" class="bg-transparent animate__animated animate__jello">
        <img class="imgAlert" :src="imgAlertRetry" alt="retry">
      </v-card>
      <v-card v-if="feedbackAlert === 'wrong'" class="bg-transparent animate__animated animate__shakeX">
        <img class="imgAlert" :src="imgAlertWrong" alt="wrong">
      </v-card>
      <v-card v-if="feedbackAlert === 'correct'" class="bg-transparent animate__animated animate__rubberBand">
        <img class="imgAlert" :src="imgAlertCorrect" alt="correct">
      </v-card>
    </v-overlay>

    <v-overlay
      v-model="showCountdown"
      contained
      persistent
      scrim="transparent"
      class="countdown-overlay"
    >
      <div class="countdown-wrap">
        <p class="countdown-title">
          {{ questionTitle }}
        </p>

        <p class="countdown-number">
          <span v-if="countdown > 0">{{ countdown }}</span>
          <span v-else>GO!</span>
        </p>
      </div>
    </v-overlay>

    <v-overlay
      v-model="showResult"
      no-click-animation
      contained
      persistent
      scrim="#000"
      class="align-center justify-center alert-overlay"
    >
      <v-card class="bg-transparent animate__animated animate__flipInX area-result">
        <v-row class="result-mark">
          <v-col>
            <img
              :src="isCorrectAnswer(0) ? imgResultCorrect : imgResultWrong"
              alt="correct"
              class="animate__animated animate__bounceIn animate__delay-1s result-ox q-1"
            >
          </v-col>
          <v-col>
            <img
              :src="isCorrectAnswer(1) ? imgResultCorrect : imgResultWrong"
              alt="wrong"
              class="animate__animated animate__bounceIn animate__delay-1s result-ox q-2"
            >
          </v-col>
          <v-col>
            <img
              :src="isCorrectAnswer(2) ? imgResultCorrect : imgResultWrong"
              alt="wrong"
              class="animate__animated animate__bounceIn animate__delay-1s result-ox q-3"
            >
          </v-col>
        </v-row>
        <v-row class="result-count">
          <v-col>
            <p class="d-inline-block total-count">{{ 3 }}<span class="count-text">문항</span></p>
            <p class="d-inline-block animate__animated animate__flipInX animate__delay-1s correct-count">{{ correctCount }}<span class="count-text">문항</span></p>
          </v-col>
        </v-row>
        <v-row class="result-retry">
          <v-col class="d-flex justify-center animate__animated animate__flipInX animate__delay-2s" style="margin-top: 190px;">
            <button class="btn-retry animate__animated animate__swing animate__repeat-2 animate__delay-3s" @click="handleRetry">
              restart
            </button>
          </v-col>
        </v-row>
      </v-card>
    </v-overlay>
  </v-container>
</template>

<style lang="scss" scoped>
// 인트로 화면
.quiz-intro-container {
  background: transparent url(@/assets/img/quiz/bgQuizIntro.png) no-repeat 0 0;
  background-size: contain;
  width: 100%;
  height: 100%;
  max-width: 1120px;
  position: absolute;
}

// 인트로 스타트 버튼
.btnStart {
  background: transparent url(@/assets/img/quiz/btnStart.png) no-repeat 0 0;
  background-size: contain;
  text-indent: -9999em;
  width: 212px;
  height: 58px;
  top: 345px;
  left: 0;
  transition: background 300ms ease-in-out;
  &:hover {
    background: transparent url(@/assets/img/quiz/btnStartOn.png) no-repeat 0 0;
    background-size: contain;
  }
}

// 메인화면
.quiz-main-container {
  background: transparent url(@/assets/img/quiz/bgQuizMain.png) no-repeat 0 0;
  background-size: contain;
  width: 100%;
  height: 100%;
  max-width: 1120px;
  position: absolute;
}

// 차시명 영역
.area-chapter {
  p {
    font-family: 'Paperlogy-5Medium', sans-serif;
    font-size: 25px;
    font-weight: 600;
    letter-spacing: -1px;
    margin-left: 124px;
    margin-top: -10px;
    line-height: 1.2em;
    word-break: keep-all;
    color: #fff;
    text-shadow: 2px 2px 2px #302495;
  }
}

// 프로그레스 영역 (타이머바 + 문제번호 한 줄)
.area-progress {
  position: absolute;
  left: 65px;
  top: 105px;
  width: calc(100% - 240px);
  display: flex;
  align-items: flex-start;

  .v-col {
    display: flex;
    align-items: flex-start;
    gap: 30px;
    width: 100%;
  }

  .timer-section {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 20px;
  }

  .timer-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .question-number-wrapper {
    position: relative;
    width: 80px;
    height: auto;
    flex-shrink: 0;
  }

  p.title {
    font-family: 'Paperlogy-5Medium', sans-serif;
    font-size: 23px;
    color: #0e7300;
    font-weight: 500;
    margin: 0;
  }

  p.timer {
    font-family: 'Paperlogy-7Bold', sans-serif;
    font-size: 22px;
    color: #6ab554;
    font-weight: 600;
    border-radius: 50%;
    letter-spacing: 0;
    width: 50px;
    height: 50px;
    border: 6px solid #6ab554;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    margin-left: auto;
    margin-right: -80px;
    padding: 0;
    padding-top: 1px;
    padding-right: 0.5px;

    &.timer-1 {
      padding-right: 0.5px;
      padding-left: 0;
    }

    &.timer-2 {
      padding-left: 1px;
      padding-right: 0;
    }

    &.timer-3 {
      padding-left: 0.5px;
      padding-right: 0;
    }

    &.timer-4 {
      padding-right: 0.5px;
      padding-left: 0;
    }
  }

  // 진행바 radius
  :deep(.v-progress-linear) {
    border-radius: 10px;
    overflow: hidden;

    .v-progress-linear__determinate {
      border-radius: 10px;
    }
  }
}

// 발문 영역
.area-question {
  position: absolute;
  left: -20px;
  top: 180px;
  width: 100%;
}

.questionNumber {
  width: 50px !important;
  height: auto;
  margin-top: 5px;
  margin-left: 18px;
}

.questionHead {
  font-family: 'Paperlogy-7Bold', serif;
  font-size: 32px;
  font-weight: 500;
  letter-spacing: -1px;
  margin-left: 120px;
  margin-top: 0;
  line-height: 1.2em;
  word-break: keep-all;
  color: #0e7300;
  span.positive {
    color: #ff6699;
    border-bottom: 2px solid;
  }

  span.negative {
    color: #ff6699;
    border-bottom: 2px solid;
  }
}

// 지문 영역
.area-sentence {
  position: absolute;
  top: 320px;
  left: 120px;
  width: 880px;
  padding: 12px 18px;
  font-family: 'Paperlogy-5Medium', serif;
  font-size: 26px;
  line-height: 1.5em;
  color: #1e9e8a;
  background-color: transparent;
  backdrop-filter: blur(10px);
  border-radius: 0;
  border: 8px solid rgba(40, 40, 40, 0.25);
  word-break: keep-all;
}

// 보기 영역
ul#exam-list {
  position: absolute;
  left: 100px;
  top: 230px;
}

.exam-lists {
  list-style: none;
  width: fit-content;
  height: 50px;
  line-height: 44px;
  div {
    font-family: 'Paperlogy-4Regular', serif;
    font-size: 28px;
    font-weight: 200;
    color: #333;
    pointer-events: none;
    &.exam-answer {
      position: absolute;
      width: 100px;
      height: 70px;
      left: 100px;
      margin-top: -12px;
    }
    &.exam-number {
      background-color: #fff;
      width: 33px;
      height: 33px;
      line-height: 1;
      font-size: 24px;
      padding: 0;
      padding-top: 2px;
      padding-right: 0.5px;
      color: #000;
      border: 2px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      transition: background 200ms ease-in-out;
    }
    &.exam-text {
      font-size: 26px;
      text-indent: 14px;
      font-family: 'Paperlogy-4Regular', serif;
    }
  }
}

// 숫자별 개별 padding 조정
.exam-lists:nth-child(1) .exam-number {
  padding-top: 3px;
  padding-right: 0.5px;
}

.exam-lists:nth-child(2) .exam-number {
  padding-top: 2px;
  padding-left: 1px;
}

.exam-lists:nth-child(3) .exam-number {
  padding-top: 3px;
  padding-left: 0.5px;
}

.exam-lists:nth-child(4) .exam-number {
  padding-top: 2px;
  padding-right: 0.5px;
}

.exam-lists.selected {
  cursor: none;
  user-select: none;
  pointer-events: none;

  div {
    &.exam-number {
      background-color: #999;
      border-color: #999;
    }
    &.exam-text {
      color: #999;
    }
  }
}

.exam-lists:hover, .exam-lists.correct {
  cursor: pointer;
  div {
    &.exam-number {
      background-color: #0e7300;
      color: #fff;
      border: 2px solid #0e7300;
    }
    &.exam-text {
      color: #0e7300;
    }
  }
}

.area-explain {
  background: transparent url(@/assets/img/quiz/bgQuizExplain.png) no-repeat center;
  background-size: 100% auto;
  width: 770px;
  height: auto;
  min-height: 147px;
  left: 85px;
  position: relative;
  bottom: 70px;
  .correctNumber {
    font-family: 'Paperlogy-7Bold', serif;
    font-size: 45px;
    font-weight: 700;
    color: #0e7300;
    margin-left: 15px;
    margin-top: 50px;
  }
  .text {
    font-family: 'Paperlogy-4Regular', serif;
    position: absolute;
    font-size: 22px;
    letter-spacing: -1px;
    line-height: 1.3em;
    color: #000;
    bottom: 50px;
    margin-top: 28px;
    margin-left: 85px;
    word-break: keep-all;
    max-height: 70px;
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.4) transparent;

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.4);
      border-radius: 8px;
    }
  }
  button {
    position: absolute;
    width: 175px;
    height: 74px;
    left: 785px;
    top: 24px;
    text-indent: -9999em;
    transition: background 300ms ease-in-out;
    &.btn-next {
      background: transparent url(@/assets/img/quiz/btnNext.png) no-repeat 0 0;
      background-size: contain;
      &:hover {
        background: transparent url(@/assets/img/quiz/btnNextOn.png) no-repeat 0 0;
        background-size: contain;
      }
    }
    &.btn-result {
      background: transparent url(@/assets/img/quiz/btnResult.png) no-repeat 0 0;
      background-size: contain;
      &:hover {
        background: transparent url(@/assets/img/quiz/btnResultOn.png) no-repeat 0 0;
        background-size: contain;
      }
    }
  }
}

// 피드백 앨럿창
.imgAlert {
  width: 500px;              // 너비 (숫자를 줄이면 작아짐)  height: auto;
  touch-action: none;
  pointer-events: none;
  -webkit-user-drag: none;
}

// mark
.mark-ox {
  position: absolute;
  width: 50px;
  height: 50px;
  left: 20px;
  top: -4px;
}

// 결과화면
.area-result {
  background: transparent url(@/assets/img/quiz/bgResult.png) no-repeat 0 0;
  background-size: contain;
  width: 1120px;
  height: 630px;
}

.result-mark {
  margin-top: 330px;
  .result-ox {
    width: 97px;
    height: 97px;
    position: relative;
  }
  .result-ox.q-1 {
    left: 290px;
  }
  .result-ox.q-2 {
    left: 131px;
  }
  .result-ox.q-3 {
    left: -27px;
  }
}

.result-count {
  margin-top: -244px;
  font-family: 'Paperlogy-5Medium', serif;
  font-size: 27px;
  font-weight: 900;
  .total-count {
    margin-left: 409px;
    color: #182093;
  }
  .correct-count {
    position: absolute;
    color: #ff3e6b;
    font-size: 27px;
    margin-left: 28px;
  }
  .count-text {
    font-size: 27px;
    margin-left: 0;
  }
}

.btn-retry {
  background: transparent url(@/assets/img/quiz/btnRetry.png) no-repeat 0 0;
  background-size: contain;
  text-indent: -9999em;
  width: 350px;
  height: 50px;
  margin-top: 12px;
  margin-left: 130px;
  transition: background 300ms ease-in-out;
  &:hover {
    background: transparent url(@/assets/img/quiz/btnRetryOn.png) no-repeat 0 0;
    background-size: contain;
  }
}

.alert-overlay {
  z-index: 99999 !important;
}

.alert-overlay :deep(.v-overlay__scrim) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 99998 !important;
}

.alert-overlay :deep(.v-overlay__content) {
  z-index: 99999 !important;
}

.countdown-overlay {
  z-index: 9999;
}

.countdown-wrap {
  width: 1120px;
  height: 630px;
  background: transparent url(@/assets/img/quiz/bgQuizCountDown.png) no-repeat 0 0;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.countdown-title {
  font-family: 'Paperlogy-5Medium', sans-serif;
  font-size: 68px;
  font-weight: 600;
  letter-spacing: -4px;
  color: #0e7300;
  margin-top: -10px;
  margin-right : 3px;
  margin-bottom: 44px;
}

.countdown-number {
  font-family: 'Paperlogy-7ExtraBold', sans-serif;
  font-size: 140px;
  font-weight: 700;
  color: #0e7300;
  -webkit-text-stroke: 2px #0e7300;
  text-shadow: 2px 2px 0 #0e7300;
  animation: pulse 1s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}
</style>
