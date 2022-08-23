export default (userCallback = () => {}) => {
  return (permission, entity) => {
    try {
      const user = userCallback()
      const { isSuperuser, userPermissions } = user

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
}
