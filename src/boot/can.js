export default async ({ Vue, store }) => {
  function can (permission, entity) {
    try {
      const { userPermissions, isSuperuser } = store.getters['hub/user']

      if (isSuperuser) return true

      if (Object.prototype.hasOwnProperty.call(userPermissions, permission)) {
        if (entity) {
          return userPermissions[permission] === '*' || userPermissions[permission].includes(entity)
        }
        return true
      }
    } catch {
      return false
    }
  }

  Vue.prototype.$can = can
}
