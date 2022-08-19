<template>
  <div>
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
  </div>
</template>

<script>
import { getGetter, getAction } from '@bildvitta/store-adapter'

export default {
  name: 'HubLogout',

  data () {
    return {
      errorMessage: '',
      isLoading: true
    }
  },

  meta () {
    return {
      title: 'Desconectando...'
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
      if (!this.hasAccessToken) {
        return this.$router.replace({ name: 'HubLoggedOut' })
      }

      try {
        const url = await getAction.call(this, {
          entity: 'hub',
          key: 'logout',
          payload: { url: '/auth/logged-out' }
        })

        getAction.call(this, {
          entity: 'hub',
          key: 'clear'
        })

        // const url = await this.logout({ url: '/auth/logged-out' })
        // this.clear()
        location.href = url
      } catch (error) {
        this.errorMessage = 'Erro ao desconectar.'
        this.isLoading = false
      }
    }
  }
}
</script>
