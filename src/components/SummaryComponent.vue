<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSound } from '@vueuse/sound'
import 'animate.css'

import sfxClick from '@/assets/sound/effect/click.mp3'

const props = defineProps({
  summaryLists: {
    type: Object,
    required: true,
  },
})

const soundClick = useSound(sfxClick)

const summarySeq = ref(0)

onMounted(() => {
  const videoContent = document.querySelector('#videoPlayer') as HTMLElement
  setTimeout(() => {
    videoContent.style.visibility = 'hidden'
  }, 5000)
})
</script>

<template>
  <v-container
    id="elOverlay"
    ref="refSummary"
    class="w-100 pa-0 summary-intro-container animate__animated animate__fadeIn animate__slow"
  >
    <v-row
      :key="summarySeq"
      class="summary-area animate__animated animate__fadeIn"
    >
      <v-col class="pa-0 ma-0 summary-content">
        <div class="context w-100">
          <ul>
            <li
              v-for="(context, subIndex) in summaryLists[summarySeq].context"
              :key="subIndex"
              class="animate__animated animate__fadeIn"
              :class="`animate__delay-${2 + subIndex}s`"
              v-html="context"
            />
          </ul>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
.summary-intro-container {
  background: transparent url(@/assets/img/summary/bgSummary.png) no-repeat 0 0;
  background-size: contain;
  width: 100%;
  height: 100%;
  max-width: 1120px;
  position: absolute;

  opacity: 0; // 초기 상태
  animation: fadeInBg 0.5s forwards; // 1초 동안 fade-in
  animation-delay: 4s; // 0.5초 후 등장
}

@keyframes fadeInBg {
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
// 학습정리
.summary-area {
  max-width: 880px;
  max-height: 180px;  // 스크롤 영역 높이 제한
  width: 900px;
  height: auto;
  position: relative;
  margin-left: 124px;
  margin-top: 300px;
  font-family: 'Paperlogy-5Medium', sans-serif;
  font-size: 30px;
  letter-spacing: -1px;
  line-height: 1.3em;
  color: #000;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 10px;
    background-color: #ffffff;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #808080;
    border-radius: 100px;
  }
  &::-webkit-scrollbar-track {
    background-color: #ffffff;
    border-radius: 0;
  }
  &::-webkit-scrollbar-button {
    display: block;
    height: 16px;
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
  }
  &::-webkit-scrollbar-button:vertical:start:decrement {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23808080' d='M6 4l-4 4h8z'/%3E%3C/svg%3E");
  }
  &::-webkit-scrollbar-button:vertical:end:increment {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23808080' d='M6 8l4-4H2z'/%3E%3C/svg%3E");
  }
  .summary-content {
    margin: 20px !important;
  }
  .context {
    margin-left: 10px;
    max-width: 850px;
    font-size: 30px;
    ul {
      li {
        font-size: 26px;
        vertical-align: middle;
        line-height: 29px;
        word-break: keep-all;
        list-style-type: none;
        //text-indent: -20px;
        display: flex;
        align-items: center;
        margin: 20px 0;
        &::before {
          content: "";
          width: 12px;
          height: 12px;
          margin-right: 10px;
          margin-top: -4px;
          background: transparent url(@/assets/img/summary/bullet.png) no-repeat 0 0;
          background-size: contain;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
