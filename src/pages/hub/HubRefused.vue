<template>
  <q-banner class="bg-red-1 text-red" inline-actions rounded>
    Você não autorizou o acessos aos seus dados.

    <template v-slot:action>
      <q-btn color="red" flat label="Tentar novamente" @click="login" />
    </template>
  </q-banner>
</template>

<script>
import { getGetter } from '../../helpers/store-handler.js'

export default {
  name: 'HubRefused',

  meta () {
    return {
      title: 'Autorização negada'
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