import { LocalStorage } from 'quasar'
import axios from 'axios'
import handleProcess from '../helpers/handle-process'
import getState from '../helpers/get-state'
import getActionPayload from '../helpers/get-action-payload'
import { hasString } from '../helpers/string'
import postMessage from '../helpers/post-message'

const storeAdapter = handleProcess(() => process.env.STORE_ADAPTER, 'vuex')
const isPinia = storeAdapter === 'pinia'

function setAuthorizationHeader (accessToken) {
  if (hasString(accessToken)) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    postMessage('updateAccessToken', { accessToken })
  } else {
    delete axios.defaults.headers.common.Authorization
  }
}

// mutations functions
function replaceAccessToken (accessToken = '') {
  setAuthorizationHeader(accessToken)
  LocalStorage.set('accessToken', accessToken)

  const state = getState.call(this, { isPinia, resource: 'hub' })
  state.accessToken = accessToken
}

function replaceUser (user = {}) {
  LocalStorage.set('user', user)

  const state = getState.call(this, { isPinia, resource: 'hub' })
  state.user = user

  postMessage('updateUser', { user })
}

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

// Listen access token requests.
window.addEventListener('message', ({ data }) => {
  if (data.type === 'requestAccessToken') {
    postMessage('responseAccessToken', { accessToken: stateData().accessToken })
  }

  if (data.type === 'requestUser') {
    postMessage('responseUser', { user: stateData().user })
  }
})

export default {
  ...(!isPinia && { namespaced: true }),

  state: stateData,
  getters,
  actions
}
