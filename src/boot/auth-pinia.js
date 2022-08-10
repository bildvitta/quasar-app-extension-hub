import piniaHubStore from '../store/pinia-hub-store.js'
import defineGlobalPiniaStore from '../plugins/define-global-pinia-store.js'
import { getGlobalVariables, interceptAxios, addRoutes, beforeEach } from '../helpers/auth-boot.js'

export default async ({ router, app, Vue }) => {
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
    quasar,
    asteroid,
    storeConfig: {
      refresh: store.refresh,
      clear: store.clear
    }
  })

  addRoutes(router)

  beforeEach({
    router,
    getUser: store.getUser,
    hasAccessToken: store.hasAccessToken,
    hasUser: store.hasUser
  })
}
