import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.min.css'

// VideoJs
import VueVideoPlayer from '@videojs-player/vue'
import 'video.js/dist/video-js.css'

import App from './App.vue'

import '@/styles/index.css'

const vuetify = createVuetify({
  defaults: {
    global: {
      ripple: false,
      elevation: 0,
    },
  },
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

declare global {
  interface Window {
    setCurrentPageNumber: any
  }
}

const app = createApp(App)

app.use(createPinia())

app.use(vuetify)

app.use(VueVideoPlayer)

app.mount('#app')
