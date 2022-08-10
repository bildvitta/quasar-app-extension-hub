import { getGlobalVariables, interceptAxios, addRoutes, beforeEach } from '../helpers/auth-boot.js'
import hubModule from '../store/hub.js'

export default async ({ router, app, Vue, store }) => {
  const {
    asteroid,
    quasar
  } = getGlobalVariables({ app, Vue })

  store.registerModule('hub', hubModule)

  interceptAxios({
    quasar,
    asteroid,
    storeConfig: {
      refresh: () => store.dispatch('hub/refresh'),
      clear: () => store.dispatch('hub/clear')
    }
  })

  addRoutes(router)

  beforeEach({
    router,
    getUser: () => store.dispatch('hub/getUser'),
    hasAccessToken: store.getters['hub/hasAccessToken'],
    hasUser: store.getters['hub/hasUser']
  })
}
