import hubConfig from 'hubConfig'

import { LocalStorage } from 'quasar'

export default ({ router, urlPath }) => {
  const accessToken = LocalStorage.getItem('accessToken')

  handleAccessTokenRequest({ accessToken })
  setRedirectURL({ accessToken, router, urlPath })
}

function setRedirectURL ({ accessToken, router, urlPath }) {
  if (!isLocalhostOrPreviewDomain(window.location.hostname) || accessToken) return

  const mode = isLocalhost(window.location.hostname) ? 'localhost' : 'preview'

  if (!hubConfig.development[mode].useAutomaticLogin) return

  router.addRoute({
    name: 'AuthDevLogin',
    path: '/auth/dev/login',
    component: () => import('../pages/auth/AuthDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  router.beforeEach((to, _from, next) => {
    const refreshedAccessToken = LocalStorage.getItem('accessToken')

    if (to.name === 'AuthDevLogin' || refreshedAccessToken) return next()

    next({ name: 'AuthDevLogin', query: { from: urlPath, ...to.query } })
  })
}

function handleAccessTokenRequest ({ accessToken }) {
  const envs = ['development', 'temporary']

  /**
   * É apenas para ambientes de desenvolvimento e temporários e se a janela foi
   * aberta por outra janela (window.opener) e não é localhost ou preview.
   */
  const hasRedirectRequestHandler = (
    envs.includes(process.env.ENVIRONMENT) &&
    window.opener &&
    !isLocalhostOrPreviewDomain(window.location.hostname)
  )

  if (!hasRedirectRequestHandler) return

  const urlParams = new URLSearchParams(window.location.search)

  const requestAccessToken = urlParams.get('requestAccessToken')
  const requestAccessTokenOrigin = urlParams.get('requestAccessTokenOrigin')

  // pode vir "false" ou "true".
  const isValid = value => value === true || value === 'true'

  if (isValid(requestAccessToken) && requestAccessTokenOrigin) {
    const payload = { type: 'responseAccessToken', accessToken: accessToken }

    window.opener.postMessage(payload, requestAccessTokenOrigin)
  }
}

function isLocalhost (host) {
  return ['localhost', '127.0.0.1'].includes(host)
}

/**
 * Preview de vercel ou cloudflare pages
 */
function isPreviewDomain (host) {
  return host.endsWith('.vercel.app') || host.endsWith('.pages.dev')
}

function isLocalhostOrPreviewDomain (host) {
  return isLocalhost(host) || isPreviewDomain(host)
}
