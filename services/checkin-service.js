const storage = require('./storage')
const dateUtil = require('../utils/date')

const CHECKIN_PREFIX = 'fitlog_checkin_'

const CheckinService = {
  getCheckinKey(date) {
    return CHECKIN_PREFIX + date
  },

  getCheckin(date) {
    return storage.get(this.getCheckinKey(date)) || null
  },

  getTodayCheckin() {
    return this.getCheckin(dateUtil.getToday())
  },

  initCheckin(date, dayPlan) {
    if (!dayPlan || dayPlan.isRestDay) return null

    const record = {
      date,
      dayName: dayPlan.name,
      exercises: dayPlan.exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        sets: Array.from({ length: ex.sets }, () => ({
          completed: false,
          actualReps: 0,
          actualWeight: '',
          completedAt: ''
        }))
      }))
    }
    storage.set(this.getCheckinKey(date), record)
    return record
  },

  toggleSet(date, exerciseId, setIndex) {
    const record = this.getCheckin(date)
    if (!record) return null

    const exercise = record.exercises.find(e => e.exerciseId === exerciseId)
    if (!exercise || !exercise.sets[setIndex]) return null

    const set = exercise.sets[setIndex]
    set.completed = !set.completed
    set.completedAt = set.completed ? new Date().toISOString() : ''

    storage.set(this.getCheckinKey(date), record)
    return record
  },

  updateSet(date, exerciseId, setIndex, data) {
    const record = this.getCheckin(date)
    if (!record) return null

    const exercise = record.exercises.find(e => e.exerciseId === exerciseId)
    if (!exercise || !exercise.sets[setIndex]) return null

    Object.assign(exercise.sets[setIndex], data)
    storage.set(this.getCheckinKey(date), record)
    return record
  },

  getProgress(date) {
    const record = this.getCheckin(date)
    if (!record) return { completed: 0, total: 0, percent: 0 }

    let completed = 0
    let total = 0
    record.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        total++
        if (set.completed) completed++
      })
    })

    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  },

  getMonthCheckins(year, month) {
    const result = {}
    const lastDay = new Date(year, month, 0).getDate()
    for (let d = 1; d <= lastDay; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const record = this.getCheckin(dateStr)
      if (record) {
        const progress = this.getProgress(dateStr)
        result[dateStr] = {
          hasRecord: true,
          ...progress
        }
      }
    }
    return result
  },

  isDateCheckedIn(date) {
    const progress = this.getProgress(date)
    return progress.completed > 0
  }
}

module.exports = CheckinService
