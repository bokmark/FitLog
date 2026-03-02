const checkinService = require('../../services/checkin-service')
const dateUtil = require('../../utils/date')

Page({
  data: {
    currentYear: 0,
    currentMonth: 0,
    calendarDays: [],
    monthCheckins: {},
    selectedDate: '',
    selectedRecord: null,
    selectedProgress: null,
    weekHeaders: ['日', '一', '二', '三', '四', '五', '六'],
    today: ''
  },

  onShow() {
    const now = new Date()
    const today = dateUtil.getToday()
    this.setData({
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      today
    })
    this.loadCalendar()
  },

  loadCalendar() {
    const { currentYear, currentMonth } = this.data
    const calendarDays = dateUtil.getMonthDays(currentYear, currentMonth)
    const monthCheckins = checkinService.getMonthCheckins(currentYear, currentMonth)

    this.setData({ calendarDays, monthCheckins })
  },

  onPrevMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth--
    if (currentMonth < 1) {
      currentMonth = 12
      currentYear--
    }
    this.setData({ currentYear, currentMonth, selectedDate: '', selectedRecord: null })
    this.loadCalendar()
  },

  onNextMonth() {
    let { currentYear, currentMonth } = this.data
    currentMonth++
    if (currentMonth > 12) {
      currentMonth = 1
      currentYear++
    }
    this.setData({ currentYear, currentMonth, selectedDate: '', selectedRecord: null })
    this.loadCalendar()
  },

  onDayTap(e) {
    const date = e.currentTarget.dataset.date
    if (!date) return

    const record = checkinService.getCheckin(date)
    const progress = checkinService.getProgress(date)

    let displayRecord = null
    if (record) {
      displayRecord = {
        ...record,
        exercises: record.exercises.map(ex => ({
          ...ex,
          completedCount: ex.sets.filter(s => s.completed).length,
          totalCount: ex.sets.length
        }))
      }
    }

    this.setData({
      selectedDate: date,
      selectedRecord: displayRecord,
      selectedProgress: record ? progress : null
    })
  },

  getCheckinStatus(date) {
    const checkins = this.data.monthCheckins
    if (!checkins[date]) return ''
    if (checkins[date].percent === 100) return 'full'
    if (checkins[date].completed > 0) return 'partial'
    return ''
  }
})
