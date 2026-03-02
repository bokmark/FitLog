Component({
  properties: {
    exercise: { type: Object, value: {} },
    checkinData: { type: Object, value: null },
    readonly: { type: Boolean, value: false },
    expanded: { type: Boolean, value: false }
  },

  data: {
    isExpanded: false,
    completedSets: 0,
    setsArray: []
  },

  observers: {
    'expanded': function (val) {
      this.setData({ isExpanded: val })
    },
    'exercise.sets': function (sets) {
      const setsArray = Array.from({ length: sets || 0 }, (_, i) => i)
      this.setData({ setsArray })
    },
    'checkinData': function (data) {
      if (data && data.sets) {
        const completed = data.sets.filter(s => s.completed).length
        this.setData({ completedSets: completed })
      } else {
        this.setData({ completedSets: 0 })
      }
    }
  },

  methods: {
    onToggleExpand() {
      this.setData({ isExpanded: !this.data.isExpanded })
    },

    onMediaTap() {
      const { exercise } = this.properties
      if (!exercise.media) return
      this.triggerEvent('mediatap', { media: exercise.media })
    },

    onSetToggle(e) {
      this.triggerEvent('settoggle', {
        exerciseId: this.properties.exercise.id,
        setIndex: e.detail.setIndex
      })
    },

    onSetUpdate(e) {
      this.triggerEvent('setupdate', {
        exerciseId: this.properties.exercise.id,
        setIndex: e.detail.setIndex,
        field: e.detail.field,
        value: e.detail.value
      })
    }
  }
})
