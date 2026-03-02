const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function getToday() {
  return formatDate(new Date())
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDayOfWeek(dateStr) {
  if (dateStr) {
    return new Date(dateStr.replace(/-/g, '/')).getDay()
  }
  return new Date().getDay()
}

function getDayName(dateStr) {
  return DAY_NAMES[getDayOfWeek(dateStr)]
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return formatDate(d)
}

function getTomorrowDayOfWeek() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.getDay()
}

function getMonthDays(year, month) {
  const days = []
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startPad = firstDay.getDay()

  for (let i = 0; i < startPad; i++) {
    days.push({ day: '', date: '', isCurrentMonth: false })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date: dateStr, isCurrentMonth: true })
  }

  return days
}

function generateId() {
  return 'e' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

module.exports = {
  DAY_NAMES,
  getToday,
  formatDate,
  getDayOfWeek,
  getDayName,
  getTomorrow,
  getTomorrowDayOfWeek,
  getMonthDays,
  generateId
}
