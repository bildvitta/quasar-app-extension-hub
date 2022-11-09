import axios from 'axios'

export const getGlobalVariables = ({ app, Vue }) => {
  const isLatestQuasar = !Vue

  return {
    isLatestQuasar,
    asteroid: isLatestQuasar ? app.config.globalProperties.$qas : Vue.prototype.$qas,
    quasar: isLatestQuasar ? app.config.globalProperties.$q : Vue.prototype.$q
  }
}

export const interceptAxios = ({ router, quasar, asteroid, storeConfig = {} }) => {
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
          quasar,
          'Houve um problema de autenticação. Por gentileza, faça o login novamente.'
        )

        clear()
        router.push({ name: 'HubLogin' })
      }
    }

    const isForbidden = router?.currentRoute?.value?.name === 'Forbidden'

    // Forbidden
    if (status === 403 && !isForbidden) {
      notifyError(
        asteroid,
        quasar,
        'Você não tem permissão para acessar este recurso.'
      )
    }

    return Promise.reject(error)
  })
}

export const beforeEach = ({ asteroid, router, quasar, isPinia, store }) => {
  let productName

  router.beforeEach(async (to, from, next) => {
    productName = productName || document.title

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
        quasar.loading.show({ message: 'Validando usuário...' })

        isPinia ? await store.getUser() : await store.dispatch('hub/getUser')
      } catch (error) {
        notifyError(asteroid, quasar, 'Erro ao validar usuário')
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

export const notifyError = (asteroid, quasar, message) => {
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
        component: () => import('../pages/hub/HubCallback.vue'),
        meta: {
          title: 'Validando...'
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
        name: 'HubLoggedOut',
        path: '/auth/logged-out',
        component: () => import('../pages/hub/HubLoggedOut.vue'),
        meta: {
          title: 'Desconectado'
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
          title: 'Redirecionando para ações de usuário'
        }
      }
    ]
  })
}
