import piniaHubStore from '../store/pinia-hub-store.js'
import defineGlobalPiniaStore from '../plugins/define-global-pinia-store.js'

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

  if (isLatestQuasar) {
    app.use(defineGlobalPiniaStore, { stores: [store] })
  }

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
