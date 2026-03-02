const planService = require('../../services/plan-service')
const checkinService = require('../../services/checkin-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    today: '',
    dayName: '',
    dayIndex: 0,
    dayPlan: null,
    checkinRecord: null,
    progress: { completed: 0, total: 0, percent: 0 },
    showMedia: false,
    currentMedia: null,
    expandedIndex: 0
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const today = dateUtil.getToday()
    const dayName = dateUtil.getDayName()
    const dayIndex = dateUtil.getDayOfWeek()
    const dayPlan = planService.getTodayPlan()

    let checkinRecord = checkinService.getTodayCheckin()
    if (dayPlan && !dayPlan.isRestDay && !checkinRecord) {
      checkinRecord = checkinService.initCheckin(today, dayPlan)
    }

    const progress = checkinService.getProgress(today)

    this.setData({ today, dayName, dayIndex, dayPlan, checkinRecord, progress })
  },

  onSetToggle(e) {
    const { exerciseId, setIndex } = e.detail
    const record = checkinService.toggleSet(this.data.today, exerciseId, setIndex)
    if (record) {
      const progress = checkinService.getProgress(this.data.today)
      this.setData({ checkinRecord: record, progress })

      if (progress.percent === 100) {
        wx.showToast({ title: '今日训练完成！', icon: 'success' })
      }
    }
  },

  onSetUpdate(e) {
    const { exerciseId, setIndex, field, value } = e.detail
    const record = checkinService.updateSet(this.data.today, exerciseId, setIndex, { [field]: value })
    if (record) {
      this.setData({ checkinRecord: record })
    }
  },

  onMediaTap(e) {
    const { media } = e.detail
    if (media) {
      this.setData({ showMedia: true, currentMedia: media })
    }
  },

  onCloseMedia() {
    this.setData({ showMedia: false, currentMedia: null })
  },

  onGoTomorrow() {
    wx.navigateTo({ url: '/pages/tomorrow/tomorrow' })
  },

  onEditPlan() {
    wx.navigateTo({ url: `/pages/plan-edit/plan-edit?dayIndex=${this.data.dayIndex}` })
  },

  getCheckinForExercise(exerciseId) {
    const { checkinRecord } = this.data
    if (!checkinRecord) return null
    return checkinRecord.exercises.find(e => e.exerciseId === exerciseId) || null
  },

  onToggleExpand(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({
      expandedIndex: this.data.expandedIndex === idx ? -1 : idx
    })
  }
})
