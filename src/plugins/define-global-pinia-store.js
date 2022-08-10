/**
 * Adiciona uma variável global "$piniaStore" para ter acesso as stores sem ter que importar elas.
 *
 * @example app.use(defineGlobalPiniaStore, { stores: [myUsersStore()] })
 *
 * Desta forma em nossa aplicação Vue, considerate que o "id" de "myUserStore" seja "users" 
 * poderíamos acessar a store "myUserStore" da seguinte maneira:
 *
 * @example this.$piniaStore.users.list // retorna o state list de users
 */
export default {
  install: (app, options = {}) => {
    const piniaStore = {}

    for (const store of options.stores) {
      piniaStore[store.$id] = store
    }

    app.config.globalProperties.$piniaStore = piniaStore
  }
}
