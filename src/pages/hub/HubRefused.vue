<template>
  <app-hub-page>
    <app-content :button-props="{ onClick: login }">
      <template #description>
        Ops… Para acessar o sistema, você precisa autorizar o acesso aos seus dados. Por favor, tente novamente.
      </template>
    </app-content>
  </app-hub-page>
</template>

<script>
import { getGetter } from '@bildvitta/store-adapter'
import AppContent from '../../components/AppContent.vue'
import AppHubPage from '../../components/AppHubPage.vue'

export default {
  name: 'HubRefused',

  components: {
    AppContent,
    AppHubPage
  },

  computed: {
    hasAccessToken () {
      return getGetter.call(this, { entity: 'hub', key: 'hasAccessToken' })
    }
  },

  created () {
    if (this.hasAccessToken) {
      this.$router.replace({ name: 'HubLogout' })
    }
  },

  methods: {
    login () {
      this.$router.replace({ name: 'Hub' })
    }
  }
}
</script>
