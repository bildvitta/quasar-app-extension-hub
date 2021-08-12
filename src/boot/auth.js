import hubModule from '../store/hub.js'

export default async ({ router, store, Vue }) => {
  const asteroid = Vue.prototype.$qas
  const axios = Vue.prototype.$axios
  const quasar = Vue.prototype.$q

  // Store
  store.registerModule('hub', hubModule)

  // Status
  axios.interceptors.response.use(response => response, async error => {
    const { status } = error.response

    // Unauthorized
    if (status === 401) {
      quasar.loading.show({ message: 'Autenticando...' })

      try {
        if (error.config.url.endsWith('/auth/refresh')) {
          throw error
        }

        await store.dispatch('hub/refresh')
        quasar.loading.hide()

        delete error.config.headers.Authorization
        return axios.request(error.config)
      } catch (error) {
        quasar.loading.hide()
        asteroid.error('Houve um problema de autenticação. Por gentileza, faça o login novamente.')

        store.dispatch('hub/clear')
        router.push({ name: 'HubLogin' })
      }
    }

    // Forbidden
    if (status === 403) {
      asteroid.error('Você não tem permissão para acessar este recurso.')
    }

    return Promise.reject(error)
  })

  // Routes
  router.addRoute({
    name: 'Hub',
    path: '/auth',
    component: () => import('../layouts/Hub.vue'),
    redirect: { name: 'HubLogin' },

    children: [
      {
        name: 'HubCallback',
        path: '/auth/callback',
        component: () => import('../pages/hub/HubCallback.vue')
      },
      {
        name: 'HubLogin',
        path: '/auth/login',
        component: () => import('../pages/hub/HubLogin.vue')
      },
      {
        name: 'HubLogout',
        path: '/auth/logout',
        component: () => import('../pages/hub/HubLogout.vue')
      },
      {
        name: 'HubLoggedOut',
        path: '/auth/logged-out',
        component: () => import('../pages/hub/HubLoggedOut.vue')
      },
      {
        name: 'HubRefused',
        path: '/auth/refused',
        component: () => import('../pages/hub/HubRefused.vue')
      }
    ]
  })

    // Callback events
    const eventsSent = { token: false }
    const createTokenEvent = token => {
      const event = new CustomEvent('setAccessToken', { detail: { token } })
      window.dispatchEvent(event)
      eventsSent.token = true
    }

  // Requires auth?
  router.beforeEach(async (to, from, next) => {
    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

    if (!requiresAuth) {
      return next()
    }

    // Token
    const hasAccessToken = store.getters['hub/hasAccessToken']
    const accessToken = store.getters['hub/accessToken']

    // Call events
    if (hasAccessToken && !eventsSent.token) {
      createTokenEvent(accessToken)
    }

    // Is user authenticated?
    return next(hasAccessToken ? true : {
      name: 'Hub',
      query: { url: to.fullPath }
    })
  })
}
