const planService = require('../../services/plan-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    exercises: [],
    filteredExercises: [],
    keyword: '',
    totalCount: 0,
    showMedia: false,
    currentMedia: null,
    showDayPicker: false,
    dayOptions: []
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
  },

  onAddTap() {
    const plan = planService.getActivePlan()
    if (!plan) {
      wx.showToast({ title: '请先创建训练计划', icon: 'none' })
      return
    }
    const dayNames = dateUtil.DAY_NAMES
    const dayOptions = []
    for (let d = 0; d < 7; d++) {
      const day = plan.days[d] || plan.days[String(d)]
      if (day && !day.isRestDay) {
        dayOptions.push({ dayIndex: d, label: dayNames[d] + (day.name ? '（' + day.name + '）' : '') })
      }
    }
    if (dayOptions.length === 0) {
      wx.showToast({ title: '所有天都是休息日', icon: 'none' })
      return
    }
    this.setData({ showDayPicker: true, dayOptions })
  },

  onPickDay(e) {
    const dayIndex = e.currentTarget.dataset.day
    this.setData({ showDayPicker: false })
    wx.navigateTo({
      url: `/pages/exercise-edit/exercise-edit?dayIndex=${dayIndex}&mode=add`
    })
  },

  onClosePicker() {
    this.setData({ showDayPicker: false })
  }
})
