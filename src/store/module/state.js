// Vuex | Pinia module.
const stateData = () => {
  return {
    accessToken,
    user: LocalStorage.getItem('user') || {}
  }
}
