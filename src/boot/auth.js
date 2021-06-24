import hubModule from '../store/hub.js'

export default async ({ router, store, Vue }) => {
  const asteroid = Vue.prototype.$qas
  const axios = Vue.prototype.$axios

  // Store
  store.registerModule('hub', hubModule)

  // Token
  const hasAccessToken = store.getters['hub/hasAccessToken']

  // Status
  axios.defaults.validateStatus = status => {
    // Unauthorized
    if (status === 401) {
      asteroid.error('Houve um problema de autenticação. Por gentileza, faça o login novamente.')
  
      store.dispatch('hub/clear')
      router.push({ name: 'Hub' })
    }

    // Forbidden
    if (status === 403) {
      asteroid.error('Você não tem permissão para acessar este recurso.')
    }

    return status >= 200 && status < 300
  }

  // Routes
  router.addRoute({
    name: 'Hub',
    path: '/auth',
    component: () => import('../layouts/Hub.vue'),
    redirect: { name: 'HubLogin' },

    children: [
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
      }
      
      // {
      //   name: 'AuthValidate',
      //   path: '/auth/validate',
      //   component: () => import('../pages/hub/AuthValidate.vue')
      // }
    ]
  })

  // Requires auth?
  router.beforeEach(async (to, from, next) => {
    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

    if (!requiresAuth) {
      return next()
    }

    // Is user authenticated?
    return next(hasAccessToken ? true : {
      name: 'Hub',
      query: { url: to.fullPath }
    })
  })
}
