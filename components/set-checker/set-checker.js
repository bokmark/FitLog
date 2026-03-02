Component({
  properties: {
    setIndex: { type: Number, value: 0 },
    setData: { type: Object, value: {} },
    reps: { type: String, value: '' },
    weight: { type: String, value: '' },
    readonly: { type: Boolean, value: false }
  },

  methods: {
    onToggle() {
      if (this.properties.readonly) return
      this.triggerEvent('toggle', { setIndex: this.properties.setIndex })
    },

    onWeightInput(e) {
      this.triggerEvent('update', {
        setIndex: this.properties.setIndex,
        field: 'actualWeight',
        value: e.detail.value
      })
    },

    onRepsInput(e) {
      this.triggerEvent('update', {
        setIndex: this.properties.setIndex,
        field: 'actualReps',
        value: parseInt(e.detail.value) || 0
      })
    }
  }
})
