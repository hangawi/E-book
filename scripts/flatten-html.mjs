import fs from 'fs'
import path from 'path'

const DIST_DIR = path.resolve('dist')
const ASSETS_RELATIVE_PATH = '../assets'
const DATA_RELATIVE_PATH = '../data'

// 챕터 폴더 가져오기
const chapters = fs.readdirSync(DIST_DIR)
  .filter(dir => fs.statSync(path.join(DIST_DIR, dir)).isDirectory())
  .filter(dir => /^\d+$/.test(dir))
  .sort((a, b) => Number(a) - Number(b))

const TOTAL_PAGES = 11

// ------------------------
// 1️⃣ HTML 후처리
// ------------------------
for (const chapter of chapters) {
  const chapterDir = path.join(DIST_DIR, chapter)
  const indexHtmlPath = path.join(chapterDir, 'index.html')

  if (!fs.existsSync(indexHtmlPath)) {
    console.warn(`⚠️ skip chapter ${chapter}: index.html not found`)
    continue
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
  const chapterNumber = Number(chapter)

  for (let page = 1; page <= TOTAL_PAGES; page++) {
    const pageName = String(page).padStart(2, '0')
    const targetHtmlPath = path.join(chapterDir, `${pageName}.html`)

    const replacedHtml = baseHtml
      // 현재 페이지/챕터 설정
      .replace(/window\._currentPage\s*=\s*\d+/, `window._currentPage = ${page}`)
      .replace(/window\._currentChapter\s*=\s*\d+/, `window._currentChapter = ${chapterNumber}`)
      // assets 경로 수정
      .replace(/"\.\.\/\.\.\/\.\.\/assets/g, `"${ASSETS_RELATIVE_PATH}`)

    fs.writeFileSync(targetHtmlPath, replacedHtml, 'utf-8')
    console.log(`✅ ${chapter}/${pageName}.html processed`)
  }

  // index.html 제거
  fs.unlinkSync(indexHtmlPath)
  console.log(`🗑️ ${chapter}/index.html removed`)
}

// ------------------------
// 2️⃣ JS 후처리 (JSON 경로 수정)
// ------------------------
const jsDir = path.join(DIST_DIR, 'assets', 'js')
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'))

  for (const file of jsFiles) {
    const jsPath = path.join(jsDir, file)
    let content = fs.readFileSync(jsPath, 'utf-8')

    // JSON 경로 수정: /data/01.json → ../data/01.json
    content = content.replace(/\/data\/(\d+)\.json/g, `${DATA_RELATIVE_PATH}/$1.json`)

    fs.writeFileSync(jsPath, content, 'utf-8')
    console.log(`✅ JS updated: ${file}`)
  }
}

console.log('🎉 All HTML and JS files updated successfully!')
