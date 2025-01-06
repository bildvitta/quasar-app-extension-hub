import axios from 'axios'
import { notifyError } from './notifies'
import hubConfig from '../shared/default-hub-config.js'
import { h } from 'vue'
import { QInput } from 'quasar'

const { forbiddenRouteName, hasAsteroid } = hubConfig

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

export const beforeEach = async ({ router, quasar, isPinia, store }) => {
  let productName

  console.log('before:loginDevAuthHandler', store)
  await loginDevAuthHandler()
  console.log('after:loginDevAuthHandler')

  router.beforeEach(async (to, from, next) => {
    productName = productName || document.title

    // Routes that does not requires authentication.
    const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

    to.matched.forEach(item => {
      document.title = item.meta.title || productName
    })

    if (!requiresAuth) return next()

    const hasAccessToken = isPinia ? store.hasAccessToken : store.getters['hub/hasAccessToken']
		console.log("TCL: beforeEach -> hasAccessToken", hasAccessToken)
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

  function loginDevAuthHandler () {
    return new Promise(async (resolve, reject) => {
      const hasAccessToken = !!(isPinia ? store.hasAccessToken : store.getters['hub/hasAccessToken'])

      const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const isVercelDomain = window.location.hostname.endsWith('.vercel.app')
      const isProduction = process.env.NODE_ENV === 'production'

      /**
       * Regras para abrir o popup de login:
       *
       * - Não ter token de acesso;
       * - Estar em ambiente de desenvolvimento (localhost);
       * - Estar em ambiente da vercel (vercel.app gerado ao abrir pr);
       * - Não estar em produção;
       * - Ter asteroid instalado.
       */
      if (hasAccessToken || !(isLocalhost || isVercelDomain) || isProduction || !hasAsteroid) return resolve()

      const AsteroidDialog = (await import('asteroid')).Dialog
      const AppDevAuthLoginDialog = (await import('../components/AppDevAuthLoginDialog.vue')).default
			console.log("TCL: component -> component", AppDevAuthLoginDialog)

      AsteroidDialog({
        card: {
          title: 'Eai',
          description: h(QInput, { label: 'Eai' }),
        }
      })

      // console.log("TCL: loginDevAuthHandler -> component", component)

      setTokenFromExternalSite()

      const url = new URL(window.location.href)
      const queryParams = Object.fromEntries(url.searchParams.entries())

      const {
        requestAccessToken,
        requestAccessTokenOrigin
      } = queryParams

      if (!requestAccessToken || !requestAccessTokenOrigin) {
        window.open('http://localhost:8080/?requestAccessToken=true&requestAccessTokenOrigin=http://localhost:8080/', '_blank', 'width=600,height=600')

        return resolve()
      }

      // window.opener.postMessage({ accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyMzBiZTFmOC1jY2IwLTRlYmMtOWExMy0xZDA0MTA5NjU0ZmMiLCJqdGkiOiIyMzc2NDBlNzBlMTNlZjM2OTIxNThhMzRjZDE3OTRiNGU2MTZiMzgwYzRlNDQyYzBlZGVkNjAzYTYwMzVkMWNkMzNlOGQzYzYwMTkxZTU3MCIsImlhdCI6MTczNDExMzIyNy4wODk0MTgsIm5iZiI6MTczNDExMzIyNy4wODk0MTksImV4cCI6MTczNTQwOTIyNy4wNjc4MDIsInN1YiI6IjMwIiwic2NvcGVzIjpbInByb2ZpbGUiXX0.pze9UWSui3UpvVHwhgjlq0Ybxg8nkjGJO2ywQ6jkUtMfkhKEVPHAKVOoBKQxcN2Eob2bsT0FC3MM7o9MM63WFkcwCmMvvWjh7fFhiaFHxy1didSBC5wdUjXWW2s1UKrsWfCU_1oU3XTygwV2gGi6y8ICl_ffGvjUwW9LucxLCYyPrKNnJJQJcAX-0GmVZxPlGYH-H4J5GaEIJLMEqivoUpt0lZnhRgUx9x01EGS1au5TxTy7s-TVgCrrIofDgP_DvJshOIT5iAxZveZDtZxriDwa2EWh3H9opPgrS2PXM5S2WSG3nxLlSjyfkj6IlmMM77Nrjlz1mD9C6KkdC8Gs6dVDdJtntm6Ie1MY2O-hu4uEzLON20mAt8vAP0sgkE5OOvI1DyP4hZ7YBh5sIf1z2KDibfchOl3bXLuzMOicZV2JKW03k7nCNNpO_QRDG-5OU2_PNpPxtsTfRrw6FrAHcogD2gDPtcQ8ge_dstwlg80ZU86KfdFZhlrw6JIAQGhCmXfhlsBQ4-aaeJ1NI8tznd1r1zYWPwdtZ6BP8noaUUgr4-80lLoDDRQEnW06rOqg_c5SDyzDLYNG5jbIHd6G7dFzUTJJnQlAAzzHhHthl49aHF6KTcE15OlfBqllTz-os0lY3tcpLxv1VUBc5P6llKCHmU0Na8Q81RAHxa6lkA8' }, requestAccessTokenOrigin)

      window.close()
    })


    // const url = new URL(window.location.href)
    // const queryParams = Object.fromEntries(url.searchParams.entries())

    // const {
    //   requestAccessToken,
    //   requestAccessTokenOrigin
    // } = queryParams

    // window.addEventListener('message', (event) => {
    //   if (event.origin === 'http://localhost:8080') {

    //   }
    //   console.log('Mensagem recebida:', event);
    //   // if (event.origin === 'https://site-externo.com') {
    //   // }
    // })


		// console.log("TCL: loginDevAuthHandler -> !requestAccessToken || !requestAccessTokenOrigin", !requestAccessToken || !requestAccessTokenOrigin)
    // if (!requestAccessToken || !requestAccessTokenOrigin) {
    //   const popup = window.open('http://localhost:8080/?requestAccessToken=true&requestAccessTokenOrigin=http://localhost:8080/', '_blank', 'width=600,height=600')
    //   console.log("TCL: loginDevAuthHandler -> popup", popup)
    //   return Promise.resolve()
    // }

    
    //   console.log("TCL: loginDevAuthHandler -> requestAccessTokenOrigin", requestAccessTokenOrigin)
    // window.opener.postMessage({ accessToken: 'xpto' }, requestAccessTokenOrigin)
    // window.close()
  }

  function setTokenFromExternalSite () {
    return new Promise((resolve) => {
      window.addEventListener('message', event => {
        console.log('SETEI AQUI!', event)
        if (event.origin === 'http://localhost:8080') {
          const { accessToken } = event.data

  
          if (accessToken) {
            isPinia ? store.setAccessToken(accessToken) : store.dispatch('hub/setAccessToken', accessToken)
          }

          window.removeEventListener('message', () => {})
  
          return resolve()
        }
      })
    })
  }
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
