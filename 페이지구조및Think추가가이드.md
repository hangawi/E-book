# 스마트에너지 ICT 프로젝트 - 페이지 구조 및 Think 페이지 추가 완전 가이드

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [아웃트로 재생 문제 해결](#아웃트로-재생-문제-해결)
3. [페이지 구조 표준화](#페이지-구조-표준화)
4. [차시별 페이지 구조](#차시별-페이지-구조)
5. [Think 페이지 추가 방법](#think-페이지-추가-방법)
6. [트러블슈팅](#트러블슈팅)
7. [체크리스트](#체크리스트)

---

## 프로젝트 개요

### 차시 구성
- **1차시**: 사전테스트 포함 (Page2), 12페이지
- **2-19차시**: 사전테스트 없음, 9-10페이지
  - **2컨텐츠 차시** (02, 03, 05, 08-19): 9페이지
  - **3컨텐츠 차시** (04, 06, 07): 10페이지

### 페이지 유형
1. **인트로** (Intro) - 차시 시작
2. **학습목표** (Goal) - 학습 목표 제시
3. **주요키워드** (Keyword) - 핵심 키워드
4. **본문1-3** (Content) - 학습 내용
5. **생각해보기** (Think) - 사고력 확장 ✨ 추가됨
6. **퀴즈** (Quiz) - 학습 평가
7. **정리하기** (Summary) - 내용 요약
8. **아웃트로** (Outro) - 차시 종료

---

## 아웃트로 재생 문제 해결

### 🔴 문제 원인
**JSON 파일의 `pageInfo` 배열에 "생각해보기" 항목이 누락되어 있었습니다.**

#### 증상
- 1차시: 아웃트로 정상 재생 ✅
- 2-19차시: 아웃트로 재생 안됨 ❌

#### 원인 분석
```json
// ❌ 문제 상황 (02-19차시)
"pageInfo": [
  { "seq": "1", "title": "인트로" },
  { "seq": "2", "title": "학습목표" },
  { "seq": "3", "title": "주요 키워드" },
  { "seq": "4", "title": "본문1" },
  { "seq": "5", "title": "본문2" },
  { "seq": "6", "title": "퀴즈" },        // ⚠️ 생각해보기 누락!
  { "seq": "7", "title": "정리하기" },
  { "seq": "8", "title": "아웃트로" }
]
// pageInfo: 8개 항목, 실제 페이지: 9개 → 불일치로 네비게이션 오류

// ✅ 해결 후
"pageInfo": [
  { "seq": "1", "title": "인트로" },
  { "seq": "2", "title": "학습목표" },
  { "seq": "3", "title": "주요 키워드" },
  { "seq": "4", "title": "본문1" },
  { "seq": "5", "title": "본문2" },
  { "seq": "6", "title": "생각해보기" },  // ✨ 추가됨!
  { "seq": "7", "title": "퀴즈" },
  { "seq": "8", "title": "정리하기" },
  { "seq": "9", "title": "아웃트로" }
]
// pageInfo: 9개 항목, 실제 페이지: 9개 → 일치! ✅
```

### 해결 방법
모든 차시(02-19)의 JSON 파일에 "생각해보기" 항목을 추가하여 `pageInfo` 배열 개수와 실제 페이지 수를 일치시켰습니다.

---

## 페이지 구조 표준화

### 🎯 표준화 목표
**모든 차시의 페이지 파일명을 순차적으로 정리**

#### 변경 전 (문제 상황)
```
src/pages/02/flow/
├── Page1.vue     (인트로)
├── Page3.vue     (학습목표) ⚠️ Page2 건너뜀!
├── Page4.vue     (주요키워드)
├── Page5.vue     (본문1)
├── Page6.vue     (본문2)
├── Page8.vue     (Think) ⚠️ Page7 건너뜀!
├── Page9.vue     (Quiz)
├── Page10.vue    (Summary)
└── Page11.vue    (Outro)
```

#### 변경 후 (표준화 완료)
```
src/pages/02/flow/
├── Page1.vue     (인트로)
├── Page2.vue     (학습목표) ✅ 순차적!
├── Page3.vue     (주요키워드)
├── Page4.vue     (본문1)
├── Page5.vue     (본문2)
├── Page6.vue     (Think)
├── Page7.vue     (Quiz)
├── Page8.vue     (Summary)
└── Page9.vue     (Outro)
```

### 왜 Page2를 건너뛰었나?
- 1차시에는 `Page2.vue`가 **사전테스트**로 존재
- 2-19차시에는 사전테스트가 없어서 Page2 없이 Page3부터 시작
- → 일관성을 위해 모든 차시를 Page2부터 순차적으로 정리

---

## 차시별 페이지 구조

### 📘 1차시 (사전테스트 포함)
```
Page1  → 인트로
Page2  → 사전테스트 (Pre-test) ⭐ 1차시만!
Page3  → 학습목표
Page4  → 주요 키워드
Page5  → 광 기술 개요
Page6  → LED 기술
Page7  → 레이저 기술
Page8  → 광섬유 구성
Page9  → 생각해보기 (Think)
Page10 → 평가하기 (Quiz)
Page11 → 정리하기 (Summary)
Page12 → 아웃트로
```

**총 12페이지** | `totalPages = 12`

---

### 📗 2컨텐츠 차시 (02, 03, 05, 08-19) - 15개 차시
```
Page1 → 인트로
Page2 → 학습목표
Page3 → 주요 키워드
Page4 → 본문1
Page5 → 본문2
Page6 → 생각해보기 (Think)
Page7 → 퀴즈 (Quiz)
Page8 → 정리하기 (Summary)
Page9 → 아웃트로
```

**총 9페이지** | `totalPages = 9`

#### 해당 차시 목록
02, 03, 05, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19

---

### 📕 3컨텐츠 차시 (04, 06, 07) - 3개 차시
```
Page1  → 인트로
Page2  → 학습목표
Page3  → 주요 키워드
Page4  → 본문1
Page5  → 본문2
Page6  → 본문3 ⭐ 추가 컨텐츠!
Page7  → 생각해보기 (Think)
Page8  → 퀴즈 (Quiz)
Page9  → 정리하기 (Summary)
Page10 → 아웃트로
```

**총 10페이지** | `totalPages = 10`

#### 해당 차시 목록
04, 06, 07

---

## Think 페이지 추가 방법

### 📍 위치
**퀴즈 페이지 바로 전에 삽입**

```
[본문] → [Think] → [Quiz] → [Summary] → [Outro]
```

---

### 1️⃣ JSON 파일 수정 (`public/data/XX.json`)

#### ✨ video_X 추가
```json
{
  "video_1": "../mp4/intro_01.mp4",
  "video_3": "../mp4/goal_01.mp4",
  "video_4": "../mp4/keyword_01.mp4",
  "video_5": "../mp4/04_01.mp4",
  "video_6": "../mp4/04_02.mp4",
  "video_7": "../mp4/04_03.mp4",    // 3컨텐츠만
  "video_8": "../mp4/think.mp4",    // ✨ Think 비디오
  "video_9": "../mp4/quiz.mp4",
  "video_10": "../mp4/summary.mp4",
  "video_11": "../mp4/outro_01.mp4"
}
```

**주의**:
- 2컨텐츠 차시: `video_7` 없음, `video_8`이 Think
- 3컨텐츠 차시: `video_7` 본문3, `video_8`이 Think

#### ✨ pageInfo 배열 업데이트
```json
"pageInfo": [
  { "category": "1", "showChapter": false, "seq": "1", "title": "인트로" },
  { "category": "1", "showChapter": true,  "seq": "2", "title": "학습목표" },
  { "category": "1", "showChapter": true,  "seq": "3", "title": "주요 키워드" },
  { "category": "2", "showChapter": false, "seq": "4", "title": "본문1" },
  { "category": "2", "showChapter": false, "seq": "5", "title": "본문2" },
  // 3컨텐츠만: { "category": "2", "showChapter": false, "seq": "6", "title": "본문3" },
  { "category": "3", "showChapter": true,  "seq": "6", "title": "생각해보기" }, // ✨ 추가
  { "category": "3", "showChapter": true,  "seq": "7", "title": "퀴즈" },
  { "category": "3", "showChapter": true,  "seq": "8", "title": "정리하기" },
  { "category": "3", "showChapter": false, "seq": "9", "title": "아웃트로" }
]
```

**🔥 중요**: `seq` 번호를 순차적으로 재정렬해야 합니다!

#### ✨ think 섹션 추가
```json
"think": {
  "question": "학습 주제와 관련된 사고력 확장 질문",
  "answer": "전문가 의견 및 해설"
}
```

**팁**: HTML 태그 `<br>` 사용 가능

#### ✨ scripts 배열 확인
```json
// 2컨텐츠 차시 (9페이지)
"scripts": [
  "0: 인트로 자막",
  "1: 학습목표 자막",
  "2: 주요키워드 자막",
  "3: 본문1 자막",
  "4: 본문2 자막",
  "5: Think 자막",      // ✨ 추가 (또는 "본 학습에서는 자막을 제공하지 않습니다.")
  "6: Quiz 자막",
  "7: Summary 자막",
  "8: Outro 자막"       // ✨ scripts[9] 아님! (0부터 시작이므로 9번째는 index 8)
]
// 총 9개 (index 0-8)

// 3컨텐츠 차시 (10페이지)
"scripts": [
  "0: 인트로 자막",
  "1: 학습목표 자막",
  "2: 주요키워드 자막",
  "3: 본문1 자막",
  "4: 본문2 자막",
  "5: 본문3 자막",
  "6: Think 자막",      // ✨ 추가
  "7: Quiz 자막",
  "8: Summary 자막",
  "9: Outro 자막"       // ✨ scripts[9]
]
// 총 10개 (index 0-9)
```

---

### 2️⃣ Vue 파일 생성 (`src/pages/XX/flow/PageX.vue`)

#### 2컨텐츠 차시: `Page6.vue` (Think)
```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VideoComponent from '@/components/VideoComponent.vue'
import ThinkComponent from '@/components/ThinkComponent.vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['prevPage', 'nextPage', 'changePage'])

let json

const courseInfo = ref()
const pageInfo = ref()
const video = ref()
const thinkContent = ref()
const scriptText = ref()
const isReady = ref(false)

axios.get('/data/02.json').then((result) => {
  json = result.data

  courseInfo.value = json.courseInfo
  pageInfo.value = json.pageInfo
  video.value = json.video_8 as string  // ✨ Think 비디오

  if (json.think && json.think.question) {
    thinkContent.value = {
      question: json.think.question,
      answer: json.think.answer,
    }
  }

  scriptText.value = json.scripts[5] as string  // ✨ scripts[5]

  setTimeout(() => {
    isReady.value = true
  }, 1)
}).catch(() => {
  console.log('error')
})

const refThink = ref('')

const handlePrev = () => { emit('prevPage') }
const handleNext = () => { emit('nextPage') }
const handleChangeIndex = (target: number) => { emit('changePage', target) }

onMounted(() => {
  setTimeout(() => {
    const elMain = document.querySelector('#refInteractive') as HTMLDivElement
    const elVideo = document.querySelector('#videoPlayer') as HTMLVideoElement
    elVideo.appendChild(elMain)
  }, 100)
  parent.setCurrentPageNumber(6)  // ✨ currentPage와 일치
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
```

#### 3컨텐츠 차시: `Page7.vue` (Think)
```vue
<!-- 위와 동일하되 아래만 변경 -->
<script setup lang="ts">
// ...
axios.get('/data/04.json').then((result) => {
  // ...
  video.value = json.video_8 as string  // ✨ 동일
  scriptText.value = json.scripts[6] as string  // ✨ scripts[6]
  // ...
})

onMounted(() => {
  // ...
  parent.setCurrentPageNumber(7)  // ✨ currentPage와 일치
})
</script>
```

---

### 3️⃣ App.vue 수정 (`src/pages/XX/App.vue`)

#### 2컨텐츠 차시 예시 (02.json)
```vue
<script lang="ts">
import { defineComponent, ref } from 'vue'

import Page1 from './flow/Page1.vue'
import Page2 from './flow/Page2.vue'
import Page3 from './flow/Page3.vue'
import Page4 from './flow/Page4.vue'
import Page5 from './flow/Page5.vue'
import Page6 from './flow/Page6.vue'  // ✨ Think
import Page7 from './flow/Page7.vue'
import Page8 from './flow/Page8.vue'
import Page9 from './flow/Page9.vue'

const totalPages = 9  // ✨ 9페이지

export default defineComponent({
  name: 'App',
  components: {
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,  // ✨ Think
    Page7,
    Page8,
    Page9,
  },
  // ...
})
</script>

<template>
  <v-app id="content-app">
    <v-main id="content-main" class="d-flex flex-column align-self-center justify-center">
      <Page1 v-if="currentPage === 1" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page2 v-if="currentPage === 2" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page3 v-if="currentPage === 3" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page4 v-if="currentPage === 4" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page5 v-if="currentPage === 5" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page6 v-if="currentPage === 6" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />  <!-- ✨ Think -->
      <Page7 v-if="currentPage === 7" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page8 v-if="currentPage === 8" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
      <Page9 v-if="currentPage === 9" :current-page="currentPage" :total-pages="totalPages" @prev-page="prevPage" @next-page="nextPage" @change-page="changePage" />
    </v-main>
  </v-app>
</template>
```

#### 3컨텐츠 차시 예시 (04.json)
```vue
<script lang="ts">
import Page1 from './flow/Page1.vue'
import Page2 from './flow/Page2.vue'
import Page3 from './flow/Page3.vue'
import Page4 from './flow/Page4.vue'
import Page5 from './flow/Page5.vue'
import Page6 from './flow/Page6.vue'
import Page7 from './flow/Page7.vue'  // ✨ Think
import Page8 from './flow/Page8.vue'
import Page9 from './flow/Page9.vue'
import Page10 from './flow/Page10.vue'

const totalPages = 10  // ✨ 10페이지

export default defineComponent({
  components: {
    Page1, Page2, Page3, Page4, Page5,
    Page6, Page7, Page8, Page9, Page10,
  },
  // ...
})
</script>

<template>
  <v-app id="content-app">
    <v-main id="content-main" class="d-flex flex-column align-self-center justify-center">
      <Page1 v-if="currentPage === 1" ... />
      <Page2 v-if="currentPage === 2" ... />
      <Page3 v-if="currentPage === 3" ... />
      <Page4 v-if="currentPage === 4" ... />
      <Page5 v-if="currentPage === 5" ... />
      <Page6 v-if="currentPage === 6" ... />  <!-- 본문3 -->
      <Page7 v-if="currentPage === 7" ... />  <!-- ✨ Think -->
      <Page8 v-if="currentPage === 8" ... />
      <Page9 v-if="currentPage === 9" ... />
      <Page10 v-if="currentPage === 10" ... />
    </v-main>
  </v-app>
</template>
```

---

### 4️⃣ 다른 페이지들의 scripts 인덱스 & setCurrentPageNumber 업데이트

#### 2컨텐츠 차시 (9페이지)
| Page | 역할 | scripts 인덱스 | setCurrentPageNumber |
|------|------|----------------|----------------------|
| Page1 | 인트로 | `scripts[0]` | `1` |
| Page2 | 학습목표 | `scripts[1]` | `2` |
| Page3 | 주요키워드 | `scripts[2]` | `3` |
| Page4 | 본문1 | `scripts[3]` | `4` |
| Page5 | 본문2 | `scripts[4]` | `5` |
| **Page6** | **Think** | **`scripts[5]`** ✨ | **`6`** |
| Page7 | Quiz | `scripts[6]` | `7` |
| Page8 | Summary | `scripts[7]` | `8` |
| Page9 | Outro | `scripts[8]` | `9` |

**주의**: 02차시만 예외적으로 `scripts[10]` 사용 (scripts 배열이 11개)

#### 3컨텐츠 차시 (10페이지)
| Page | 역할 | scripts 인덱스 | setCurrentPageNumber |
|------|------|----------------|----------------------|
| Page1 | 인트로 | `scripts[0]` | `1` |
| Page2 | 학습목표 | `scripts[1]` | `2` |
| Page3 | 주요키워드 | `scripts[2]` | `3` |
| Page4 | 본문1 | `scripts[3]` | `4` |
| Page5 | 본문2 | `scripts[4]` | `5` |
| Page6 | 본문3 | `scripts[5]` | `6` |
| **Page7** | **Think** | **`scripts[6]`** ✨ | **`7`** |
| Page8 | Quiz | `scripts[7]` | `8` |
| Page9 | Summary | `scripts[8]` | `9` |
| Page10 | Outro | `scripts[9]` | `10` |

---

## 트러블슈팅

### ❌ 문제: 아웃트로가 재생되지 않음
#### 원인
- `pageInfo` 배열 개수 ≠ 실제 페이지 수
- Think 페이지 항목 누락

#### 해결
```json
// public/data/XX.json
"pageInfo": [
  // ... 기존 항목들
  { "category": "3", "showChapter": true, "seq": "6", "title": "생각해보기" }, // ✨ 추가
  { "category": "3", "showChapter": true, "seq": "7", "title": "퀴즈" },
  // ...
]
```

---

### ❌ 문제: 잘못된 자막이 표시됨
#### 원인
- `scripts` 배열 인덱스 잘못 참조

#### 해결
```vue
<!-- Page6.vue (2컨텐츠 Think) -->
<script>
scriptText.value = json.scripts[5] as string  // ✨ 정확한 인덱스
</script>

<!-- Page7.vue (3컨텐츠 Think) -->
<script>
scriptText.value = json.scripts[6] as string  // ✨ 정확한 인덱스
</script>
```

---

### ❌ 문제: 페이지 이동 시 미디어바가 사라짐
#### 원인
- 페이지 전환 타이밍 문제
- DOM 요소 재배치 필요

#### 해결
```vue
<script>
onMounted(() => {
  setTimeout(() => {
    const elMain = document.querySelector('#refInteractive') as HTMLDivElement
    const elVideo = document.querySelector('#videoPlayer') as HTMLVideoElement
    elVideo.appendChild(elMain)
  }, 100)  // ✨ 100ms 딜레이로 DOM 준비 대기
  parent.setCurrentPageNumber(6)
})
</script>
```

---

### ❌ 문제: Page import 오류
#### 원인
- 파일명 변경 후 import 경로 미업데이트

#### 해결
```vue
<!-- App.vue -->
<script lang="ts">
// ❌ 잘못된 경로
import Page8 from './flow/Page8.vue'  // Think가 Page6으로 변경되었는데 Page8 import

// ✅ 올바른 경로
import Page6 from './flow/Page6.vue'  // Think
</script>
```

---

### ❌ 문제: 라우팅 조건 불일치
#### 원인
- `currentPage` 조건과 실제 페이지 순서 불일치

#### 해결
```vue
<!-- ❌ 잘못된 라우팅 -->
<Page8 v-if="currentPage === 6" ... />  <!-- Think -->
<Page9 v-if="currentPage === 7" ... />  <!-- Quiz -->

<!-- ✅ 올바른 라우팅 (파일명 변경 후) -->
<Page6 v-if="currentPage === 6" ... />  <!-- Think -->
<Page7 v-if="currentPage === 7" ... />  <!-- Quiz -->
```

---

## 체크리스트

### JSON 파일 (`public/data/XX.json`)
- [ ] `video_8` 추가 (`"../mp4/think.mp4"`)
- [ ] `pageInfo` 배열에 "생각해보기" 항목 추가
- [ ] `seq` 번호 순차적으로 재정렬
- [ ] `think` 섹션 추가 (question, answer)
- [ ] `scripts` 배열 개수 확인 (2컨텐츠: 9개, 3컨텐츠: 10개)

### Vue 파일 생성
- [ ] 2컨텐츠: `Page6.vue` (Think) 생성
- [ ] 3컨텐츠: `Page7.vue` (Think) 생성
- [ ] `video_8` 참조 확인
- [ ] `scripts[5]` (2컨텐츠) 또는 `scripts[6]` (3컨텐츠) 확인
- [ ] `setCurrentPageNumber` 값 확인 (6 또는 7)
- [ ] `ThinkComponent` import 확인

### App.vue 업데이트
- [ ] Think 페이지 import 추가
- [ ] `totalPages` 값 확인 (9 또는 10)
- [ ] components 등록 확인
- [ ] 라우팅 조건 순차적으로 정렬
- [ ] 모든 `currentPage` 조건 확인

### 다른 페이지 업데이트
- [ ] Quiz 페이지: `scripts` 인덱스 +1
- [ ] Quiz 페이지: `setCurrentPageNumber` +1
- [ ] Summary 페이지: `scripts` 인덱스 +1
- [ ] Summary 페이지: `setCurrentPageNumber` +1
- [ ] Outro 페이지: `scripts` 인덱스 확인
- [ ] Outro 페이지: `setCurrentPageNumber` 확인

### 최종 테스트
- [ ] 인트로 → 학습목표 이동 확인
- [ ] 본문2 → Think 이동 확인
- [ ] Think → Quiz 이동 확인
- [ ] Quiz → Summary 이동 확인
- [ ] Summary → Outro 이동 확인
- [ ] **Outro 비디오 재생 확인** ✨
- [ ] 미디어바 정상 표시 확인
- [ ] 브라우저 콘솔 에러 없음 확인

---

## 🎯 핵심 포인트 요약

### 1. pageInfo 배열 = 실제 페이지 수
**반드시 일치해야 네비게이션이 정상 작동합니다!**

### 2. 파일명은 순차적으로
```
Page1.vue → Page2.vue → Page3.vue → ...
```
중간에 번호를 건너뛰면 안 됩니다!

### 3. scripts 인덱스 = 0부터 시작
```
scripts[0], scripts[1], scripts[2], ...
```
9페이지면 `scripts[0]` ~ `scripts[8]` (총 9개)

### 4. setCurrentPageNumber = currentPage 조건과 일치
```vue
<Page6 v-if="currentPage === 6" ... />
<!-- Page6.vue 내부 -->
parent.setCurrentPageNumber(6)
```

### 5. Think 페이지 위치 = Quiz 바로 앞
```
[본문] → [Think] → [Quiz] → [Summary] → [Outro]
```

---

## 📞 참고 정보

### 관련 파일 위치
- JSON 데이터: `public/data/XX.json`
- Vue 페이지: `src/pages/XX/flow/PageX.vue`
- App 라우터: `src/pages/XX/App.vue`
- Think 컴포넌트: `src/components/ThinkComponent.vue`

### 주요 비디오 파일
- `intro_01.mp4` - 인트로 (모든 차시 공통)
- `goal_01.mp4` - 학습목표 (모든 차시 공통)
- `keyword_01.mp4` - 주요키워드 (모든 차시 공통)
- `XX_01.mp4` ~ `XX_03.mp4` - 본문 (차시별)
- `think.mp4` - Think (모든 차시 공통) ✨
- `quiz.mp4` - Quiz (모든 차시 공통)
- `summary.mp4` - Summary (모든 차시 공통)
- `outro_01.mp4` - Outro (모든 차시 공통)

---

## 📝 변경 이력

### 2026-01-22
- ✅ 모든 차시(02-19) JSON 파일에 "생각해보기" 항목 추가
- ✅ 아웃트로 재생 문제 해결 (pageInfo 배열 일치)
- ✅ 모든 차시 페이지 파일명 순차화 (Page2부터 시작)
- ✅ App.vue import 및 routing 표준화
- ✅ setCurrentPageNumber 값 전체 정렬
- ✅ 완전 가이드 문서 작성

---

**🎉 이제 모든 차시에서 Think 페이지가 정상 작동하며, 아웃트로도 완벽하게 재생됩니다!**
