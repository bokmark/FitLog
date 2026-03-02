Component({
  properties: {
    show: { type: Boolean, value: false },
    media: { type: Object, value: null }
  },

  methods: {
    onClose() {
      this.triggerEvent('close')
    },

    onMaskTap() {
      this.triggerEvent('close')
    },

    preventBubble() {}
  }
})
