import axios from 'axios'
import { notifyError } from './notifies'
import hubConfig from '../shared/default-hub-config.js'

const { forbiddenRouteName } = hubConfig

export const getGlobalVariables = ({ app, Vue }) => {
  const isLatestQuasar = !Vue

  return {
    isLatestQuasar,
    quasar: isLatestQuasar ? app.config.globalProperties.$q : Vue.prototype.$q
  }
}

export const interceptAxios = ({ router, quasar, storeConfig = {} }) => {
  const { refresh = () => {}, clear = () => {} } = storeConfig

  axios.interceptors.response.use(response => response, async error => {
    const { status } = error.response


    // Unauthorized
    if (status === 401) {
      quasar.loading.show()

      const isRefresh = error.config.url.endsWith('/auth/refresh')

      try {
        if (isRefresh) throw error

        await refresh()
        quasar.loading.hide()

        delete error.config.headers.Authorization
        return axios.request(error.config)
      } catch {
        quasar.loading.hide()

        router.push({ name: 'HubLogin' })
        clear()
      }
    }

    const isForbidden = router?.currentRoute?.value?.name === forbiddenRouteName
    const hasForbiddenPage = router.hasRoute(forbiddenRouteName)

    // Forbidden
    if (status === 403 && !isForbidden && hasForbiddenPage) {
      router.push({ name: forbiddenRouteName })
    }

    return Promise.reject(error)
  })
}

export const beforeEach = ({ router, quasar, isPinia, store }) => {
  let productName

  router.beforeEach(async (to, from, next) => {
    productName = productName || document.title

    authDevLoginHandler({ router, quasar, isPinia, store, next, to })

    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

    to.matched.forEach(item => {
      document.title = item.meta.title || productName
    })

    if (!requiresAuth) return next()

    const hasAccessToken = isPinia ? store.hasAccessToken : store.getters['hub/hasAccessToken']
    const hasUser = isPinia ? store.hasUser : store.getters['hub/hasUser']

    // get user before enter on application
    if (hasAccessToken && (!hasUser || !from.name) && from.name !== 'HubCallback') {
      try {
        quasar.loading.show()

        isPinia ? await store.getUser() : await store.dispatch('hub/getUser')
      } catch ({ response: { status } }) {
        if (status !== 401) notifyError('Erro ao carregar usuário')
      }
      finally {
        quasar.loading.hide()
      }
    }

    // Is user authenticated?
    return next(hasAccessToken ? true : {
      name: 'Hub',
      query: { url: to.fullPath }
    })
  })
}

export const addRoutes = router => {
  router.addRoute({
    name: 'Hub',
    path: '/auth',
    component: () => import('../layouts/Hub.vue'),
    redirect: { name: 'HubLogin' },

    children: [
      {
        name: 'HubCallback',
        path: '/auth/callback',
        component: () => import('../pages/hub/HubCallback.vue'),
        meta: {
          title: 'Carregando...'
        }
      },
      {
        name: 'HubLogin',
        path: '/auth/login',
        component: () => import('../pages/hub/HubLogin.vue'),
        meta: {
          title: 'Contactando servidor de autenticação...'
        }
      },
      {
        name: 'HubLogout',
        path: '/auth/logout',
        component: () => import('../pages/hub/HubLogout.vue'),
        meta: {
          title: 'Desconectando...'
        }
      },
      {
        name: 'HubRefused',
        path: '/auth/refused',
        component: () => import('../pages/hub/HubRefused.vue'),
        meta: {
          title: 'Autorização negada'
        }
      },
      {
        name: 'HubUserEdit',
        path: '/me',
        component: () => import('../pages/hub/HubUserMe.vue'),
        meta: {
          title: 'Redirecionando...'
        }
      }
    ]
  })
}

/**
 * TODOS:
 *  - adicionar chave no hug.config para poder validar.
 */
function authDevLoginHandler ({ quasar, isPinia, store, next, to }) {
  if (to.name === 'HubDevLogin') return next()

  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const isVercelDomain = window.location.hostname.endsWith('.vercel.app')
  const isCloudflareDomain = window.location.hostname.endsWith('.pages.dev')
  const isProduction = process.env.NODE_ENV === 'production'

  const hasAccessToken = isPinia ? store.hasAccessToken : store.getters['hub/hasAccessToken']

  /**
   * Se for produção ou não for localhost, vercel ou cloudflare, ou já tiver
   * um access token, não precisa fazer nada.
   */
  if (
    isProduction ||
    !(isLocalhost || isVercelDomain || isCloudflareDomain) ||
    hasAccessToken
  ) return

  router.addRoute('Hub', {
    name: 'HubDevLogin',
    path: 'auth/dev/login',
    component: () => import('../pages/hub/HubDevLogin.vue'),
    meta: {
      title: 'Login de desenvolvimento'
    }
  })

  next({ name: 'HubDevLogin' })
}

function hasAuthDevLogin () {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  const isVercelDomain = window.location.hostname.endsWith('.vercel.app')
  const isCloudflareDomain = window.location.hostname.endsWith('.pages.dev')
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    isProduction ||
    !(isLocalhost || isVercelDomain || isCloudflareDomain)
  )
}