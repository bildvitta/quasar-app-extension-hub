import getActionPayload from '../../helpers/get-action-payload'

const actions = {
  clear () {
    replaceAccessToken.call(this)
    replaceUser.call(this)
  },

  async callback (...args) {
    const { code, state } = getActionPayload(isPinia, ...args)

    try {
      const { data } = await axios.get('/auth/callback', {
        params: { code, state }
      })

      replaceAccessToken.call(this, data.accessToken)
      return data
    } catch (error) {
      replaceAccessToken.call(this)
      throw error
    }
  },

  async getUser () {
    try {
      const { data } = await axios.get('/users/me')

      replaceUser.call(this, data.result)
      return data.result
    } catch (error) {
      replaceUser.call(this)
      throw error
    }
  },

  async login (...args) {
    const { url } = getActionPayload(isPinia, ...args)

    const { data } = await axios.get('/auth/login', {
      params: { url }
    })

    return data.loginUrl
  },

  async logout (...args) {
    const { url } = getActionPayload(isPinia, ...args)

    const { data } = await axios.get('/auth/logout', {
      params: { url }
    })

    return data.logoutUrl
  },

  async refresh () {
    try {
      const { data } = await axios.get('/auth/refresh')
      
      replaceAccessToken.call(this, data.accessToken)
      return data
    } catch (error) {
      replaceAccessToken.call(this)
      throw error
    }
  },

  async getUserMeURL () {
    try {
      const { data } = await axios.get('/users/me/edit')
      return data
    } catch (error) {
      throw error
    }
  },

  setAccessToken (...args) {
    const accessToken = getActionPayload(isPinia, ...args)
    replaceAccessToken.call(this, accessToken)
  },

  setUser (...args) {
    const user = getActionPayload(isPinia, ...args)
    replaceUser.call(this, user)
  }
}