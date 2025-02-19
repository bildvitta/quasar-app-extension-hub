<template>
  <div class="container spaced">
    <qas-page-header
      title="Login"
      :use-breadcrumbs="false"
    />

    <qas-header v-bind="headerProps" />

    <qas-input
      v-model="accessToken"
      class="full-width"
      hint="Caso o prefixo '__q_strn|' seja adicionado, ele será removido internamente."
      label="AccessToken"
      type="textarea"
    />

    <qas-actions>
      <template #primary>
        <qas-btn
          class="full-width"
          :disable="!accessToken"
          label="Acessar"
          variant="primary"
          @click="onSetAccessToken(normalizedAccessToken)"
        />
      </template>

      <template #secondary>
        <qas-btn
          class="full-width"
          label="Login automático"
          @click="makeAutomaticLogin"
        />
      </template>
    </qas-actions>

    <app-dev-logout-dialog
      v-model="showDevLogoutDialog"
      :environment="environment"
      :url="baseURL"
      @try-again="makeAutomaticLogin"
    />
  </div>
</template>

<script setup>
import hubConfig from '../../shared/default-hub-config'

import AppDevLogoutDialog from '../../components/AppDevLogoutDialog.vue'

import { useRoute, useRouter } from 'vue-router'
import { computed, inject, onMounted, ref } from 'vue'

defineOptions({ name: 'HubDevLogin' })

// globals
const qas = inject('qas')

// composables
const router = useRouter()
const route = useRoute()

const { showDevLogoutDialog, makeAutomaticLogin } = useAutomaticLogin()

// refs
const accessToken = ref('')

// consts
const { development } = hubConfig

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
const developmentMode = isLocalhost ? 'localhost' : 'preview'
const { environment, url: baseURL } = development[developmentMode]
const isDev = environment === 'development'

const headerProps = {
  description: (
    `Para fazer login automático, é necessário já estar logado em ${isDev ? 'develop' : 'temporário'}.`
  )
}

// computeds
const hasAccessToken = computed(() => qas.getGetter({ entity: 'hub', key: 'hasAccessToken' }))

const normalizedAccessToken = computed(() => accessToken.value.replace('__q_strn|', ''))

onMounted(() => {
  if (hasAccessToken.value) goToHome()
})

// functions
function goToHome () {
  router.replace('/')
}

function setAccessToken (token) {
  accessToken.value = token

  qas.getAction({
    entity: 'hub',
    key: 'setAccessToken',
    payload: token
  })
}

async function onSetAccessToken (token) {
  setAccessToken(token)

  const { from } = route.query

  // Se não tem from redireciona para a rota principal
  if (!from) return goToHome()

  // precisa começar com "/" para que o path funcione.
  const normalizedFrom = from.startsWith('/') ? from : `/${from}`

  const resolvedRoute = router.resolve({ path: normalizedFrom })

  // Redireciona para a rota de origem
  router.push(resolvedRoute)
}

// composable definitions
function useAutomaticLogin () {
  const showDevLogoutDialog = ref(false)

  async function makeAutomaticLogin () {
    const { origin } = window.location

    const url = `${baseURL}/?requestAccessToken=true&requestAccessTokenOrigin=${origin}`

    const openedWindow = window.open(url, '_blank', 'width=600,height=600')

    // envia mensagem para a janela aberta quando ela estiver pronta
    openedWindow.onload = sendMessage

    // escuta a mensagem enviada pela janela aberta
    window.addEventListener('message', messageListener)

    function messageListener ({ data: { type, accessToken: token } }) {
      // Garante que a mensagem vem do domínio correto
      if (type === 'responseAccessToken') {
        openedWindow.close()

        token ? onSetAccessToken(token) : openDevLogoutDialog()

        // Limpa o listener após receber o token
        window.removeEventListener('message', messageListener)
      }
    }

    function sendMessage () {
      openedWindow.postMessage({ type: 'requestAccessToken' }, url)
    }
  }

  function openDevLogoutDialog () {
    showDevLogoutDialog.value = true
  }

  return {
    showDevLogoutDialog,
    makeAutomaticLogin,
    openDevLogoutDialog
  }
}
</script>
