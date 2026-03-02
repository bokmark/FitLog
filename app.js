App({
  onLaunch() {
    this.initDefaultPlan()
  },

  initDefaultPlan() {
    const planService = require('./services/plan-service')
    const existing = planService.getActivePlan()
    if (existing) return

    planService.savePlan({
      id: 'default',
      name: '默认训练计划',
      days: {
        0: { name: '休息日', isRestDay: true, exercises: [] },
        1: {
          name: '胸 + 三头',
          isRestDay: false,
          exercises: [
            { id: 'e1', name: '平板卧推', sets: 4, reps: '8-12', weight: '60kg', restSeconds: 90, media: null },
            { id: 'e2', name: '上斜哑铃卧推', sets: 4, reps: '10-12', weight: '22kg', restSeconds: 90, media: null },
            { id: 'e3', name: '龙门架夹胸', sets: 3, reps: '12-15', weight: '15kg', restSeconds: 60, media: null },
            { id: 'e4', name: '绳索下压', sets: 3, reps: '12-15', weight: '20kg', restSeconds: 60, media: null }
          ]
        },
        2: {
          name: '背 + 二头',
          isRestDay: false,
          exercises: [
            { id: 'e5', name: '引体向上', sets: 4, reps: '6-10', weight: '自重', restSeconds: 120, media: null },
            { id: 'e6', name: '杠铃划船', sets: 4, reps: '8-12', weight: '50kg', restSeconds: 90, media: null },
            { id: 'e7', name: '高位下拉', sets: 3, reps: '10-12', weight: '45kg', restSeconds: 60, media: null },
            { id: 'e8', name: '哑铃弯举', sets: 3, reps: '10-12', weight: '12kg', restSeconds: 60, media: null }
          ]
        },
        3: {
          name: '肩 + 腹',
          isRestDay: false,
          exercises: [
            { id: 'e9', name: '哑铃推肩', sets: 4, reps: '8-12', weight: '18kg', restSeconds: 90, media: null },
            { id: 'e10', name: '侧平举', sets: 4, reps: '12-15', weight: '8kg', restSeconds: 60, media: null },
            { id: 'e11', name: '面拉', sets: 3, reps: '15-20', weight: '15kg', restSeconds: 60, media: null },
            { id: 'e12', name: '悬垂举腿', sets: 3, reps: '12-15', weight: '自重', restSeconds: 60, media: null }
          ]
        },
        4: {
          name: '腿部训练',
          isRestDay: false,
          exercises: [
            { id: 'e13', name: '杠铃深蹲', sets: 4, reps: '6-10', weight: '80kg', restSeconds: 120, media: null },
            { id: 'e14', name: '腿举', sets: 4, reps: '10-12', weight: '120kg', restSeconds: 90, media: null },
            { id: 'e15', name: '罗马尼亚硬拉', sets: 3, reps: '8-12', weight: '60kg', restSeconds: 90, media: null },
            { id: 'e16', name: '腿弯举', sets: 3, reps: '12-15', weight: '30kg', restSeconds: 60, media: null }
          ]
        },
        5: {
          name: '胸 + 背',
          isRestDay: false,
          exercises: [
            { id: 'e17', name: '哑铃卧推', sets: 4, reps: '10-12', weight: '24kg', restSeconds: 90, media: null },
            { id: 'e18', name: '坐姿划船', sets: 4, reps: '10-12', weight: '50kg', restSeconds: 90, media: null },
            { id: 'e19', name: '蝴蝶机夹胸', sets: 3, reps: '12-15', weight: '40kg', restSeconds: 60, media: null },
            { id: 'e20', name: '直臂下压', sets: 3, reps: '12-15', weight: '20kg', restSeconds: 60, media: null }
          ]
        },
        6: { name: '休息日', isRestDay: true, exercises: [] }
      }
    })
    planService.setActivePlanId('default')
  },

  globalData: {}
})
