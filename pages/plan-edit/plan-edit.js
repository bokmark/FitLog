const planService = require('../../services/plan-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    dayIndex: 0,
    dayName: '',
    dayPlan: null,
    isEditing: false
  },

  onLoad(options) {
    const dayIndex = parseInt(options.dayIndex) || 0
    const dayName = dateUtil.DAY_NAMES[dayIndex]
    this.setData({ dayIndex, dayName })
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const dayPlan = planService.getDayPlan(this.data.dayIndex)
    this.setData({
      dayPlan: dayPlan || { name: '', isRestDay: false, exercises: [] }
    })
  },

  onDayNameInput(e) {
    this.setData({ 'dayPlan.name': e.detail.value })
  },

  onSaveDayName() {
    const { dayIndex, dayPlan } = this.data
    planService.updateDayPlan(dayIndex, dayPlan)
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  onAddExercise() {
    wx.navigateTo({
      url: `/pages/exercise-edit/exercise-edit?dayIndex=${this.data.dayIndex}&mode=add`
    })
  },

  onEditExercise(e) {
    const exerciseId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/exercise-edit/exercise-edit?dayIndex=${this.data.dayIndex}&exerciseId=${exerciseId}&mode=edit`
    })
  },

  onDeleteExercise(e) {
    const exerciseId = e.currentTarget.dataset.id
    const exerciseName = e.currentTarget.dataset.name
    wx.showModal({
      title: '删除动作',
      content: `确定删除「${exerciseName}」吗？`,
      confirmColor: '#F44336',
      success: (res) => {
        if (res.confirm) {
          planService.deleteExercise(this.data.dayIndex, exerciseId)
          this.loadData()
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  onMoveUp(e) {
    const idx = e.currentTarget.dataset.index
    if (idx <= 0) return
    const exercises = [...this.data.dayPlan.exercises]
    const temp = exercises[idx]
    exercises[idx] = exercises[idx - 1]
    exercises[idx - 1] = temp
    planService.reorderExercises(this.data.dayIndex, exercises)
    this.loadData()
  },

  onMoveDown(e) {
    const idx = e.currentTarget.dataset.index
    const exercises = [...this.data.dayPlan.exercises]
    if (idx >= exercises.length - 1) return
    const temp = exercises[idx]
    exercises[idx] = exercises[idx + 1]
    exercises[idx + 1] = temp
    planService.reorderExercises(this.data.dayIndex, exercises)
    this.loadData()
  }
})
