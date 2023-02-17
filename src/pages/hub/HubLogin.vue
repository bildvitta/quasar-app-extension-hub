<template>
  <app-hub-page>
    <app-content v-if="hasError" :button-props="{ onClick: openHub }">
      <template #description>
        Ops… Tivemos um erro ao conectar com o servidor. Por favor, tente novamente.
      </template>
    </app-content>
  </app-hub-page>
</template>

<script>
import { Loading } from 'quasar'
import { getGetter, getAction } from '@bildvitta/store-adapter'
import parseValue from '../../helpers/parse-value.js'
import AppContent from '../../components/AppContent.vue'
import AppHubPage from '../../components/AppHubPage.vue'

export default {
  name: 'HubLogin',

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
      this.hasError = false

      Loading.show({ message: 'Conectando ao servidor...' })

      try {
        if (this.hasAccessToken) {
          await getAction.call(this, {
            entity: 'hub',
            key: 'refresh'
          })

          return this.$router.replace(this.redirectURL || '/')
        }

        const { query: { logged_out } } = this.$route

        const url = await getAction.call(this, {
          entity: 'hub',
          key: 'login',
          payload: { url: this.redirectURL }
        })

        const hasLoggedOut = parseValue(logged_out)
        const parsedQuery = hasLoggedOut ? '&logged_out=true' : ''

        location.href = `${url}${parsedQuery}`
      } catch {
        this.hasError = true
      } finally {
        Loading.hide()
      }
    }
  }
}
</script>
