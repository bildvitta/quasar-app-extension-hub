export default async ({ app, store }) => {
  function can (permission, entity) {
    try {
      const { isSuperuser, userPermissions } = store.getters['hub/user']

      if (isSuperuser) {
        return true
      }

      if (Object.prototype.hasOwnProperty.call(userPermissions, permission)) {
        const userPermission = userPermissions[permission]

        return entity
          ? (userPermission === '*' || userPermission.includes(entity))
          : true
      }
    } catch {
      return false
    }
  }

  app.config.globalProperties.$can = can
}
