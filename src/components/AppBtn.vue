<template>
  <resolved-btn v-bind="attributes" />
</template>

<script>
import handleProcess from '../helpers/handle-process.js'
import { defineAsyncComponent, defineComponent } from 'vue'

const hasAsteroid = handleProcess(() => process.env.HAS_ASTEROID, true)

export default defineComponent({
  name: 'AppBtn',

  components: {
    ResolvedBtn: defineAsyncComponent(() => {
      return hasAsteroid
        ? import('asteroid').then(({ QasBtn }) => QasBtn)
        : import('quasar').then(({ QBtn }) => QBtn)
    })
  },

  computed: {
    attributes () {
      const attributes = {}

      if (hasAsteroid) {
        attributes.variant = 'tertiary'
      } else {
        attributes.dense = true
        attributes.flat = true
        attributes.rounded = true
        attributes.color = 'primary'
        attributes.noCaps = true
      }

      return attributes
    }
  }
})
</script>
