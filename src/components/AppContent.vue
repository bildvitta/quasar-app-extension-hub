<template>
  <div class="app-content">
    <header class="q-mb-xl">
      <div v-if="hasDescriptionSlot" class="text-body1 text-grey-8">
        <slot name="description" />
      </div>
    </header>

    <div>
      <div>
        <slot name="content">
          <q-img class="app-content__img q-mx-auto block" width="100%" src="../assets/big-shoes-walking-the-dog.svg" />
        </slot>
      </div>

      <div class="q-mt-xl text-center">
        <slot name="actions">
          <app-btn label="Tentar novamente" v-bind="defaultButtonProps" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import AppBtn from './AppBtn.vue'

export default defineComponent({
  name: 'AppContent',

  components: {
    AppBtn
  },

  props: {
    buttonProps: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['submit'],

  computed: {
    hasDescriptionSlot () {
      return !!this.$slots.description
    },

    defaultButtonProps () {
      return {
        label: 'Tentar novamente',
        ...this.buttonProps
      }
    }
  }
})
</script>

<style lang="scss">
.app-content {
  max-width: 416px;
  width: 100%;

  @media (max-width: $breakpoint-xs) {
    &--fixed-width {
      max-width: 100%;
    }
  }
}
</style>
