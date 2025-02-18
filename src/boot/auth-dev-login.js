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

  router.addRoute('Hub', {
    name: 'HubDevLogin',
    path: '/auth/dev/login',
    component: () => import('../pages/hub/HubDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  router.beforeEach((to, _from, next) => {
    const reloadedAccessToken = LocalStorage.getItem('accessToken')

    if (to.name === 'HubDevLogin' || reloadedAccessToken) return next()

    next({ name: 'HubDevLogin', query: { from: urlPath, ...to.query } })
  })
}

function handleAccessTokenRequest ({ accessToken }) {
  if (!accessToken && !window.opener) return

  // TODO: voltar código abaixo
  // if (!isLocalhostOrPreviewDomain(window.location.hostname) || !accessToken && !window.opener) return

  const urlParams = new URLSearchParams(window.location.search)

  const requestAccessToken = urlParams.get('requestAccessToken')
  const requestAccessTokenOrigin = urlParams.get('requestAccessTokenOrigin')

  // pode vir "false" ou "true".
  const isValid = value => value === true || value === 'true'

  if (isValid(requestAccessToken) && requestAccessTokenOrigin) {
    window.opener.postMessage({ type: 'responseAccessToken', accessToken: accessToken }, requestAccessTokenOrigin)
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
