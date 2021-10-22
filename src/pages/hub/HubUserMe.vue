<template>
  <div>
    <div v-if="isLoading" class="text-center">
      <q-spinner size="3em" />
      <p class="q-mt-lg">Redirecionando...</p>
    </div>

    <q-banner v-else class="bg-red-1 text-red" inline-actions rounded>
      {{ errorMessage }}

      <template v-slot:action>
        <q-btn color="red" flat label="Tentar novamente" @click="login" />
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

  meta () {
    return {
      title: 'Redirecionando para ações de usuário'
    }
  },

  computed: {
    ...mapGetters('hub', ['hasAccessToken']),

    backURL () {
      return this.$route.query.from
    }
  },

  created () {
    this.redirectToUser()
  },

  methods: {
    ...mapActions('hub', ['getUserMeURL']),

    login () {
      this.$router.replace({ name: 'Hub' })
    },

    async redirectToUser () {
      this.errorMessage = ''
      this.isLoading = true

      if (!this.hasAccessToken) {
        return this.$router.replace({ name: 'HubLoggedOut' })
      }

      try {
        const { redirect } = await this.getUserMeURL()
        location.href = `${redirect}?from=${this.backURL}`
      } catch {
        this.errorMessage = 'Erro ao receber url de retorno.'
        this.isLoading = false
      }
    }
  }
}
</script>