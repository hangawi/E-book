<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import videojs from 'video.js'
import { useStudyStore } from '@/stores/study'
import 'video.js/dist/video-js.css'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  autoStart: {
    type: Boolean,
    required: true,
  },
  poster: {
    type: String,
    required: false,
  },
  isAudio: {
    type: Boolean,
    required: false,
  },
  video: {
    type: String,
    required: true,
  },
  courseInfo: {
    type: Object,
    required: true,
    chapterNumber: {
      type: Number,
      default: null,
      required: false,
    },
    chapterTitle: {
      type: String,
      default: null,
      required: false,
    },
    stepNumber: {
      type: Number,
      default: null,
      required: false,
    },
    stepTitle: {
      type: String,
      default: null,
      required: false,
    },
    subMenu1: {
      type: Number,
      default: null,
      required: false,
    },
    subMenu2: {
      type: Number,
      default: null,
      required: false,
    },
    subMenu3: {
      type: Number,
      default: null,
      required: false,
    },
  },
  pageInfo: {
    type: Object,
    required: true,
    category: {
      type: Number,
      default: null,
      required: false,
    },
    number: {
      type: Number,
      default: null,
      required: false,
    },
    title: {
      type: String,
      default: null,
      required: false,
    },
  },
  scriptText: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['handlePrev', 'handleNext', 'handleChangePage'])

const studyStore = useStudyStore()

const isReady = ref(false)
const hasMounted = ref(false)

const refPlayer = ref()
const refScriptArea = ref()
const refSkip = ref()

const elBody = document.querySelector('body') as HTMLBodyElement

let isFullscreen

const isPlayed = ref(false)

const playbackRateLists = [0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0]

const openScript = ref(false)
const showIndex = ref(false)
const showBookmark = ref(false)
const showHelp = ref(false)
const lastPlayed = ref(false)

let timer

// const chapters = ref([
//   { number: '01', title: '시스템 프로그래밍이란?' },
//   { number: '09', title: '연극 수업 단계별 지도 4' },
//   { number: '02', title: '내가 실패했던 연극 수업 이야기' },
//   { number: '10', title: '놀이 중심의 표현활동 지도의 실제' },
//   { number: '03', title: '성공적인 연극 수업을 위한 필요 요소' },
//   { number: '11', title: '이야기 중심의 표현활동 지도의 실제' },
//   { number: '04', title: '연극 수업 전 교사 준비 사항' },
//   { number: '12', title: '사물 중심의 표현활동 지도의 실제' },
//   { number: '05', title: '연극 수업 전 학생 지도 사항' },
//   { number: '13', title: '즉흥적인 상황에 따른 표현활동 지도의 실제' },
//   { number: '06', title: '연극 수업 단계별 지도 1' },
//   { number: '14', title: '공연준비활동에 대한 지도' },
//   { number: '07', title: '연극 수업 단계별 지도 2' },
//   { number: '15', title: '공연 후 활동 마무리' },
//   { number: '08', title: '연극 수업 단계별 지도 3' },
// ])

const tab = ref('option-1')

const itostr = (arg: number) => arg.toString().padStart(2, '0')

const chapterTitle = computed(() =>
    `${itostr(props.courseInfo.chapterNumber)}. ${props.courseInfo.chapterTitle}`,
)

// const handleDownloadAll = () => {
//   window.open('../down/note_all.zip', '_self')
// }
//
// const handleDownload = (targetChapter: string) => {
//   const selectChapter = Number(targetChapter)
//
//   window.open(`../down/note_${itostr(selectChapter)}.zip`, '_self')
// }

const getWidth = () => {
  const innerWidth = window.innerWidth
  let res = 1120
  if (innerWidth < 1120)
    res = innerWidth
  return res
}

const getHeight = () => {
  const innerHeight = window.innerHeight
  let res = 630
  if (innerHeight < 630)
    res = innerHeight
  return res
}

const videoOptions = {
  autoplay: props.autoStart,
  Preload: true,
  controls: true,
  poster: props.poster,
  sources: [
    {
      src: props.video,
    },
  ],
  width: getWidth(),
  height: getHeight(),
  inactivityTimeout: 0,
  children: [
    'mediaLoader',
    'posterImage',
    'loadingSpinner',
    'controlBar',
  ],
  nativeControlsForTouch: false,
  playbackRate: 1,
  playbackRates: playbackRateLists,
  controlBar: {
    children: [
      'playbackRateMenuButton',
      'playToggle',
      'progressControl',
      'currentTimeDisplay',
      'timeDivider',
      'durationDisplay',
      'volumePanel',
      'fullscreenToggle',
      'nextButton',
    ],
    volumePanel: {
      inline: true, // 가로 볼륨바로 변경
    },
  },
}

const player = ref()

const changeRateText = (item: any) => {
  const _text = item.innerText.split('x')[0]
  if (_text.length === 1)
    item.innerText = `x${_text}.0`
  else
    item.innerText = `x${_text}`
}

const customTimeFormat = (seconds, guide) => {
  seconds = seconds < 0 ? 0 : seconds
  let s: any = Math.floor(seconds % 60)
  let m: any = Math.floor(seconds / 60 % 60)
  let h: any = Math.floor(seconds / 3600)
  // const gm = Math.floor(guide / 60 % 60)
  const gh = Math.floor(guide / 3600)

  if (isNaN(seconds) || seconds === Infinity)
    h = m = s = '-'

  h = ((h > 0) || (gh > 0)) ? `${h}:` : ''

  m = (m < 10) ? `0${m}:` : `${m}:`

  s = s < 10 ? `0${s}` : s

  return h + m + s
}

const handleMounted = (payload: any) => {
  // videojs.log('player mounted', payload)
}

const handleFullscreenEvent = () => {
  isFullscreen = window['_player_'].isFullscreen()

  const interactiveContent = document.querySelector('#refInteractive') as HTMLElement
  const helpContent = document.querySelector('#refHelper') as HTMLDivElement

  if (interactiveContent) {
    const iw = window.innerWidth
    const ih = window.innerHeight

    const scaleW = iw / 1120
    const scaleH = ih / 630

    // 화면 비율 유지하면서 최대한 크게
    const scale = Math.min(scaleW, scaleH)

    if (isFullscreen) {
      interactiveContent.style.transform = `scale(${scale})`
      interactiveContent.style.margin = 'calc(-1 * 630px / 2) calc(-1 * 1120px / 2)'
      interactiveContent.style.left = '50%'
      interactiveContent.style.top = '50%'
    }
    else {
      interactiveContent.style.transform = 'scale(1)'
      interactiveContent.style.margin = '0'
      interactiveContent.style.left = 'auto'
      interactiveContent.style.top = 'auto'
    }
  }

  if (helpContent) {
    const iw = window.innerWidth

    const scale = iw / 1120

    if (isFullscreen) {
      helpContent.style.transform = `scale(${scale})`
      helpContent.style.transformOrigin = 'left center'
      helpContent.style.left = '0'
      helpContent.classList.add('fullscreen')
    }
    else {
      helpContent.style.transform = 'scale(1)'
      helpContent.classList.remove('fullscreen')
    }
  }

  const scriptContent = document.querySelector('#refScript') as HTMLElement

  if (scriptContent) {
    if (isFullscreen)
      scriptContent.classList.add('fullscreen')
    else
      scriptContent.classList.remove('fullscreen')
  }
}

const handleEvent = (log: any) => {
  switch (log.type) {
    case 'volumechange':
      setTimeout(() => {
        if (player.value.muted()) {
          console.log(player.value.muted())
          window.parent['_VOLUME_'] = 0
        }
        else {
          window.parent['_VOLUME_'] = player.value.volume()
        }
      }, 50)
      break
    case 'ratechange':
      setTimeout(() => {
        const _item = document.querySelector('.vjs-playback-rate-value') as HTMLDivElement
        changeRateText(_item)
      }, 0)
      break
  }
}

const handleUptimeEvent = (currentTime: number) => {
  if (currentTime > 1)
    isPlayed.value = true
  if (currentTime > 7 && refSkip.value) {
    refSkip.value.classList.add('animate__flipOutX')
    refSkip.value = null
  }
}

const skipIntro = () => {
  player.value.currentTime(16)
  refSkip.value.classList.add('animate__flipOutX')
  setTimeout(() => {
    refSkip.value = null
  }, 2000)
}

// const handleHelpClick = () => {
//   const elHelp = document.querySelector('#refHelper') as HTMLElement
//   if (showHelp.value) {
//     elHelp.classList.add('animate__fadeOut')
//     setTimeout(() => {
//       showHelp.value = !showHelp.value
//
//       setTimeout(() => {
//         if (showHelp.value) {
//           if (player.value.paused()) {
//             // player.value.play()
//             lastPlayed.value = false
//           }
//           else {
//             player.value.pause()
//             lastPlayed.value = true
//           }
//         }
//         else {
//           if (lastPlayed.value)
//             player.value.play()
//         }
//       }, 10)
//     }, 1000)
//   }
//   else {
//     showHelp.value = !showHelp.value
//
//     setTimeout(() => {
//       if (showHelp.value) {
//         if (player.value.paused()) {
//           // player.value.play()
//           lastPlayed.value = false
//         }
//         else {
//           player.value.pause()
//           lastPlayed.value = true
//         }
//       }
//       else {
//         if (lastPlayed.value)
//           player.value.play()
//       }
//     }, 10)
//   }
// }

const handleKeyControl = (e: any) => {
  if (player.value) {
    switch (e.code) {
      case 'ArrowLeft':
        // eslint-disable-next-line no-case-declarations
        let rewindTime = player.value.currentTime() - 5
        if (rewindTime < 0)
          rewindTime = 0
        if (props.currentPage !== 3)
          player.value.currentTime(rewindTime)
        break
      case 'ArrowRight':
        // eslint-disable-next-line no-case-declarations
        let forwardTime = player.value.currentTime() + 5
        if (forwardTime > player.value.duration())
          forwardTime = player.value.duration() - 0.01
        if (props.currentPage !== 3)
          player.value.currentTime(forwardTime)
        break
      case 'ArrowUp':
        openScript.value = true
        break
      case 'ArrowDown':
        openScript.value = false
        break
      case 'Space':
        if (props.currentPage !== 3)
          player.value.paused() ? player.value.play() : player.value.pause()
        break
      case 'PageUp':
        emit('handlePrev')
        break
      case 'PageDown':
        emit('handleNext')
        break
    }
  }
}

const changePage = (target: number) => {
  console.log(target)
  if (props.currentPage as number !== target) {
    studyStore.changePage(target)
    emit('handleChangePage', target)
  }
}

// const toggleBookmark = (e: any) => {
//   showBookmark.value = !showBookmark.value
//   const _target = e.target as HTMLButtonElement
//   const elBookmark = document.querySelector('#bookmark-lists') as HTMLUListElement
//   if (_target.classList.contains('active')) {
//     _target.classList.remove('active')
//     elBookmark.classList.remove('animate__flipInX')
//     elBookmark.classList.add('animate__flipOutX')
//   }
//   else {
//     _target.classList.add('active')
//     elBookmark.classList.remove('d-none')
//     elBookmark.classList.remove('animate__flipOutX')
//     elBookmark.classList.add('animate__flipInX')
//   }
// }

// const handleSeek = (target: number) => {
//   player.value.currentTime(target)
// }

const handleResizeContent = () => {
  clearTimeout(timer)
  // console.log(elBody.clientWidth)
  timer = setTimeout(() => {
    // console.log('resize')
    const interactiveContent = document.querySelector('#refInteractive') as HTMLDivElement

    const iw = elBody.clientWidth

    const scale = iw / 1120

    const elContentApp = document.querySelector('#content-app') as HTMLDivElement
    const elSkipButton = document.querySelector('#btn-skip') as HTMLButtonElement
    const elVideoJs = document.querySelector('.video-js.videoPlayer-dimensions') as HTMLDivElement
    const elVideoControlBar = document.querySelector('.vjs-control-bar') as HTMLDivElement
    const elChapterTitle = document.querySelector('.step-title') as HTMLParagraphElement
    const elCourseTitle = document.querySelector('#course-title') as HTMLDivElement
    const elChapterTitleGroup = document.querySelector('#chapter-title') as HTMLDivElement
    const elIndexOpen = document.querySelector('#index-open') as HTMLButtonElement
    const elMenu = document.querySelector('#index-menu ul#index-list') as HTMLUListElement
    const elMenuLists = document.querySelectorAll('#index-menu ul#index-list > li')

    // console.log(elBody.clientWidth < 1120)
    // console.log(scale)
    if (elBody.clientWidth < 1120) {
      if (interactiveContent)
        interactiveContent.style.transform = `scale(${scale})`

      if (elSkipButton) {
        elSkipButton.style.backgroundSize = `${140 * scale}px ${140 * scale}px`
        elSkipButton.style.bottom = `calc(50% - ${320 * scale}px)`
        elSkipButton.style.right = `calc(50% - ${640 * scale}px)`
      }

      // elContentApp.style.transform = `scale(${scale})`
      // elContentApp.style.transformOrigin = '0 50%'
      elVideoJs.style.width = `${1120 * scale}px`
      elVideoControlBar.style.width = '100%'
      // elChapterNumber.style['fontSize'] = `${20 * scale}px`
      elChapterTitle.style['fontSize'] = `${24 * scale}px`
      // elChapterNumber.style.padding = `${10 * scale}px`
      elChapterTitle.style.padding = `${10 * scale}px`
      // elChapterNumber.style.lineHeight = `${40 * scale}px`
      elChapterTitle.style.lineHeight = `${40 * scale}px`
      elCourseTitle.style.backgroundSize = `${160 * scale}px ${120 * scale}px`
      elCourseTitle.style.width = `${160 * scale}px`
      elCourseTitle.style.height = `${120 * scale}px`
      elCourseTitle.style.right = '0'
      elCourseTitle.style.top = '0'
      elChapterTitleGroup.style.left = '0'
      elChapterTitleGroup.style.top = '0'
      // elMenu.style.transform = `scale(${scale})`
      elMenu.style.backgroundSize = `${1120 * scale}px ${210 * scale}px`
      elMenu.style.height = `${210 * scale}px`
      elMenu.style.paddingLeft = `${20 * scale}px`
      elIndexOpen.style.backgroundSize = `${90 * scale}px ${30 * scale}px`
      elIndexOpen.style.top = `calc(50% - ${390 * scale}px)`
      // elIndexOpen.style.width = `${90 * scale}px`
      // elIndexOpen.style.height = `${30 * scale}px`
      elMenuLists.forEach((elem) => {
        const elList = elem as HTMLLIElement
        elList.style.backgroundSize = `${300 * scale}px ${150 * scale}px`
        elList.style.width = `${300 * scale}px`
        elList.style.height = `${150 * scale}px`
        elList.style.marginTop = `${22 * scale}px`
        // elList.style.marginTop = `calc(${630 * scale}px - ${167 * scale}px)`
        // elList.style.marginTop = `calc(${553 * scale}px - ${630 / 2 * scale}px)`
        // elList.style.marginTop = `calc(${630 * scale}px - ${150 * scale}px - ${17 * scale}px)`
        elList.style.marginRight = `${15 * scale}px`
      })
    }
    else {
      if (interactiveContent)
        interactiveContent.style.transform = 'scale(1)'

      if (elSkipButton) {
        elSkipButton.style.backgroundSize = '140px 140px'
        elSkipButton.style.bottom = 'calc(50% - 315px)'
        elSkipButton.style.right = 'calc(50% - 560px)'
      }

      // elVideo.style.transform = 'none'
      elVideoJs.style.width = '1120px'
      if (isFullscreen)
        elVideoControlBar.style.width = '100%'
      else
        elVideoControlBar.style.width = '1120px'
      elContentApp.style.transform = 'scale(1)'
      elChapterTitle.style['fontSize'] = '24px'
      // elChapterNumber.style.padding = '10px'
      elChapterTitle.style.padding = '5px 10px'
      // elChapterNumber.style.lineHeight = '40px'
      elChapterTitle.style.lineHeight = '40px'
      elCourseTitle.style.backgroundSize = '280px 50px'
      elCourseTitle.style.width = '300px'
      elCourseTitle.style.height = '60px'
      elCourseTitle.style.right = '0px'
      // 'calc(50% - 1120px / 2)'
      elCourseTitle.style.top = '0px'
      // 'calc(50% - 630px / 2)'
      elChapterTitleGroup.style.left = 'calc(50% - 1120px / 2)'
      elChapterTitleGroup.style.top = 'calc(50% - 630px / 2)'
      // elMenu.style.transform = 'scale(1)'
      elMenu.style.backgroundSize = '1120px 184px'
      elMenu.style.height = '184px'
      elMenu.style.paddingLeft = '20px'
      // elIndexOpen.style.backgroundSize = '90px 30px'
      // elIndexOpen.style.top = 'top: calc(50% - 390px)'
      // elIndexOpen.style.width = '90px'
      // elIndexOpen.style.height = '30px'
      elMenuLists.forEach((elem) => {
        const elList = elem as HTMLLIElement
        elList.style.backgroundSize = 'contain'
        elList.style.width = '132px'
        elList.style.height = '132px'
        elList.style.marginTop = '19px'
        // elList.style.marginTop = '553px'
        elList.style.marginRight = '15px'
      })
    }
  }, 50)
}

onMounted(() => {
  player.value = videojs('videoPlayer', videoOptions)
  window['_player_'] = player.value
  const fullscreen = player.value.controlBar.getChild('FullscreenToggle')
  const index = player.value.controlBar.children().indexOf(fullscreen)

  const playButton = player.value.controlBar.getChild('PlayToggle')
  const playIndex = player.value.controlBar.children().indexOf(playButton)
  // console.log(playButton)

  const replayButton = player.value.controlBar.addChild('button', {}, playIndex + 1)

  const infoButton   = player.value.controlBar.addChild('button', {}, 0)
  // const scriptButton = player.value.controlBar.addChild('button', {}, index + 2)
  const prevButton   = player.value.controlBar.addChild('button', {}, index + 3)
  const currentPage  = player.value.controlBar.addChild('button', {}, index + 4)
  const pageDivider  = player.value.controlBar.addChild('button', {}, index + 5)
  const totalPage    = player.value.controlBar.addChild('button', {}, index + 6)
  const nextButton   = player.value.controlBar.addChild('button', {}, index + 7)

  const replayButtonDom = replayButton.el()

  const infoButtonDom   = infoButton.el()
  // const scriptButtonDom = scriptButton.el()
  const prevButtonDom   = prevButton.el()
  const currentPageDom  = currentPage.el()
  const pageDividerDom  = pageDivider.el()
  const totalPageDom    = totalPage.el()
  const nextButtonDom   = nextButton.el()

  let changePageButton = false
  // let isOpenScriptBox = false

  player.value.on('ended', () => {
    // player.value.controlBar.playToggle.hide()
  })

  replayButtonDom.classList.add('v-btn', 'mdi', 'mdi-replay')
  replayButtonDom.style = 'font-size: 28px;'

  // infoButtonDom.classList.add('v-btn', 'mdi', 'mdi-information-outline')
  infoButtonDom.innerText = 'INDEX'
  infoButtonDom.style = 'font-size: 20px; padding-left: 5px; line-height: 34px;'
  // scriptButtonDom.classList.add('v-btn', 'mdi', 'mdi-text-long')

  prevButtonDom.classList.add('v-btn', 'mdi', 'mdi-arrow-left')

  currentPageDom.innerHTML = `<span class="w-1-em fm-jetbrains font-weight-bold fs-1_25">${props.currentPage}</span>`
  currentPageDom.classList.remove('vjs-button')
  currentPageDom.ariaDisabled = true

  pageDividerDom.innerHTML = '<span class="w-1-em mdi mdi-power-on"></span>'
  pageDividerDom.classList.remove('vjs-button')
  pageDividerDom.ariaDisabled = true

  totalPageDom.innerHTML = `<span class="w-1-em fm-jetbrains font-weight-bold fs-1_25">${props.totalPages}</span>`
  totalPageDom.classList.remove('vjs-button')
  totalPageDom.ariaDisabled = true

  nextButtonDom.classList.add('v-btn', 'mdi', 'mdi-arrow-right')

  replayButton.addClass('w-1-em')
  infoButton.addClass('w-4-em')
  // scriptButton.addClass('w-3-em')
  prevButton.addClass('w-2-5-em')
  currentPage.addClass('w-1-5-em')
  pageDivider.addClass('w-1-5-em')
  totalPage.addClass('w-1-5-em')
  nextButton.addClass('w-1-5-em')
  nextButton.addClass('mr-1-em')

  replayButtonDom.onclick = replayButtonDom.ontouchstart = () => {
    player.value.currentTime(0)
    player.value.play()
  }

  infoButtonDom.onclick = infoButtonDom.ontouchstart = () => {
    // handleHelpClick()
    showIndex.value = !showIndex.value
  }

  // scriptButtonDom.onclick = scriptButtonDom.ontouchstart = () => {
  //   if (isOpenScriptBox)
  //     return false
  //
  //   if (openScript.value) {
  //     isOpenScriptBox = true
  //     const elScriptArea = document.querySelector('#script-area') as HTMLDivElement
  //     elScriptArea.classList.add('animate__flipOutX')
  //     setTimeout(() => {
  //       elScriptArea.classList.remove('animate__flipOutX')
  //       openScript.value = false
  //       isOpenScriptBox = false
  //     }, 500)
  //   }
  //   else {
  //     openScript.value = true
  //   }
  // }

  prevButtonDom.onclick = prevButtonDom.ontouchstart = () => {
    if (!changePageButton) {
      setTimeout(() => {
        emit('handlePrev')
        changePageButton = false
      }, 100)
      changePageButton = true
    }
  }
  nextButtonDom.onclick = nextButtonDom.ontouchstart = () => {
    if (!changePageButton) {
      setTimeout(() => {
        emit('handleNext')
        changePageButton = false
      }, 100)
      changePageButton = true
    }
  }

  videojs.setFormatTime(customTimeFormat)

  const defaultItem = document.querySelector('.vjs-playback-rate-value') as HTMLDivElement
  changeRateText(defaultItem)

  const menuItems = document.querySelectorAll('.vjs-menu-item-text')
  menuItems.forEach((item) => {
    const _item = item as HTMLSpanElement
    changeRateText(_item)
  })

  document.addEventListener('fullscreenchange',       handleFullscreenEvent)
  document.addEventListener('webkitfullscreenchange', handleFullscreenEvent)
  document.addEventListener('onfullscreenchange',     handleFullscreenEvent)

  const controlBar = document.querySelector('.video-js .vjs-control-bar') as HTMLDivElement
  if (window.innerWidth < 1120)
    controlBar.setAttribute('style', 'width: 100%; background-color: rgba(0, 0, 0, 0.75);')

  setTimeout(() => {
    const elScript = document.querySelector('#refScript') as HTMLDivElement
    const elHelper = document.querySelector('#refHelper') as HTMLDivElement
    const elVideo = document.querySelector('#videoPlayer') as HTMLVideoElement
    // elVideo.appendChild(elScript)
    // elVideo.appendChild(elHelper)
    elBody.addEventListener('keydown', handleKeyControl)
    // window.addEventListener('resize', handleResizeContent)
    window['_currentChapter'] = props.courseInfo.chapterNumber
    const elTitle = document.querySelector('title') as HTMLTitleElement
    elTitle.text = `${props.courseInfo.courseName} : ${props.courseInfo.chapterNumber}차시. ${props.courseInfo.chapterTitle}`
  }, 100)
  setTimeout(() => {
    isReady.value = true
  }, 500)
  setTimeout(() => {
    hasMounted.value = true
  }, 1000)

  setTimeout(() => {
    if (window.parent['_VOLUME_'] !== undefined) {
      if (window.parent['_VOLUME_'] === 0)
        player.value.volume(0)

      else
        player.value.volume(window.parent['_VOLUME_'])
    }
  }, 1)
  handleResizeContent()
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.dispose()
    player.value = null
  }
})
</script>

<template>
  <video
    id="videoPlayer"
    ref="refPlayer"
    class="video-js"
    :class="(isAudio) ? 'is-audio' : ''"
    poster=""
    data-setup="{}"
    playsinline
    @loadedmetadata="handleMounted"
    @ready="handleEvent($event)"
    @play="handleEvent($event)"
    @pause="handleEvent($event)"
    @ended="handleEvent($event)"
    @loadeddata="handleEvent($event)"
    @waiting="handleEvent($event)"
    @playing="handleEvent($event)"
    @canplay="handleEvent($event)"
    @canplaythrough="handleEvent($event)"
    @volumechange="handleEvent($event)"
    @ratechange="handleEvent($event)"
    @timeupdate="handleUptimeEvent(player?.currentTime())"
  />
  <button v-if="currentPage === 1" id="btn-skip" ref="refSkip" class="animate__animated animate__flipInX" :class="!isPlayed ? 'hidden' : ''" @click="skipIntro">
    skip
  </button>

  <Teleport v-if="isPlayed" to="#refInteractive">
    <v-row v-if="pageInfo[currentPage - 1].showChapter" id="fixedChapter" class="ma-0 area-chapter animate__animated animate__flipInX" :class="!isPlayed ? 'hidden' : ''">
      <v-col>
        <p>{{ chapterTitle }}</p>
      </v-col>
    </v-row>
  </Teleport>

  <div id="index-menu">
    <!-- <div id="chapter-title" :class="(currentPage === 1) ? 'animate__animated animate__backInLeft animate__delay-1s' : 'animate__animated animate__fadeIn animate__delay-0_2s'"> -->
    <div id="chapter-title" class="hidden">
      <p class="step-title">
      <!--        {{ courseInfo.chapterNumber }}. -->
      <!--        {{ courseInfo.chapterTitle }} -->
      </p>
    </div>
    <!-- <div id="course-title" :class="(currentPage === 1) ? 'animate__animated animate__backInRight' : 'animate__animated animate__fadeIn animate__delay-0_2s'"> -->
    <div id="course-title" class="animate__animated animate__fadeIn animate__delay-0_2s">
      {{ courseInfo.courseName }}
    </div>
    <!-- <button id="index-open" class="animate__animated animate__fadeInUp animate__faster animate__delay-1s" @click="showIndex = !showIndex"> -->
    <!--   index -->
    <!-- </button> -->
    <ul id="index-list" class="animate__animated" :class="(!isReady || !showIndex) ? 'animate__slideOutDown' : (showIndex ? 'animate__slideInUp' : 'animate__slideOutDown')" :style="{ visibility: !hasMounted ? 'hidden' : 'visible' }">
      <!-- <li id="page-1" class="main-index" :class="(pageInfo[currentPage - 1].category === '1') ? 'active' : ''" @click="changePage(Number(courseInfo.subMenu1))"> -->
      <li id="page-1" class="main-index" :class="(pageInfo[currentPage - 1].category === '1') ? 'active' : ''">
        <ul id="sub-index-group-1" class="sub-index-group">
          <template v-for="page in props.pageInfo" :key="page">
            <li v-if="page.category === '1'" :class="Number(page.seq) === currentPage ? 'active' : ''" @click="changePage(Number(page.seq))" v-html="`•${page.title}`" />
          </template>
        </ul>
      </li>
      <!-- <li id="page-2" class="main-index" :class="(pageInfo[currentPage - 1].category === '2') ? 'active' : ''" @click="changePage(Number(courseInfo.subMenu2))"> -->
      <li id="page-2" class="main-index" :class="(pageInfo[currentPage - 1].category === '2') ? 'active' : ''">
        <ul id="sub-index-group-2" class="sub-index-group">
          <template v-for="page in props.pageInfo" :key="page">
            <li v-if="page.category === '2'" :class="Number(page.seq) === currentPage ? 'active' : ''" @click="changePage(Number(page.seq))" v-html="`•${page.title}`" />
          </template>
        </ul>
      </li>
      <!-- <li id="page-3" class="main-index" :class="(pageInfo[currentPage - 1].category === '3') ? 'active' : ''" @click="changePage(Number(courseInfo.subMenu3))"> -->
      <li id="page-3" class="main-index" :class="(pageInfo[currentPage - 1].category === '3') ? 'active' : ''">
        <ul id="sub-index-group-3" class="sub-index-group">
          <template v-for="page in props.pageInfo" :key="page">
            <li v-if="page.category === '3'" :class="Number(page.seq) === currentPage ? 'active' : ''" @click="changePage(Number(page.seq))" v-html="`•${page.title}`" />
          </template>
        </ul>
      </li>
    </ul>
    <button v-if="showIndex" id="index-close" class="animate__animated animate__fadeIn animate__delay-1s animate__fadeIn" @click="showIndex = false">
      close
    </button>
  </div>

  <v-container id="refScript" class="w-100 ma-0 pa-0 script-container">
    <v-row class="ma-0 area-question">
      <v-col id="script-area" :ref="refScriptArea" cols="1" class="pa-0 d-flex align-end animate__animated" :class="openScript ? 'animate__flipInX' : ''">
        <div v-if="openScript" id="text-area">
          <p v-html="scriptText" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
* {
  user-select: none;
  -webkit-user-drag: none;
}
.area-chapter {
  position: absolute;
  top: calc(50% - 314px);
  left: calc(50% - 429px); // 챕터이름 왼쪽으로 조정 숫자가 클수록 왼쪽
  z-index: 9999;
  background: transparent url(@/assets/img/top/shape.png) no-repeat center center;
  background-size: contain;
  width: 290px; // shape.png 배경 너비
  height: 80px; // shape.png 배경 높이
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    font-family: 'Paperlogy-5Medium', sans-serif;
    font-size: 18px; // 챕터이름 크기
    font-weight: 200;
    letter-spacing: -1px;
    margin-left: 0;
    margin-top: 0;
    word-break: keep-all;
    color: #000000; // 챕터이름 색상
    text-align: center;
    //text-shadow: 2px 2px 2px #302495;
  }
}
.video-js.vjs-has-started .vjs-tech {
  pointer-events: none;
}
.script-container {
  max-width: 1120px;
  z-index: 9999;
}
#script-area {
  max-width: 1120px;
  width: 1120px;
  position: fixed;
  bottom: 0;
  padding: 20px 20px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(100px);
  border-radius: 10px 10px 0 0;
  #text-area {
    margin: 20px;
    max-height: 9em;
    min-height: 1.5em;
    font-family: 'Paperlogy-5Medium', serif;
    font-size: 20px;
    line-height: 1.5em;
    color: #fff;
    word-break: keep-all;
    overflow-y: auto;
    padding-right: 20px;
    &::-webkit-scrollbar {
      width: 10px;
      background-color: rgba(0, 0, 0, 0.75);
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ff80ab;
      border-radius: 100px;
    }
    &::-webkit-scrollbar-track {
      background-color: rgba(0, 0, 0, 0.75);
      border-radius: 0;
    }
  }
}
#btn-skip {
  position: absolute;
  bottom: calc(50% - 360px);
  right: calc(50% - 640px);
  background: transparent url(@/assets/img/common/skipBtn.png) no-repeat 0 0;
  width: 140px;
  height: 140px;
  transition: background 500ms ease-in-out;
  text-indent: -9999em;
  &:hover {
    background: transparent url(@/assets/img/common/skipBtnOver.png) no-repeat 0 0;
  }
}
#bookmark {
  position: absolute;
  width: 1120px;
  height: 630px;
  button {
    position: absolute;
    top: -10px;
    right: -64px;
    //background: transparent url(@/assets/img/common/BookmarkBg1.png) no-repeat 0 0;
    width: 365px;
    height: 64px;
    text-indent: -9999em;
    transition: background 300ms ease-in-out;
    &:hover {
      //background: transparent url(@/assets/img/common/BookmarkBg1Over.png) no-repeat 0 0;
    }
    &.active {
      //background: transparent url(@/assets/img/common/BookmarkBg2.png) no-repeat 0 0;
    }
  }
  ul {
    position: absolute;
    width: 294px;
    right: 0;
    top: 48px;
    padding: 10px 0;
    background-color: rgba(255, 255, 255, 0.75);
    box-shadow: #ccc -1px 2px 8px 0px;
    border-radius: 4px;
    li {
      list-style: none;
      padding: 6px 18px;
      font-family: "Paperlogy-5Medium", serif;
      font-size: 18px;
      font-weight: 700;
      transition: color 300ms ease-in-out;
      word-break: keep-all;
      margin-left: 15px;
      letter-spacing: -1px;
      &:before {
        content: '';
        margin-left: -26px;
        padding-left: 8px;
      }
      &:hover {
        color: rgb(255, 51, 0);
        cursor: pointer;
      }
    }
  }
}

#chapter-title {
  position: fixed;
  //top: 20px;
  //left: 20px;
  font-family: "Source Sans Pro", sans-serif;
  color: #fff;
  padding: 0 5px;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  p {
    display: inline-block;
    font-weight: 400;
    line-height: 20px;
    vertical-align: middle;
    padding: 0 10px;
    &.step-number {
      //background-color: rgba(172, 54, 76, 1.0);
      font-size: 20px;
    }
    &.step-title {
      //background-color: rgba(214, 101, 121, 1.0);
      font-size: 24px;
    }
    &.current-chapter {
      margin-left: 10px;
      font-size: 30px;
    }
  }
}

#course-title {
  position: fixed;
  // TODO 과정명
  //background: transparent url(@/assets/img/top/contentsTitle.png) no-repeat 0 0;
  width: 300px;
  height: 60px;
  background-size: 300px 60px !important;
  text-indent: -9999em;
}

#index-menu {
  position: absolute;
  overflow: hidden;
  width: 1120px;
  height: 630px;
  pointer-events: none;
  z-index: 9;
  button#index-open {
    position: fixed;
    //background: transparent url(@/assets/img/index/indexBtn.png) no-repeat 0 0;
    width: 90px;
    height: 30px;
    text-indent: -9999em;
    top: calc(50% - 390px);
    pointer-events: all;
    &:hover {
      //background: transparent url(@/assets/img/index/indexBtnOver.png) no-repeat 0 0;
    }
  }
  button#index-close {
    position: absolute;
    background: transparent url(@/assets/img/index/indexCloseBtn.png) no-repeat 0 0;
    width: 50px;
    height: 50px;
    text-indent: -9999em;
    top: 446px;
    right: 0;
    pointer-events: all;
    transition: transform .3s ease-in-out;
    &:hover {
      background: transparent url(@/assets/img/index/indexCloseBtnOver.png) no-repeat 0 0;
      transform: rotate(180deg);
    }
  }
  ul#index-list {
    background: transparent url(@/assets/img/index/indexBg.png) no-repeat left bottom;
    background-size: contain;
    padding-left: 20px;
    width: 1120px;
    height: 184px;
    position: absolute;
    bottom: 0;
    li.main-index {
      width: 150px;
      height: 150px;
      line-height: 30px;
      list-style: none;
      display: inline-block;
      margin-top: 22px;
      margin-right: 15px;
      cursor: pointer;
      //background: transparent url(@/assets/img/index/index_empty.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
      pointer-events: all;
    }
    li#page-1.active, li#page-1:hover {
      background: transparent url(@/assets/img/index/index_1.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
    }
    li#page-2.active, li#page-2:hover {
      background: transparent url(@/assets/img/index/index_2.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
    }
    li#page-3.active, li#page-3:hover {
      background: transparent url(@/assets/img/index/index_3.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
    }
    li#page-4.active, li#page-4:hover {
      //background: transparent url(@/assets/img/index/index_4.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
    }
    ul.sub-index-group {
      margin-top: 10px;
      margin-left: 135px;
      position: absolute;
      width: 180px;
      li {
        list-style: none;
        font-family: 'Paperlogy-5Medium', serif;
        font-weight: 400;
        font-size: 22px;
        color: #135db7;
        max-width: 300px;
        transition: all 200ms ease-in-out;
        &:hover, &.active {
          background-color: #135db7;
          border-radius: 0;
          color: #fff;
        }
      }
    }
    li#page-1 {
      position: absolute;
      left: 29px;
    }
    li#page-2 {
      position: absolute;
      left: 345px;
      ul {
        li {
          width: 360px;
        }
      }
    }
    li#page-3 {
      position: absolute;
      left: 805px;
    }
  }
}

#refHelper {
  z-index: 9999;
  position: absolute;
  width: 1120px;
  max-width: 1120px;
  height: 630px;
  background-color: transparent;

  button#help-close {
    position: absolute;
    //background: transparent url(@/assets/img/index/indexCloseBtn.png) no-repeat 0 0;
    width: 30px;
    height: 30px;
    text-indent: -9999em;
    top: 5px;
    right: 10px;
    pointer-events: all;
    z-index: 999;
    &:hover {
      //background: transparent url(@/assets/img/index/indexCloseBtnOver.png) no-repeat 0 0;
    }
  }

  .v-window {
    overflow-x: visible;
  }

  .helper-container {
    width: 1120px;
    height: 630px;
  }
  .help-display {
    width: 1120px;
    height: 630px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .help-menu-group {
    margin: 40px 0 40px -190px;
  }
  .help-menu {
    width: 180px;
    height: 150px;
    text-indent: -9999em;
    margin: 5px 0;
    transition: background 300ms ease-in-out;
  }
  #menu1 {
    //background: transparent url(@/assets/img/help/menu1.png) no-repeat 0 0;
    &.v-tab--selected {
      //background: transparent url(@/assets/img/help/menu1Over.png) no-repeat 0 0;
    }
  }
  #menu2 {
    //background: transparent url(@/assets/img/help/menu2.png) no-repeat 0 0;
    &.v-tab--selected {
      //background: transparent url(@/assets/img/help/menu2Over.png) no-repeat 0 0;
    }
  }
  #menu3 {
    //background: transparent url(@/assets/img/help/menu3.png) no-repeat 0 0;
    &.v-tab--selected {
      //background: transparent url(@/assets/img/help/menu3Over.png) no-repeat 0 0;
    }
  }
  #menu4 {
    //background: transparent url(@/assets/img/help/menu4.png) no-repeat 0 0;
    &.v-tab--selected {
      //background: transparent url(@/assets/img/help/menu4Over.png) no-repeat 0 0;
    }
  }
  #help_1 {
    //background: transparent url(@/assets/img/help/help_1.png) no-repeat 0 0;
  }
  #help_2 {
    //background: transparent url(@/assets/img/help/help_2.png) no-repeat 0 0;
  }
  #help_3 {
    //background: transparent url(@/assets/img/help/help_3.png) no-repeat 0 0;

    #roadmap-lists {
      //margin-left: 90px;
      margin: 200px 200px 0 100px;
      .v-col {
        padding: 8px 0;
      }
    }

    #downloadAll {
      position: absolute;
      top: 136px;
      left: 520px;
      width: 250px;
      height: 50px;
      text-indent: -9999em;
      //background: transparent url(@/assets/img/help/btnAllDown.png) no-repeat 0 0;
      transition: background 300ms ease-in-out;
      &:hover {
        //background: transparent url(@/assets/img/help/btnAllDownOver.png) no-repeat 0 0;
      }
    }

    .chapter-sheet {
      font-family: 'SBAggroM', serif;
      font-size: 18px;
      color: #ffe2e8;
      background-color: transparent;
      padding: 5px;
      float: left;
      &.active {
        background-color: #e24a87;
      }
      span {
        display: inline-block;
      }
      span.number {
        color: #494178;
        background-color: #ffe2e8;
        width: 2em;
        height: 30px;
        line-height: 30px;
        padding-top: 1px;
        text-align: center;
        margin-right: 10px;
      }
      span.title {
        height: 30px;
        line-height: 30px;
      }
      span.download {
        margin-left: 10px;
        width: 30px;
        button {
          position: absolute;
          width: 30px;
          height: 40px;
          //background: transparent url(@/assets/img/help/btnDown.png) no-repeat 0 0;
          text-indent: -9999em;
          margin-top: -25px;
          transition: background 300ms ease-in-out;
          &:hover {
            //background: transparent url(@/assets/img/help/btnDownOver.png) no-repeat 0 0;
          }
        }
      }
    }
  }
  #help_4 {
    //background: transparent url(@/assets/img/help/help_4.png) no-repeat 0 0;
  }
}

.dimCover {
  position: absolute;
  z-index: 999;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
