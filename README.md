# 비트캠퍼스 2026 HTML CSS WEB Development 이러닝 컨텐츠

본 프로젝트는 **Vue 3 + Vite 기반** 프론트엔드 프로젝트입니다.  
Node.js LTS와 pnpm 환경을 기준으로 개발되었으며, HTML/CSS 기반 웹 컨텐츠를 관리하고 배포하기 위해 설계되었습니다.

---

## 📦 Tech Stack

- **Vue 3**
- **Vite**
- **TypeScript**
- **pnpm**
- **Node.js 20 LTS**

---

## ⚠️ Node.js 버전 정책 (중요)

본 프로젝트는 **Node.js 20 LTS**만 지원합니다.

- ❌ Node 18 (구 LTS)
- ❌ Node 21 (Odd / 미지원)
- ✅ **Node 20.19+ (권장)**

### asdf 사용 시

```bash
asdf install nodejs 20.19.6
asdf set nodejs 20.19.6
```
프로젝트 루트에 .tool-versions 파일이 포함되어 있어, asdf 사용자는 자동으로 버전이 맞춰집니다.

---

## 📦 Package Manager

프로젝트는 **pnpm + corepack**을 사용합니다.

**pnpm 버전 고정**
```json
{
  "packageManager": "pnpm@9.15.0"
}
```

**corepack 활성화 (최초 1회)**
```bash
corepack enable
```
> ⚠️ npm install, yarn install 사용 금지

---

## 🚀 Project Setup
```bash
pnpm install
```

---

## 🧪 Development
```bash
pnpm dev
```
* Vite 개발 서버 실행 (--port 3031 --host)
* Hot Module Reloading 지원


---

## 🏗 Build (Production)
```bash
pnpm build
```

* vue-tsc --noEmit 타입 체크 후 빌드
* 빌드 후 scripts/flatten-html.mjs 실행 (HTML & JS 후처리)

```bash
pnpm postbuild
```

* HTML: 각 챕터/페이지별 index.html → 01.html, 02.html … 변환
* JS: JSON 경로 수정 (/data/01.json → ../data/01.json)
* assets 경로 수정 (../../../assets → ../assets)

---

## 🧹 Lint

```bash
pnpm lint
```

* eslint 기반 자동 포맷 및 코드 정리
* 대상 파일: .vue, .js, .ts
* .gitignore 무시 파일 제외

---

## 🧠 Type Checking
```bash
pnpm type-check
# 또는
pnpm vue-tsc --noEmit
```

* Vue SFC(.vue) 타입 체크용

---

## 🧑‍💻 IDE 권장 설정

**WebStorm (권장)**
* Node interpreter: Node.js 20 (asdf)
* Package manager: pnpm

**VS Code (선택)**
* Volar 설치 (Vue 3 추천)
* TypeScript Vue Plugin (Volar)
* Vetur 비활성화

---

## 📁 Git 정책
다음 파일/폴더는 Git에 포함되지 않습니다:
* node_modules/
* dist/
* .idea/
* public/mp4/
* .env*

자세한 내용은 .gitignore 참고

---

## 📌 Notes

* CI는 현재 사용하지 않지만, Node/pnpm 구조는 CI-ready 상태
* 추후 GitHub Actions 추가 시 구조 변경 없이 적용 가능
* 빌드 결과물은 각 챕터별 독립 HTML 페이지로 제공되며, JS/CSS/asset 경로가 자동으로 조정됨

---

## 🏁 Quick Start

```bash
corepack enable
pnpm install
pnpm dev
```
* 개발 서버 실행 후 localhost:3031 접속
* 각 챕터별 페이지 테스트 가능

