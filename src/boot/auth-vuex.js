import hubModule from '../store/hub.js'

import can from '../helpers/can.js'

import {
  addRoutes,
  beforeEach,
  getGlobalVariables,
  interceptAxios
} from '../helpers/auth-boot.js'

export default ({ router, app, Vue, store }) => {
  const {
    isLatestQuasar,
    quasar
  } = getGlobalVariables({ app, Vue })

  store.registerModule('hub', hubModule)

  interceptAxios({
    router,
    quasar,
    storeConfig: {
      refresh: () => store.dispatch('hub/refresh'),
      clear: () => store.dispatch('hub/clear')
    }
  })

  addRoutes(router)

  beforeEach({
    isPinia: false,
    quasar,
    router,
    store
  })

  const canFn = can(() => store.state.hub.user)

  if (isLatestQuasar) {
    app.config.globalProperties.$can = canFn
  } else {
    Vue.prototype.$can = canFn
  }
}
