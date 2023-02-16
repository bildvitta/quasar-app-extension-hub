<template>
  <!-- <div>
    <div v-if="isLoading" class="text-center">
      <q-spinner size="3em" />
      <p class="q-mt-lg">Desconectando...</p>
    </div>

    <q-banner v-else class="bg-red-1 text-red" inline-actions rounded>
      {{ errorMessage }}

      <template v-slot:action>
        <q-btn color="red" flat label="Tentar novamente" @click="openHub" />
      </template>
    </q-banner>
  </div> -->

  <app-hub-page>
    <app-content v-if="hasError" :button-props="{ onClick: openHub }">
      <template #description>
        Ops… Tivemos um problema ao desconectar. Por favor, tente novamente.
      </template>
    </app-content>
  </app-hub-page>
</template>

<script>
import { getGetter, getAction } from '@bildvitta/store-adapter'
import { Loading } from 'quasar'
import AppContent from '../../components/AppContent.vue'
import AppHubPage from '../../components/AppHubPage.vue'

export default {
  name: 'HubLogout',

  components: {
    AppContent,
    AppHubPage
  },

  data () {
    return {
      hasError: false
    }
  },

  computed: {
    hasAccessToken () {
      return getGetter.call(this, { entity: 'hub', key: 'hasAccessToken' })
    }
  },

  created () {
    this.openHub()
  },

  methods: {
    async openHub () {
      this.hasError = false

      if (!this.hasAccessToken) {
        return this.$router.replace({ name: 'HubLogin', query: { logged_out: true } })
      }

      Loading.show({ message: 'Desconectando...' })

      try {
        const url = await getAction.call(this, {
          entity: 'hub',
          key: 'logout',
          payload: { url: '/auth/logged-out' }
        })

        getAction.call(this, {
          entity: 'hub1',
          key: 'clear'
        })

        location.href = url
      } catch {
        this.hasError = true
      } finally {
        Loading.hide()
      }
    }
  }
}
</script>
