# 빌드 및 배포 가이드

## 1. 프로젝트 빌드

### 사전 준비
```bash
# 의존성 패키지 설치 (최초 1회)
npm install
```

### 빌드 실행
```bash
npm run build
```

빌드 과정:
1. TypeScript 타입 체킹 (`vue-tsc --noEmit`)
2. Vite 빌드 실행 (`vite build`)
3. HTML 후처리 스크립트 자동 실행 (`node scripts/flatten-html.mjs`)

### 빌드 결과물
`dist/` 폴더에 다음 구조로 생성됩니다:

```
dist/
├── 01/
│   ├── 01.html
│   ├── 02.html
│   ├── ...
│   ├── 11.html
│   └── 12.html  ⭐ 아웃트로 페이지
├── 02/
│   ├── 01.html
│   ├── 02.html
│   ├── ...
│   ├── 11.html
│   └── 12.html  ⭐ 아웃트로 페이지
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── font/
│   └── audio/
├── data/
├── down/
├── mp4/
└── favicon.ico
```

**중요**: 각 챕터는 **총 12페이지**로 구성됩니다 (01.html ~ 12.html)

## 2. NAS 배포

### 배포 경로
NAS 파일 시스템 경로:
```
/volume1/WEBSERVICE/@PREVIEW@/bitcampus/teset/dist
```

### 배포 방법

#### 방법 1: 전체 삭제 후 재배포 (권장)
```
1. NAS의 기존 dist 폴더 전체 삭제
2. 로컬의 dist 폴더 전체를 NAS로 복사
```

#### 방법 2: 덮어쓰기
```
로컬 dist 폴더 내용을 NAS dist 폴더로 복사 (기존 파일 덮어쓰기)
```

### 주의사항
- **동영상/이미지 파일 수정 시**: 반드시 기존 파일 삭제 후 새 파일 업로드
- **파일명 변경 시**: 기존 파일이 남아있지 않도록 주의
- **캐시 문제**: 파일 수정 후에는 브라우저 강력 새로고침 필요

## 3. 웹 접속

### 접속 주소
```
http://preview.heyhey.com/bitcampus/teset/dist/
```

### 페이지 구조
- 챕터 1, 페이지 1: `http://preview.heyhey.com/bitcampus/teset/dist/01/01.html`
- 챕터 1, 페이지 2: `http://preview.heyhey.com/bitcampus/teset/dist/01/02.html`
- 챕터 2, 페이지 1: `http://preview.heyhey.com/bitcampus/teset/dist/02/01.html`
- ...

## 4. 브라우저 캐시 문제 해결

### 강력 새로고침
- **Windows**: `Ctrl + Shift + R` 또는 `Shift + F5`
- **Mac**: `Cmd + Shift + R`

### 캐시 완전 삭제 (Chrome)
1. `Ctrl + Shift + Delete` 실행
2. 시간 범위: "전체 기간" 선택
3. "캐시된 이미지 및 파일" 체크
4. "인터넷 사용 기록 삭제" 클릭

### 시크릿 모드 테스트
- `Ctrl + Shift + N`으로 시크릿 창 열기
- 캐시 없이 최신 버전 확인 가능

### 개발자 도구 사용
1. `F12` 눌러서 개발자 도구 열기
2. Network 탭 클릭
3. "Disable cache" 체크
4. 개발자 도구를 연 상태에서 새로고침

## 5. 트러블슈팅

### 문제: 옛날 버전이 계속 나옴
**원인**: 브라우저 캐시 또는 NAS 파일 미업데이트

**해결**:
1. NAS 파일 수정 시간 확인
2. NAS 파일 완전 삭제 후 재업로드
3. 브라우저 강력 새로고침 (`Ctrl + Shift + R`)
4. 시크릿 모드로 테스트

### 문제: 동영상/이미지가 로드 안됨
**원인**: 파일 경로 문제 또는 파일 누락

**해결**:
1. 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인
2. Network 탭에서 404 에러 파일 확인
3. NAS의 해당 경로에 파일이 실제로 존재하는지 확인

### 문제: 빌드 에러
**원인**: 의존성 패키지 누락 또는 TypeScript 에러

**해결**:
```bash
# 의존성 재설치
npm install

# TypeScript 체킹 생략하고 빌드만 실행
npx vite build
```

### 문제: 12페이지(아웃트로)가 생성되지 않음
**원인**: 빌드 후처리 스크립트의 페이지 수 설정이 잘못됨

**증상**:
- `dist/01/` 폴더에 `12.html` 파일이 없음
- 11페이지에서 다음 페이지로 이동 불가
- 빌드 로그에 `01/12.html processed` 메시지가 없음

**해결**:
1. `scripts/flatten-html.mjs` 파일 열기
2. 14번 줄 확인:
   ```javascript
   const TOTAL_PAGES = 12  // 11이 아닌 12로 설정되어 있어야 함
   ```
3. 만약 `11`로 되어 있다면 `12`로 수정
4. 다시 빌드 실행:
   ```bash
   npm run build
   ```
5. 빌드 로그에서 `01/12.html processed`, `02/12.html processed` 확인

**예방**:
- 페이지를 추가/제거할 때마다 `scripts/flatten-html.mjs`의 `TOTAL_PAGES` 값도 함께 수정
- 빌드 후 반드시 `dist/` 폴더에서 모든 HTML 파일이 생성되었는지 확인

## 6. 개발 환경

### 로컬 개발 서버 실행
```bash
npm run dev
```

접속: `http://localhost:3031`

### 프로젝트 구조
```
프로젝트 루트/
├── src/
│   ├── pages/
│   │   ├── 01/          # 챕터 1
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   └── 02/          # 챕터 2
│   │       ├── index.html
│   │       └── main.ts
│   ├── assets/
│   ├── components/
│   └── ...
├── public/
│   ├── data/
│   ├── down/
│   ├── mp4/
│   └── ...
├── scripts/
│   └── flatten-html.mjs  # 빌드 후처리 스크립트
├── vite.config.ts
└── package.json
```

## 7. 배포 체크리스트

### 빌드 전
- [ ] `scripts/flatten-html.mjs`의 `TOTAL_PAGES = 12` 확인
- [ ] `src/pages/01/App.vue`의 `totalPages = 12` 확인

### 빌드
- [ ] 로컬에서 `npm run build` 실행
- [ ] TypeScript 에러 없이 빌드 완료 확인

### 빌드 후 검증
- [ ] `dist/` 폴더 생성 확인
- [ ] `dist/01/12.html` 파일 생성 확인 ⭐
- [ ] `dist/02/12.html` 파일 생성 확인 ⭐
- [ ] 빌드 로그에서 `12.html processed` 메시지 확인
- [ ] 수정한 파일(동영상/이미지 등)이 dist에 포함되었는지 확인

### 배포
- [ ] NAS 기존 dist 폴더 삭제
- [ ] 새 dist 폴더 NAS에 업로드

### 테스트
- [ ] 브라우저 캐시 삭제 또는 강력 새로고침 (`Ctrl + Shift + R`)
- [ ] 웹에서 1~12페이지 모두 접근 가능한지 확인
- [ ] 11페이지에서 12페이지로 이동 가능한지 확인 ⭐
