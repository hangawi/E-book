import fs from 'fs'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mpa from 'vite-plugin-mpa'
import htmlTemplate from 'vite-plugin-html-template'

// 프로젝트 src/pages 폴더
const pagesDir = path.resolve(__dirname, 'src/pages')

// 존재하는 챕터 디렉토리 모두 가져오기
const chapters = fs.readdirSync(pagesDir)
  .filter(dir => fs.statSync(path.join(pagesDir, dir)).isDirectory())

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    mpa(),
    htmlTemplate(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    minify: true, // 고객사 보기 쉽게 minify 해제 false 또는 용량 줄이기 true
    sourcemap: true,

    /** CSS 분할 금지 */
    cssCodeSplit: false,

    rollupOptions: {
      output: {
        /** JS 파일명 */
        entryFileNames(chunk) {
          const id = chunk.facadeModuleId
          if (!id)
            return 'assets/js/common.js'

          // 프로젝트 루트 기준 상대경로
          const relativeId = path.relative(__dirname, id).split(path.sep).join('/')

          for (const chapter of chapters) {
            if (relativeId.includes(`src/pages/${chapter}/`))
              return `assets/js/chapter_${chapter}.js`
          }

          return 'assets/js/common.js'
        },

        /** 모든 node_modules는 common.js로 묶기 */
        manualChunks(id) {
          if (id.includes('node_modules'))
            return 'common'
        },

        /** asset 파일명 정리 */
        assetFileNames(asset) {
          if (!asset.name)
            return 'assets/other/[name][extname]'

          const ext = asset.name.split('.').pop()?.toLowerCase()

          // CSS 파일명
          if (ext === 'css') {
            for (const chapter of chapters) {
              // CSS 파일에 chapter 이름 포함 시
              if (asset.name.includes(`chapter_${chapter}`))
                return `assets/css/chapter_${chapter}.css`
            }
            // 공통 CSS
            return 'assets/css/common.css'
          }

          // 이미지
          if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(<string>ext))
            return 'assets/img/[name][extname]'

          // 오디오
          if (['mp3', 'wav', 'ogg'].includes(<string>ext))
            return 'assets/audio/[name][extname]'

          // 폰트
          if (['woff', 'woff2', 'ttf', 'eot'].includes(<string>ext))
            return 'assets/font/[name][extname]'

          return 'assets/other/[name][extname]'
        },
      },
    },
  },
})
