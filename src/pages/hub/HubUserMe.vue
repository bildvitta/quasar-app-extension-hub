<template>
  <app-hub-page>
    <app-content v-if="hasError" :button-props="{ onClick: redirectToUser }">
      <template #description>
        Ops… Tivemos um problema ao redirecionar seu acesso. Por favor, tente novamente.
      </template>
    </app-content>
  </app-hub-page>
</template>

<script>
import { Loading } from 'quasar'
import { getGetter, getAction } from '@bildvitta/store-adapter'
import AppContent from '../../components/AppContent.vue'
import AppHubPage from '../../components/AppHubPage.vue'

export default {
  name: 'HubUserMe',

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

    backURL () {
      return this.$route.query.from
    }
  },

  created () {
    this.redirectToUser()
  },

  methods: {
    async redirectToUser () {
      this.hasError = false

      Loading.show({ message: 'Redirecionando...' })

      if (!this.hasAccessToken) {
        return this.$router.replace({ name: 'HubLogin' })
      }

      try {
        const { redirect } = await getAction.call(this, {
          entity: 'hub',
          key: 'getUserMeURL'
        })

        location.href = `${redirect}?from=${this.backURL}`
      } catch {
        this.hasError = true
      } finally {
        Loading.hide()
      }
    }
  }
}
</script>
