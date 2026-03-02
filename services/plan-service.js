const storage = require('./storage')
const dateUtil = require('../utils/date')

const PLAN_KEY = 'fitlog_plan'
const ACTIVE_PLAN_KEY = 'fitlog_active_plan_id'

const PlanService = {
  savePlan(plan) {
    const plans = this.getAllPlans()
    const idx = plans.findIndex(p => p.id === plan.id)
    if (idx >= 0) {
      plans[idx] = plan
    } else {
      plans.push(plan)
    }
    storage.set(PLAN_KEY, plans)
    return plan
  },

  getAllPlans() {
    return storage.get(PLAN_KEY) || []
  },

  getPlanById(id) {
    const plans = this.getAllPlans()
    return plans.find(p => p.id === id) || null
  },

  deletePlan(id) {
    const plans = this.getAllPlans().filter(p => p.id !== id)
    storage.set(PLAN_KEY, plans)
  },

  setActivePlanId(id) {
    storage.set(ACTIVE_PLAN_KEY, id)
  },

  getActivePlanId() {
    return storage.get(ACTIVE_PLAN_KEY) || null
  },

  getActivePlan() {
    const id = this.getActivePlanId()
    if (!id) return null
    return this.getPlanById(id)
  },

  getTodayPlan() {
    const plan = this.getActivePlan()
    if (!plan) return null
    const dayOfWeek = dateUtil.getDayOfWeek()
    return plan.days[dayOfWeek] || null
  },

  getTomorrowPlan() {
    const plan = this.getActivePlan()
    if (!plan) return null
    const dayOfWeek = dateUtil.getTomorrowDayOfWeek()
    return plan.days[dayOfWeek] || null
  },

  getDayPlan(dayIndex) {
    const plan = this.getActivePlan()
    if (!plan) return null
    return plan.days[dayIndex] || null
  },

  updateDayPlan(dayIndex, dayPlan) {
    const plan = this.getActivePlan()
    if (!plan) return false
    plan.days[dayIndex] = dayPlan
    this.savePlan(plan)
    return true
  },

  addExercise(dayIndex, exercise) {
    const plan = this.getActivePlan()
    if (!plan) return false
    if (!plan.days[dayIndex]) {
      plan.days[dayIndex] = { name: '', isRestDay: false, exercises: [] }
    }
    plan.days[dayIndex].exercises.push(exercise)
    this.savePlan(plan)
    return true
  },

  updateExercise(dayIndex, exerciseId, exerciseData) {
    const plan = this.getActivePlan()
    if (!plan || !plan.days[dayIndex]) return false
    const exercises = plan.days[dayIndex].exercises
    const idx = exercises.findIndex(e => e.id === exerciseId)
    if (idx < 0) return false
    exercises[idx] = { ...exercises[idx], ...exerciseData }
    this.savePlan(plan)
    return true
  },

  deleteExercise(dayIndex, exerciseId) {
    const plan = this.getActivePlan()
    if (!plan || !plan.days[dayIndex]) return false
    plan.days[dayIndex].exercises = plan.days[dayIndex].exercises.filter(e => e.id !== exerciseId)
    this.savePlan(plan)
    return true
  },

  reorderExercises(dayIndex, exercises) {
    const plan = this.getActivePlan()
    if (!plan || !plan.days[dayIndex]) return false
    plan.days[dayIndex].exercises = exercises
    this.savePlan(plan)
    return true
  },

  getAllExercises() {
    const plan = this.getActivePlan()
    if (!plan || !plan.days) return []
    const dayNames = dateUtil.DAY_NAMES
    const result = []
    const seen = {}

    for (let d = 0; d < 7; d++) {
      const day = plan.days[d] || plan.days[String(d)]
      if (!day || day.isRestDay) continue
      const exercises = day.exercises || []
      exercises.forEach(ex => {
        if (!ex || !ex.id) return
        if (seen[ex.id]) {
          seen[ex.id].usedDays.push({ dayIndex: d, dayName: dayNames[d] })
        } else {
          const item = { ...ex, dayIndex: d, usedDays: [{ dayIndex: d, dayName: dayNames[d] }] }
          seen[ex.id] = item
          result.push(item)
        }
      })
    }
    return result
  }
}

module.exports = PlanService
