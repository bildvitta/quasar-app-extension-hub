<template>
  <app-hub-page v-if="hasError">
    <app-content :button-props="{ onClick: authorize }">
      <template #description>
        Ops… Tivemos um erro ao carregar as informações. Por favor, tente novamente.
      </template>
    </app-content>
  </app-hub-page>
</template>

<script>
import { Loading } from 'quasar'
import { getAction } from '@bildvitta/store-adapter'
import AppContent from '../../components/AppContent.vue'
import AppHubPage from '../../components/AppHubPage.vue'

export default {
  name: 'HubCallback',

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
    hasSessionError () {
      return this.session.error === 'access_denied'
    },

    hasSession () {
      return this.session.code && this.session.state
    },

    session () {
      const { url, ...session } = this.$route.query
      return session
    },

    redirectURL () {
      return this.$route.query.url
    }
  },

  created () {
    this.authorize()
  },

  methods: {
    async authorize () {
      this.hasError = false

      Loading.show()

      try {
        if (this.hasSessionError) {
          return this.$router.replace({ name: 'HubRefused' })
        }

        if (!this.hasSession) {
          return this.$router.replace({
            name: 'HubLogin',
            query: { url: this.redirectURL }
          })
        }

        await getAction.call(this, {
          entity: 'hub',
          key: 'callback',
          payload: this.session
        })

        await getAction.call(this, {
          entity: 'hub',
          key: 'getUser'
        })

        this.$router.replace(this.redirectURL || '/')
      } catch {
        this.hasError = true
      } finally {
        Loading.hide()
      }
    }
  }
}
</script>
