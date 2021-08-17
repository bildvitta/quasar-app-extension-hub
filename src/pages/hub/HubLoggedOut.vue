<template>
  <q-banner class="bg-green-1 text-green" inline-actions rounded>
    Você foi desconectado com sucesso!

    <template v-slot:action>
      <q-btn color="green" flat label="Entrar" @click="login" />
    </template>
  </q-banner>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  meta () {
    return {
      title: 'Desconectado'
    }
  },

  computed: {
    ...mapGetters('hub', ['hasAccessToken'])
  },

  created () {
    if (this.hasAccessToken) {
      this.$router.replace({ name: 'HubLogout' })
    }
  },

  methods: {
    login () {
      this.$router.replace({ name: 'Hub' })
    }
  }
}
</script>