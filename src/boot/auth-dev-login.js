import { LocalStorage } from 'quasar'

export default ({ router, urlPath }) => {
  const accessToken = LocalStorage.getItem('accessToken')

  handleAccessTokenRequest({ accessToken })
  setRedirectURL({ accessToken, router, urlPath })
}

function setRedirectURL ({ accessToken, router, urlPath }) {
  if (!hasAuthDevLogin(window.location.hostname) || accessToken) return

  router.addRoute('Hub', {
    name: 'HubDevLogin',
    path: '/auth/dev/login',
    component: () => import('../pages/hub/HubDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  router.beforeEach((to, from, next) => {
    if (to.name === 'HubDevLogin' || accessToken) return next()

    next({ name: 'HubDevLogin', query: { from: urlPath, ...to.query } })
  })
}

function handleAccessTokenRequest ({ accessToken }) {
  if (!hasAuthDevLogin(window.location.hostname) || !accessToken && window.opener) return

  const urlParams = new URLSearchParams(window.location.search)

  const requestAccessToken = urlParams.get('requestAccessToken')
  const requestAccessTokenOrigin = urlParams.get('requestAccessTokenOrigin')

  // pode vir "false" ou "true".
  const isValid = value => value === true || value === 'true'

  if (isValid(requestAccessToken) && requestAccessTokenOrigin) {
    window.opener.postMessage({ type: 'responseAccessToken', accessToken }, requestAccessTokenOrigin)
  }
}

// function setListener () {
//   if (!hasAuthDevLogin(window.location.host) || !accessToken && window.opener) return

//   window.addEventListener('message', accessTokenListener)

//   function accessTokenListener (event) {
//     const { origin, data: { type }, source } = event

//     if (hasAuthDevLogin(origin) && type === 'requestAccessToken') {
//       source.postMessage({ type: 'responseToken', accessToken }, origin)

//       window.removeEventListener('message', accessTokenListener)
//     }
//   }
// }

function hasAuthDevLogin (host) {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(host)
  const isVercelDomain = host.endsWith('.vercel.app')
  const isCloudflareDomain = host.endsWith('.pages.dev')

  return (isLocalhost || isVercelDomain || isCloudflareDomain)
}