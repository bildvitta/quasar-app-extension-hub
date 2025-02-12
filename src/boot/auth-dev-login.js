import { LocalStorage } from 'quasar'

export default ({ router, urlPath }) => {
  const accessToken = LocalStorage.getItem('accessToken')

  setListener()
  setRedirectURL({ accessToken, router, urlPath })
}

function setRedirectURL ({ accessToken, router, urlPath }) {
  if (!hasAuthDevLogin(window.location.host) || accessToken) return

  router.addRoute('Hub', {
    name: 'HubDevLogin',
    path: 'auth/dev/login',
    component: () => import('../pages/hub/HubDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  router.replace({ name: 'HubDevLogin', query: { from: urlPath } })
}

function setListener () {
  if (!hasAuthDevLogin(window.location.host) || !accessToken && window.opener) return

  window.addEventListener('message', accessTokenListener)

  function accessTokenListener (event) {
    const { origin, data: { type }, source } = event

    if (hasAuthDevLogin(origin) && type === 'requestAccessToken') {
      source.postMessage({ type: 'responseToken', accessToken }, origin)

      window.removeEventListener('message', accessTokenListener)
    }
  }
}

function hasAuthDevLogin (host) {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(host)
  const isVercelDomain = host.endsWith('.vercel.app')
  const isCloudflareDomain = host.endsWith('.pages.dev')

  return (isLocalhost || isVercelDomain || isCloudflareDomain)
}