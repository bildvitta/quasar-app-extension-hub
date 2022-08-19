import piniaHubStore from '../store/pinia-hub-store.js'
import { DefineGlobalPiniaStore } from '@bildvitta/store-adapter'

import {
  addRoutes,
  beforeEach,
  getGlobalVariables,
  interceptAxios
} from '../helpers/auth-boot.js'

export default ({ router, app, Vue }) => {
  const store = piniaHubStore()

  const {
    isLatestQuasar,
    asteroid,
    quasar
  } = getGlobalVariables({ app, Vue })

  app.use(DefineGlobalPiniaStore, { stores: [store] })

  interceptAxios({
    router,
    quasar,
    asteroid,
    storeConfig: {
      refresh: store.refresh,
      clear: store.clear
    }
  })

  addRoutes(router)

  beforeEach({
    asteroid,
    isPinia: true,
    quasar,
    router,
    store
  })
}
