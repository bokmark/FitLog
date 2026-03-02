const planService = require('../../services/plan-service')
const storage = require('../../services/storage')
const dateUtil = require('../../utils/date')

Page({
  data: {
    dayIndex: 0,
    exerciseId: '',
    mode: 'add',
    form: {
      name: '',
      sets: 4,
      reps: '8-12',
      weight: '',
      restSeconds: 90,
      media: null
    }
  },

  onLoad(options) {
    const dayIndex = parseInt(options.dayIndex) || 0
    const mode = options.mode || 'add'
    const exerciseId = options.exerciseId || ''

    this.setData({ dayIndex, mode, exerciseId })

    if (mode === 'edit' && exerciseId) {
      this.loadExercise(dayIndex, exerciseId)
    }

    wx.setNavigationBarTitle({
      title: mode === 'add' ? '添加动作' : '编辑动作'
    })
  },

  loadExercise(dayIndex, exerciseId) {
    const dayPlan = planService.getDayPlan(dayIndex)
    if (!dayPlan) return
    const exercise = dayPlan.exercises.find(e => e.id === exerciseId)
    if (exercise) {
      this.setData({
        form: {
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          restSeconds: exercise.restSeconds,
          media: exercise.media
        }
      })
    }
  },

  onNameInput(e) {
    this.setData({ 'form.name': e.detail.value })
  },

  onSetsChange(e) {
    let val = parseInt(e.detail.value) || 1
    if (val < 1) val = 1
    if (val > 20) val = 20
    this.setData({ 'form.sets': val })
  },

  onRepsInput(e) {
    this.setData({ 'form.reps': e.detail.value })
  },

  onWeightInput(e) {
    this.setData({ 'form.weight': e.detail.value })
  },

  onRestInput(e) {
    let val = parseInt(e.detail.value) || 0
    this.setData({ 'form.restSeconds': val })
  },

  onSetsDecrease() {
    const sets = Math.max(1, this.data.form.sets - 1)
    this.setData({ 'form.sets': sets })
  },

  onSetsIncrease() {
    const sets = Math.min(20, this.data.form.sets + 1)
    this.setData({ 'form.sets': sets })
  },

  onChooseMedia() {
    wx.showActionSheet({
      itemList: ['选择图片', '选择视频', '移除当前媒体'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.chooseImage()
        } else if (res.tapIndex === 1) {
          this.chooseVideo()
        } else if (res.tapIndex === 2) {
          this.setData({ 'form.media': null })
        }
      }
    })
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempPath = res.tempFiles[0].tempFilePath
        const savedPath = await storage.saveFile(tempPath)
        this.setData({
          'form.media': { type: 'image', url: savedPath }
        })
      }
    })
  },

  chooseVideo() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      success: async (res) => {
        const tempPath = res.tempFiles[0].tempFilePath
        const savedPath = await storage.saveFile(tempPath)
        this.setData({
          'form.media': { type: 'video', url: savedPath }
        })
      }
    })
  },

  onPreviewMedia() {
    const { media } = this.data.form
    if (!media) return
    if (media.type === 'image') {
      wx.previewImage({ urls: [media.url] })
    }
  },

  onSave() {
    const { form, dayIndex, mode, exerciseId } = this.data

    if (!form.name.trim()) {
      wx.showToast({ title: '请输入动作名称', icon: 'none' })
      return
    }

    if (mode === 'add') {
      const exercise = {
        id: dateUtil.generateId(),
        ...form,
        name: form.name.trim()
      }
      planService.addExercise(dayIndex, exercise)
    } else {
      planService.updateExercise(dayIndex, exerciseId, {
        ...form,
        name: form.name.trim()
      })
    }

    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => wx.navigateBack(), 800)
  }
})
