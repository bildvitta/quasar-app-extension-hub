import hubModule from '../store/hub.js'

export default async ({ router, store, Vue }) => {
  // Store
  store.registerModule('hub', hubModule)

  // Token
  const accessToken = store.getters['hub/accessToken']

  console.log('TURURU', accessToken)

  const d = await store.dispatch('hub/login')
  console.log(d)

  setTimeout(async () => {
    const e = await store.dispatch('hub/logout')
    console.log(e)

    const f = await store.dispatch('hub/getUser')
    console.log(f)
  }, 1000)

  // Status
  // axios.defaults.validateStatus = status => {
  //   if (status === 401) {
  //     store.dispatch('hub/clear')
  //     // localStorage.clear()

  //     router.push({ name: 'Auth' })
  //     // location.href = '/auth'
  //   }

  //   return status >= 200 && status < 300
  // }

  // Requires auth?
  // router.beforeEach(async (to, from, next) => {
  //   // Routes that does not requires authentication.
  //   const requiresAuth = to.matched.some(item => item.meta.requiresAuth)

  //   if (!requiresAuth) {
  //     return next()
  //   }

  //   // Is user authenticated?
  //   return next(accessToken && typeof accessToken === 'string' ? true : {
  //     name: 'Auth',
  //     query: { url: to.fullPath }
  //   })
  // })
}
