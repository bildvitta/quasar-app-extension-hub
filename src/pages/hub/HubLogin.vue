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
      title: 'Contactando servidor de autenticação...'
    }
  },

  computed: {
    ...mapGetters('hub', ['hasAccessToken']),

    redirectURL () {
      return this.$route.query.url
    }
  },

  created () {
    this.openHub()
  },

  methods: {
    ...mapActions('hub', ['login', 'refresh']),

    async openHub () {
      this.errorMessage = ''
      this.isLoading = true

      if (this.hasAccessToken) {
        try {
          await this.refresh()
          return this.$router.replace(this.redirectURL || { name: 'Root' })
        } catch (error) {}
      }

      try {
        const url = await this.login({ url: this.redirectURL })
        location.href = url
      } catch (error) {
        this.errorMessage = 'Erro ao obter o endereço de autenticação.'
        this.isLoading = false
      }
    }
  }
}
</script>
