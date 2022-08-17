import hubModule from '../store/hub.js'

import {
  addRoutes,
  beforeEach,
  getGlobalVariables,
  interceptAxios
} from '../helpers/auth-boot.js'

export default ({ router, app, Vue, store }) => {
  const {
    asteroid,
    quasar
  } = getGlobalVariables({ app, Vue })

  store.registerModule('hub', hubModule)

  interceptAxios({
    router,
    quasar,
    asteroid,
    storeConfig: {
      refresh: () => store.dispatch('hub/refresh'),
      clear: () => store.dispatch('hub/clear')
    }
  })

  addRoutes(router)

  beforeEach({
    asteroid,
    asteroid,
    isPinia: false,
    quasar,
    router,
    store
  })
}
