<template>
  <div class="container spaced">
    <qas-page-header
      title="Login"
      :use-breadcrumbs="false"
    />

    <qas-header v-bind="headerProps" />

    <div>
      <qas-input
        v-model="accessToken"
        class="full-width"
        hint="Caso o prefixo '__q_strn|' seja adicionado, ele será removido internamente."
        label="AccessToken"
        type="textarea"
      />
    </div>

    <qas-actions>
      <template #primary>
        <qas-btn
          :disable="!accessToken"
          label="Acessar"
          variant="primary"
          @click="onSetAccessToken(normalizedAccessToken)"
        />
      </template>

      <template #secondary>
        <qas-btn
          class="q-ml-md"
          label="Login automático"
          @click="makeAutomaticLogin"
        />
      </template>
    </qas-actions>

    <app-dev-logout-dialog
      v-model="showDevLogoutDialog"
      :environment="hubConfig.development[developmentMode].environment"
      @try-again="makeAutomaticLogin"
    />
  </div>
</template>

<script setup>
import AppDevLogoutDialog from '../../components/AppDevLogoutDialog.vue'
// import { getGetter } from '@bildvitta/store-adapter'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
// import AppContent from '../../components/AppContent.vue'
// import AppHubPage from '../../components/AppHubPage.vue'

defineOptions({ name: 'HubDevLogin' })

// TODO: mover pro hubConfig
const hubConfig = {
  hasAsteroid: true, // usado caso tenha extensão @bildvitta/asteroid instalada na aplicação
  forbiddenRouteName: 'Forbidden', // usado para definir o nome da rota da pagina de erro 404 (Forbidden)
  storeAdapter: 'vuex',
  development: {
    localhost: {
      useAutomaticLogin: true,
      environment: 'dev',
      url: 'http://localhost:8080/auth/dev/login'
    },

    preview: {
      useAutomaticLogin: true,
      environment: 'dev',
      url: 'https://vendas.nave.dev.br'
    }
  }
}

const { development } = hubConfig

// composables
const store = useStore()
const router = useRouter()
const route = useRoute()

const { showDevLogoutDialog, makeAutomaticLogin } = useAutomaticLogin()

// refs
const accessToken = ref('')

// consts
const headerProps = {
  description: 'Para fazer login automático, é necessário já estar logado em dev ou temporário, dependendo do ambiente.'
}

const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
const developmentMode = isLocalhost ? 'localhost' : 'preview'

// computeds
const hasAccessToken = computed(() => store.getters['hub/hasAccessToken'])
// const hasAccessToken = computed(() => getGetter({ entity: 'hub', key: 'hasAccessToken' }))

const normalizedAccessToken = computed(() => accessToken.value.replace('__q_strn|', ''))

onMounted(() => {
  if (hasAccessToken.value) router.replace('/')
})

// functions
function setAccessToken (token) {
  accessToken.value = token

  store.dispatch('hub/setAccessToken', token)
}

function onSetAccessToken (token) {
  setAccessToken(token)

  const { from } = route.query

  // Se não tem from redireciona para a rota principal
  if (!from) {
    router.replace('/')
    return
  }

  // precisa começar com "/" para que o path funcione.
  const normalizedFrom = from.startsWith('/') ? from : `/${from}`

  const resolvedRoute = router.resolve({ path: normalizedFrom })

  // Redireciona para a rota de origem
  router.replace(resolvedRoute)
}

// composable definitions
function useAutomaticLogin () {
  const showDevLogoutDialog = ref(false)

  async function makeAutomaticLogin () {
    const { url: baseURL } = development[developmentMode]

    const url = `${baseURL}/?requestAccessToken=true&requestAccessTokenOrigin=http://localhost:8080/`

    const openedWindow = window.open(
      `${url}/?requestAccessToken=true&requestAccessTokenOrigin=http://localhost:8080/`,
      '_blank',
      'width=600,height=600'
    )

    openedWindow.onload = sendMessage

    window.addEventListener('message', messageListener)

    function messageListener ({ data: { type, token } }) {
      // Garante que a mensagem vem do domínio correto
      if (type === 'responseToken') {
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
