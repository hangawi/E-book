import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStudyStore = defineStore({
  id: 'study',
  state: () => ({
    currentPage: ref(1),
    isCompleted: ref(false),
  }),
  actions: {
    changePage(page: number) {
      // console.log(page)
      this.currentPage = page
    },
    initStudy() {
      this.isCompleted = false
    },
    handleComplete() {
      this.isCompleted = true
    },
  },
})
