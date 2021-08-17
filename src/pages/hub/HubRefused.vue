<template>
  <q-banner class="bg-red-1 text-red" inline-actions rounded>
    Você não autorizou o acessos aos seus dados.

    <template v-slot:action>
      <q-btn color="red" flat label="Tentar novamente" @click="login" />
    </template>
  </q-banner>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  meta () {
    return {
      title: 'Autorização'
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