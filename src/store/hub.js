import axios from 'axios'
import handleProcess from '../helpers/handle-process'
import setAuthorizationHeader from '../helpers/set-authorization-header'
import setMessageEvent from '../helpers/set-message-event'
import { LocalStorage } from 'quasar'
import { hasString } from '../helpers/string'
import { replaceAccessToken, replaceUser } from '../helpers/mutations'
import { getActionPayload } from '@bildvitta/store-adapter'

const storeAdapter = handleProcess(() => process.env.STORE_ADAPTER, 'pinia')
const isPinia = storeAdapter === 'pinia'

// Revive access token from cache.
const accessToken = LocalStorage.getItem('accessToken') || ''
setAuthorizationHeader(accessToken)

// Vuex | Pinia module.
const stateData = () => {
  return {
    accessToken,
    user: LocalStorage.getItem('user') || {}
  }
}

const getters = {
  hasAccessToken: state => hasString(state.accessToken),
  hasUser: state => !!Object.keys(state.user).length,
  userPermissions: state => state.user.userPermissions
}

const actions = {
  clear () {
    replaceAccessToken.call(this, { isPinia })
    replaceUser.call(this, { isPinia })
  },

  async callback (...args) {
    const { code, state } = getActionPayload(isPinia, ...args)

    try {
      const { data } = await axios.get('/auth/callback', {
        params: { code, state }
      })

      replaceAccessToken.call(this, { accessToken: data.accessToken, isPinia })
      return data
    } catch (error) {
      replaceAccessToken.call(this, { isPinia })
      throw error
    }
  },

  async getUser () {
    try {
      const { data } = await axios.get('/users/me')

      replaceUser.call(this, { user: data.result, isPinia })
      return data.result
    } catch (error) {
      replaceUser.call(this, { isPinia })
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
      
      replaceAccessToken.call(this, { accessToken: data.accessToken, isPinia })
      return data
    } catch (error) {
      replaceAccessToken.call(this, { isPinia })
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
    replaceAccessToken.call(this, { accessToken, isPinia })
  },

  setUser (...args) {
    const user = getActionPayload(isPinia, ...args)
    replaceUser.call(this, { user, isPinia })
  }
}

// Listen access token requests.
setMessageEvent(stateData)

export default {
  ...(!isPinia && { namespaced: true }),

  state: stateData,
  getters,
  actions
}
