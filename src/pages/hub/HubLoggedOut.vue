<template>
  <q-banner class="bg-green-1 text-green" inline-actions rounded>
    Você foi desconectado com sucesso!

    <template v-slot:action>
      <q-btn color="green" flat label="Entrar" @click="login" />
    </template>
  </q-banner>
</template>

<script>
import { getGetter } from '@bildvitta/store-adapter'

export default {
  name: 'hubLoggedOut',

  meta () {
    return {
      title: 'Desconectado'
    }
  },

  computed: {
    hasAccessToken () {
      return getGetter.call(this, { entity: 'hub', key: 'hasAccessToken' })
    }
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