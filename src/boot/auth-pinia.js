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

  const { quasar } = getGlobalVariables({ app, Vue })

  app.use(DefineGlobalPiniaStore, { stores: [store] })

  interceptAxios({
    router,
    quasar,
    storeConfig: {
      refresh: store.refresh,
      clear: store.clear
    }
  })

  addRoutes(router)

  beforeEach({
    isPinia: true,
    quasar,
    router,
    store
  })

  const canFn = can(() => store.user)
  app.config.globalProperties.$can = canFn
}
