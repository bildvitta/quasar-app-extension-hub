<template>
  <q-page class="flex column justify-center items-center q-px-md">
    <slot />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppHubPage'
})
</script>
