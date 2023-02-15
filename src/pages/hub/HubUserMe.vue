<template>
  <q-page class="flex column justify-center items-center">
    <app-content v-if="hasError" :button-props="{ onClick: redirectToUser }">
      <template #description>
        Ops… Tivemos um problema ao redirecionar seu acesso. Por favor, tente novamente.
      </template>
    </app-content>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'
import { getGetter, getAction } from '@bildvitta/store-adapter'
import AppContent from '../../components/AppContent.vue'

export default {
  name: 'HubUserMe',

  components: {
    AppContent
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
      Loading.show({ message: 'Redirecionando...' })
      await new Promise(r => setTimeout(r, 2000))

      // if (!this.hasAccessToken) {
      //   return this.$router.replace({ name: 'HubLogin' })
      // }

      try {
        const { redirect } = await getAction.call(this, {
          entity: 'hub1',
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
