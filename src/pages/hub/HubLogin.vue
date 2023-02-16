<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <q-spinner size="3em" />
      <p class="q-mt-lg">Contactando servidor de autenticação...</p>
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
  name: 'HubLogin',

  data () {
    return {
      errorMessage: '',
      isLoading: true
    }
  },

  meta () {
    return {
      title: 'Contactando servidor de autenticação...'
    }
  },

  computed: {
    hasAccessToken () {
      return getGetter.call(this, { entity: 'hub', key: 'hasAccessToken' })
    },

    redirectURL () {
      return this.$route.query.url
    }
  },

  created () {
    this.openHub()
  },

  methods: {
    async openHub () {
      this.errorMessage = ''
      this.isLoading = true

      if (this.hasAccessToken) {
        try {
          await getAction.call(this, {
            entity: 'hub',
            key: 'refresh'
          })

          return this.$router.replace(this.redirectURL || '/')
        } catch {}
      }

      try {
        const { query: logged_out } = this.$route

        const payload = {
          url: this.redirectURL,
          ...(logged_out && { logged_out: true })
        }

        const url = await getAction.call(this, {
          entity: 'hub',
          key: 'login',
          payload
        })

        location.href = `${url}${logged_out ? 'logged_out=true' : ''}`
      } catch {
        this.errorMessage = 'Erro ao obter o endereço de autenticação.'
        this.isLoading = false
      }
    }
  }
}
</script>
