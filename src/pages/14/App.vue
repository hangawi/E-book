<script lang="ts">
import { defineComponent, ref } from 'vue'

import Page1 from './flow/Page1.vue'
// import Page2 from './flow/Page2.vue'  // 사전테스트 제거
import Page3 from './flow/Page3.vue'
import Page4 from './flow/Page4.vue'
import Page5 from './flow/Page5.vue'
import Page6 from './flow/Page6.vue'
// Page7 제거됨 (video_7 없음)
// Page8 제거됨 (Think 안 씀)
import Page9 from './flow/Page9.vue'
import Page10 from './flow/Page10.vue'
import Page11 from './flow/Page11.vue'

const subjectName = '미래를 밝히는 기술, 스마트에너지 ICT'
const chapterName = '14차시'

const currentPage = ref(window['_currentPage'])
const totalPages = 8  // Page2 제거로 8→7

const isLocal = document.location.hostname === 'localhost'

const handleIndexPrev = () => {
  if (currentPage.value > 1) {
    if (!isLocal) {
      if (currentPage.value - 1 >= 10)
        document.location.href = `${currentPage.value - 1}.html`
      else
        document.location.href = `0${currentPage.value - 1}.html`
    }
    else { currentPage.value-- }
  }
  else {
    // eslint-disable-next-line no-alert
    alert('첫 페이지 입니다.')
  }
}

const handleIndexNext = () => {
  if (currentPage.value < totalPages) {
    if (!isLocal) {
      if (currentPage.value + 1 >= 10)
        document.location.href = `${currentPage.value + 1}.html`
      else
        document.location.href = `0${currentPage.value + 1}.html`
    }
    else {
      currentPage.value++
    }
  }
  else {
    // eslint-disable-next-line no-alert
    alert('마지막 페이지 입니다.')
  }
}

const handleChangeIndex = (target: number) => {
  if (!isLocal) {
    if (target >= 10)
      document.location.href = `${target}.html`
    else
      document.location.href = `0${target}.html`
  }
  else {
    currentPage.value = target
  }
}

export default defineComponent({
  name: 'App',
  components: {
    Page1,
    // Page2,  // 사전테스트 제거
    Page3,
    Page4,
    Page5,
    Page6,
    // Page7, Page8 제거됨
    Page9,
    Page10,
    Page11,
  },
  setup() {
  },
  data() {
    return {
      subjectName,
      chapterName,
      currentPage,
      totalPages,
    }
  },
  methods: {
    prevPage() {
      handleIndexPrev()
    },
    nextPage() {
      handleIndexNext()
    },
    changePage(target: number) {
      handleChangeIndex(target)
    },
  },
})
</script>

<template>
  <v-app id="content-app">
    <!-- <div id="controllerBg" /> -->
    <v-main id="content-main" class="d-flex flex-column align-self-center justify-center">
      <Page1 v-if="currentPage === 1" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <!-- Page2 사전테스트 제거됨 -->
      <Page3 v-if="currentPage === 2" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page4 v-if="currentPage === 3" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page5 v-if="currentPage === 4" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page6 v-if="currentPage === 5" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <!-- Page7, Page8 제거됨 -->
      <Page9 v-if="currentPage === 6" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page10 v-if="currentPage === 7" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page11 v-if="currentPage === 8" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
    </v-main>
  </v-app>
</template>

<style scoped>
#content-main {
  /*width: 1120px;*/
  /*height: 630px;*/
  /*max-width: 1120px;*/
}
#controllerBg {
  position: absolute;
  width: 100%;
  height: 48px;
  bottom: 0;
  background-color: rgba(43, 51, 63, 0.7);
}
</style>
