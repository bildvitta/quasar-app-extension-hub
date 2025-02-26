import hubConfig from 'hubConfig'

import { LocalStorage } from 'quasar'
import { isLocalDevelopment } from 'asteroid'

export default ({ router, urlPath }) => {
  const accessToken = LocalStorage.getItem('accessToken')

  handleAccessTokenRequest({ accessToken })
  setRedirectURL({ accessToken, router, urlPath })
}

/**
 * Adiciona a rota de redirecionamento para o login de desenvolvimento.
 */
function setRedirectURL ({ accessToken, router, urlPath }) {
  // se não for localhost ou preview, ou se já tiver um accessToken, não faz nada.
  if (!isLocalhostOrPreviewDomain() || accessToken) return

  const mode = isLocalDevelopment() ? 'localhost' : 'preview'

  // se não estiver configurado para usar o login automático, não faz nada.
  if (!hubConfig.development[mode].useAutomaticLogin) return

  // a rota só é adicionada caso passe por todas as condições acima.
  router.addRoute({
    name: 'AuthDevLogin',
    path: '/auth/dev/login',
    component: () => import('../pages/auth/AuthDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  router.beforeEach((to, _from, next) => {
    // rota vez que o usuário muda de rota recupera o accessToken atualizado.
    const refreshedAccessToken = LocalStorage.getItem('accessToken')

    // se a rota atual for a de login ou se tem accessToken, redireciona.
    if (to.name === 'AuthDevLogin' || refreshedAccessToken) return next()

    /**
     * redireciona para a rota de login de desenvolvimento passando a rota atual
     * como query string no "from".
     */
    next({ name: 'AuthDevLogin', query: { from: urlPath, ...to.query } })
  })
}

/**
 * Envia o accessToken para a janela que solicitou.
 */
function handleAccessTokenRequest ({ accessToken }) {
  const envs = ['development', 'temporary']

  /**
   * É apenas para ambientes de desenvolvimento e temporários e se a janela foi
   * aberta por outra janela (window.opener) e não é localhost ou preview.
   */
  const hasRedirectRequestHandler = (
    envs.includes(process.env.ENVIRONMENT) &&
    window.opener &&
    !isLocalhostOrPreviewDomain()
  )

  if (!hasRedirectRequestHandler) return

  const urlParams = new URLSearchParams(window.location.search)

  const requestAccessToken = urlParams.get('requestAccessToken')

  // a origem da janela que solicitou o accessToken.
  const requestAccessTokenOrigin = urlParams.get('requestAccessTokenOrigin')

  // pode vir booleano em formato de string "false" ou "true".
  const isValid = value => value === true || value === 'true'

  if (isValid(requestAccessToken) && requestAccessTokenOrigin) {
    const payload = { type: 'responseAccessToken', accessToken }

    /**
     * Envia uma resposta para a janela que solicitou o accessToken.
     *
     * type: 'responseAccessToken' - tipo da mensagem.
     * accessToken - accessToken do usuário.
     */
    window.opener.postMessage(payload, requestAccessTokenOrigin)
  }
}

/**
 * Preview de vercel ou cloudflare pages
 */
function isPreviewDomain () {
  const { hostname } = window.location

  const previewDomains = ['.vercel.app', '.pages.dev']

  return previewDomains.some(domain => hostname.endsWith(domain))
}

function isLocalhostOrPreviewDomain () {
  return isLocalDevelopment() || isPreviewDomain()
}
