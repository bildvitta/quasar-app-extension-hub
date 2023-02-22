<template>
  <resolved-btn v-bind="attributes" />
</template>

<script>
import hubConfig from '../shared/default-hub-config.js'
import { defineAsyncComponent, defineComponent } from 'vue'

const { hasAsteroid } = hubConfig

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
