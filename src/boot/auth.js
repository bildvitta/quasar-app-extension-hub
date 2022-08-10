import hubModule from '../store/hub.js'
import handleProcess from '../helpers/handle-process'

import { getState, getAction } from '../helpers/store-handler'

const storeAdapter = handleProcess(() => process.env.STORE_ADAPTER, 'pinia')

export default async ({ router, store, app, Vue }) => {
  const isLatestQuasar = !Vue
  const isPinia = storeAdapter === 'pinia'

  const asteroid = isLatestQuasar ? app.config.globalProperties.$qas : Vue.prototype.$qas
  const axios = isLatestQuasar ? app.config.globalProperties.$axios : Vue.prototype.$axios
  const quasar = isLatestQuasar ? app.config.globalProperties.$q : Vue.prototype.$q

  const notifyError = message => {
    return asteroid
      ? asteroid.error(message)
      : quasar.notify({ progress: true, color: 'negative', message })
  }

  if (isPinia) {
    console.log('isPinia', 'ue')

    try {
      // const defineGlobalPiniaStore = (await import('../plugins/define-global-pinia-store.js')).default
      const storeName = 'store'
      const hubStore = (await import(`../${storeName}/pinia-hub-store.js`)).default
      console.log("🚀 ~ file: auth.js ~ line 30 ~ hubStore", hubStore)
      // app.use(defineGlobalPiniaStore, { stores: [hubStore()] })
    } catch {}
  } else {
    store.registerModule('hub', hubModule)
  }

  const globalContext = { $store: store, $piniaStore: app.config.globalProperties.$piniaStore }

  // const getter = getState.call(globalContext, { entity: 'hub', key: 'hasAccessToken' })

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

        if (isPinia) {
          await app.config.globalProperties.$piniaStore.hub.refresh()
        } else {
          await store.dispatch('hub/refresh')
        }

        quasar.loading.hide()

        delete error.config.headers.Authorization
        return axios.request(error.config)
      } catch (error) {
        quasar.loading.hide()
        notifyError('Houve um problema de autenticação. Por gentileza, faça o login novamente.')

        if (isPinia) {
          app.config.globalProperties.$piniaStore.hub.clear()
        } else {
          store.dispatch('hub/clear')
        }

        router.push({ name: 'HubLogin' })
      }
    }

    // Forbidden
    if (status === 403) {
      notifyError('Você não tem permissão para acessar este recurso.')
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
      },
      {
        name: 'HubUserEdit',
        path: '/me',
        component: () => import('../pages/hub/HubUserMe.vue')
      }
    ]
  })

  // Requires auth?
  router.beforeEach(async (to, from, next) => {
    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

    if (!requiresAuth) {
      return next()
    }

    // Token
    const hasAccessToken = store.getters['hub/hasAccessToken']
    const hasUser = store.getters['hub/hasUser']

    // get user before enter on application
    if (hasAccessToken && (!hasUser || !from.name)) {
      await store.dispatch('hub/getUser')
    }

    // Is user authenticated?
    return next(hasAccessToken ? true : {
      name: 'Hub',
      query: { url: to.fullPath }
    })
  })
}
