<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <q-spinner size="3em" />
      <p class="q-mt-lg">Validando...</p>
    </div>

    <q-banner v-else class="bg-red-1 text-red" inline-actions rounded>
      {{ errorMessage }}

      <template v-slot:action>
        <q-btn color="red" flat label="Tentar novamente" @click="callback" />
      </template>
    </q-banner>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      errorMessage: '',
      isLoading: true
    }
  },

  computed: {
    ...mapGetters('hub', ['hasAccessToken']),

    hasSession () {
      return this.session.code && this.session.state
    },

    session () {
      const { code, state } = this.$route.query
      return { code, state }
    },

    redirectURL () {
      return this.$route.query.url
    }
  },

  created () {
    this.callback()
  },

  methods: {
    ...mapActions('hub', ['callback']),

    async callback () {
      this.errorMessage = ''
      this.isLoading = true

      try {
        if (!this.hasSession) {
          return this.$router.replace({
            name: 'HubLogin',
            query: { url: this.redirectURL }
          })
        }

        await this.callback(this.session)
        this.$router.replace(this.redirectURL || '/')
      } catch (error) {
        this.errorMessage = 'Erro ao validar sessão.'
        this.isLoading = false
      }
    }
  }
}
</script>