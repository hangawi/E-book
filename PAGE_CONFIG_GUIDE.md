# 페이지 설정 가이드 (간편 버전)

차시별로 페이지 구성을 쉽게 변경하는 방법입니다.

## 📌 기본 개념

각 차시는 **2개 파일**로 관리됩니다:
1. `public/data/0X.json` - 데이터 설정
2. `src/pages/0X/App.vue` - 페이지 연결

---

## 🎯 페이지 추가/삭제하는 방법

### STEP 1: JSON 파일 수정 (`public/data/0X.json`)

#### pageInfo 수정

```json
"pageInfo": [
  { "seq": "1", "title": "인트로", "showChapter": false },
  { "seq": "2", "title": "학습목표", "showChapter": true },
  { "seq": "3", "title": "퀴즈", "showChapter": true }
]
```

- **필요 없는 페이지는 줄 자체를 삭제**
- `seq` 번호는 연속적이지 않아도 됨
- `showChapter: true` → 챕터명 배경(Shape.png) 표시
- `showChapter: false` → 챕터명 배경 숨김

#### 비디오 파일 확인

```json
"video_1": "../mp4/intro_01.mp4",
"video_2": "../mp4/pretest.mp4",    // Page2 사전테스트용
"video_3": "../mp4/goal_01.mp4"
```

**사용하는 페이지에 해당하는 video만 넣기!**
- Page1 → video_1
- Page2 → video_2
- Page3 → video_3
- ...

---

### STEP 2: App.vue 수정 (`src/pages/0X/App.vue`)

#### 2-1. Import 섹션

```javascript
import Page1 from './flow/Page1.vue'
import Page2 from './flow/Page2.vue'  // 사용 안 하면 주석처리
import Page3 from './flow/Page3.vue'
// import Page4 from './flow/Page4.vue'  // ← 이렇게 주석처리
```

#### 2-2. totalPages 수정

```javascript
const totalPages = 7  // 실제 사용할 페이지 개수
```

#### 2-3. components 섹션

```javascript
components: {
  Page1,
  Page2,
  Page3,
  // Page4,  // 주석처리
  Page5,
  Page6,
}
```

#### 2-4. Template 섹션

```vue
<template>
  <Page1 v-if="currentPage === 1" ... />
  <Page2 v-if="currentPage === 2" ... />
  <Page3 v-if="currentPage === 3" ... />
  <!-- Page4 삭제됨 -->
  <Page5 v-if="currentPage === 4" ... />  <!-- 4번으로 당겨짐 -->
  <Page6 v-if="currentPage === 5" ... />  <!-- 5번으로 당겨짐 -->
</template>
```

**중요:** 페이지를 삭제하면 뒤 페이지들의 번호를 당겨야 함!

---

## 📝 실전 예시: 2차시 설정

### 사전테스트(Page2) 제거하는 경우

#### ✅ JSON 수정 (02.json)

```json
{
  "pageInfo": [
    { "seq": "1", "title": "인트로", "showChapter": false },
    // Page2 사전테스트 줄 삭제
    { "seq": "3", "title": "학습목표", "showChapter": true },
    { "seq": "4", "title": "주요 키워드", "showChapter": true },
    { "seq": "5", "title": "본문1", "showChapter": false },
    { "seq": "6", "title": "본문2", "showChapter": false },
    { "seq": "7", "title": "퀴즈", "showChapter": true },
    { "seq": "8", "title": "아웃트로", "showChapter": false }
  ],
  "video_1": "../mp4/intro_01.mp4",
  // "video_2": "../mp4/pretest.mp4",  ← 삭제
  "video_3": "../mp4/goal_01.mp4",
  // ...
}
```

#### ✅ App.vue 수정 (src/pages/02/App.vue)

```javascript
// 1. Import에서 주석처리
import Page1 from './flow/Page1.vue'
// import Page2 from './flow/Page2.vue'  // ← 주석
import Page3 from './flow/Page3.vue'

// 2. totalPages 수정
const totalPages = 7  // 8에서 7로 변경

// 3. components에서 주석처리
components: {
  Page1,
  // Page2,  // ← 주석
  Page3,
  Page4,
  // ...
}
```

```vue
<!-- 4. Template 수정 -->
<template>
  <Page1 v-if="currentPage === 1" ... />
  <!-- Page2 삭제 -->
  <Page3 v-if="currentPage === 2" ... />  <!-- 2번으로 당김 -->
  <Page4 v-if="currentPage === 3" ... />  <!-- 3번으로 당김 -->
  <Page5 v-if="currentPage === 4" ... />
  <Page6 v-if="currentPage === 5" ... />
  <Page9 v-if="currentPage === 6" ... />
  <Page11 v-if="currentPage === 7" ... />
</template>
```

---

## 🎨 Think / Summary 설정

### Think(생각해보기)

```json
// ✅ 사용
"think": {
  "question": "질문 내용",
  "answer": "답변 내용"
}

// ❌ 안 씀
"think": null
```

또는 Page에서 조건부 렌더링:
```vue
<ThinkComponent v-if="isReady && thinkContent" ... />
```

### Summary(정리하기)

```json
// ✅ 사용
"summary": [
  {
    "title": "제목",
    "context": ["내용1", "내용2"]
  }
]

// ❌ 안 씀
"summary": []
```

---

## ⚠️ 주의사항

### 1. 페이지 번호 일치시키기

Template에서 `currentPage === X`의 X번호가 **연속적**이어야 합니다!

❌ 잘못된 예:
```vue
<Page1 v-if="currentPage === 1" />
<Page3 v-if="currentPage === 3" />  <!-- 2번이 없음! -->
<Page4 v-if="currentPage === 4" />
```

✅ 올바른 예:
```vue
<Page1 v-if="currentPage === 1" />
<Page3 v-if="currentPage === 2" />  <!-- 2번으로 수정 -->
<Page4 v-if="currentPage === 3" />  <!-- 3번으로 수정 -->
```

### 2. totalPages 개수 맞추기

실제 페이지 개수와 일치해야 합니다.

### 3. video 파일 확인

삭제한 페이지의 video도 JSON에서 삭제하거나 주석처리

---

## 📋 빠른 체크리스트

새 차시 만들 때:

- [ ] `src/pages/0X` 폴더 복사
- [ ] `public/data/0X.json` 파일 복사
- [ ] JSON에서 `courseInfo` 수정 (차시명, 번호)
- [ ] JSON에서 안 쓰는 페이지 줄 삭제
- [ ] JSON에서 안 쓰는 video 삭제
- [ ] App.vue에서 import 주석처리
- [ ] App.vue에서 totalPages 수정
- [ ] App.vue에서 components 주석처리
- [ ] App.vue에서 template 수정 (번호 당기기)
- [ ] `think` / `summary` 사용 여부 설정

---

## 💡 팁

### 페이지 순서 바꾸기

JSON의 `pageInfo` 배열 순서 변경 + App.vue template 순서 변경

### 같은 컴포넌트 두 번 쓰기

```vue
<Page5 v-if="currentPage === 3" ... />  <!-- 본문1 -->
<Page5 v-if="currentPage === 4" ... />  <!-- 본문2 -->
```

각각 다른 video와 scripts를 쓰면 됨!

---

## 🎯 현재 2차시 구조 (예시)

```
Page1  → currentPage 1 → 인트로
(Page2 삭제 - 사전테스트)
Page3  → currentPage 2 → 학습목표
Page4  → currentPage 3 → 주요 키워드
Page5  → currentPage 4 → 본문1 (스마트조명)
Page6  → currentPage 5 → 본문2 (디스플레이)
(Page7 삭제 - video_7 없음)
(Page8 삭제 - Think 안 씀)
Page9  → currentPage 6 → 퀴즈
(Page10 삭제 - video_10 없음)
Page11 → currentPage 7 → 아웃트로

총 7페이지
```

---

이제 JSON과 App.vue만 수정하면 자유롭게 페이지를 구성할 수 있습니다! 🚀
