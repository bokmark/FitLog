const planService = require('../../services/plan-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    plan: null,
    dayNames: dateUtil.DAY_NAMES,
    todayIndex: 0
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const plan = planService.getActivePlan()
    const todayIndex = dateUtil.getDayOfWeek()
    this.setData({ plan, todayIndex })
  },

  onDayTap(e) {
    const dayIndex = e.currentTarget.dataset.day
    wx.navigateTo({
      url: `/pages/plan-edit/plan-edit?dayIndex=${dayIndex}`
    })
  },

  onToggleRestDay(e) {
    const dayIndex = e.currentTarget.dataset.day
    const plan = this.data.plan
    if (!plan) return

    const dayPlan = plan.days[dayIndex]
    if (!dayPlan) return

    dayPlan.isRestDay = !dayPlan.isRestDay
    if (dayPlan.isRestDay) {
      dayPlan.name = '休息日'
    } else if (dayPlan.name === '休息日') {
      dayPlan.name = ''
    }

    planService.updateDayPlan(dayIndex, dayPlan)
    this.loadData()
  },

  onGoAllExercises() {
    wx.navigateTo({ url: '/pages/exercises/exercises' })
  },

  onRenamePlan() {
    const plan = this.data.plan
    if (!plan) return

    wx.showModal({
      title: '修改计划名称',
      editable: true,
      placeholderText: '请输入计划名称',
      content: plan.name,
      success: (res) => {
        if (res.confirm && res.content) {
          plan.name = res.content.trim()
          planService.savePlan(plan)
          this.loadData()
        }
      }
    })
  }
})
