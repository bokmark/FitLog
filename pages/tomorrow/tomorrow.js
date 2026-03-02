const planService = require('../../services/plan-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    tomorrow: '',
    dayName: '',
    dayPlan: null,
    showMedia: false,
    currentMedia: null
  },

  onLoad() {
    this.loadData()
  },

  loadData() {
    const tomorrow = dateUtil.getTomorrow()
    const tomorrowDay = dateUtil.getTomorrowDayOfWeek()
    const dayName = dateUtil.DAY_NAMES[tomorrowDay]
    const dayPlan = planService.getTomorrowPlan()

    this.setData({ tomorrow, dayName, dayPlan })
  },

  onMediaTap(e) {
    const { media } = e.detail
    if (media) {
      this.setData({ showMedia: true, currentMedia: media })
    }
  },

  onCloseMedia() {
    this.setData({ showMedia: false, currentMedia: null })
  }
})
