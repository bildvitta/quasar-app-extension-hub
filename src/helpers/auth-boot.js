import axios from 'axios'

export const getGlobalVariables = ({ app, Vue }) => {
  const isLatestQuasar = !Vue

  return {
    isLatestQuasar,
    asteroid: isLatestQuasar ? app.config.globalProperties.$qas : Vue.prototype.$qas,
    quasar: isLatestQuasar ? app.config.globalProperties.$q : Vue.prototype.$q
  }
}

export const interceptAxios = ({ quasar, asteroid, storeConfig = {} }) => {
  const { refresh = () => {}, clear = () => {} } = storeConfig

  axios.interceptors.response.use(response => response, async error => {
    const { status } = error.response

    // Unauthorized
    if (status === 401) {
      quasar.loading.show({ message: 'Autenticando...' })

      try {
        if (error.config.url.endsWith('/auth/refresh')) {
          throw error
        }

        await refresh()
        quasar.loading.hide()

        delete error.config.headers.Authorization
        return axios.request(error.config)
      } catch (error) {
        quasar.loading.hide()
        notifyError(
          asteroid,
          'Houve um problema de autenticação. Por gentileza, faça o login novamente.'
        )

        clear()
        router.push({ name: 'HubLogin' })
      }
    }

    // Forbidden
    if (status === 403) {
      notifyError(
        asteroid,
        'Você não tem permissão para acessar este recurso.'
      )
    }

    return Promise.reject(error)
  })
}

export const beforeEach = ({ router, storeConfig = {} }) => {
  router.beforeEach(async (to, from, next) => {
    const { getUser = () => {}, hasAccessToken, hasUser } = storeConfig

    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)
  
    if (!requiresAuth) {
      return next()
    }
  
    // get user before enter on application
    if (hasAccessToken && (!hasUser || !from.name)) {
      await getUser()
    }
  
    // Is user authenticated?
    return next(hasAccessToken ? true : {
      name: 'Hub',
      query: { url: to.fullPath }
    })
  })
}

export const notifyError = (asteroid, message) => {
  return asteroid
    ? asteroid.error(message)
    : quasar.notify({ progress: true, color: 'negative', message })
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
}
