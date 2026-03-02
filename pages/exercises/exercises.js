const planService = require('../../services/plan-service')

Page({
  data: {
    exercises: [],
    filteredExercises: [],
    keyword: '',
    totalCount: 0,
    showMedia: false,
    currentMedia: null
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const exercises = planService.getAllExercises()
    console.log('[Exercises] loaded', exercises.length, 'exercises')
    this.setData({
      exercises,
      filteredExercises: this.data.keyword
        ? exercises.filter(ex => ex.name.toLowerCase().includes(this.data.keyword))
        : exercises,
      totalCount: exercises.length
    })
  },

  onSearch(e) {
    const keyword = e.detail.value.trim().toLowerCase()
    if (!keyword) {
      this.setData({ keyword: '', filteredExercises: this.data.exercises })
      return
    }
    const filtered = this.data.exercises.filter(ex =>
      ex.name.toLowerCase().includes(keyword)
    )
    this.setData({ keyword, filteredExercises: filtered })
  },

  onClearSearch() {
    this.setData({ keyword: '', filteredExercises: this.data.exercises })
  },

  onExerciseTap(e) {
    const { id, day } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/exercise-edit/exercise-edit?dayIndex=${day}&exerciseId=${id}&mode=edit`
    })
  },

  onMediaTap(e) {
    const media = e.currentTarget.dataset.media
    if (media) {
      this.setData({ showMedia: true, currentMedia: media })
    }
  },

  onCloseMedia() {
    this.setData({ showMedia: false, currentMedia: null })
  }
})
