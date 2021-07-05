import Vue from 'vue'
import { LocalStorage } from 'quasar'

function isString (string) {
  return typeof string === 'string'
}

function hasString (string) {
  return string && isString(string)
}

// Get the same Axios instance of application.
const axios = Vue.prototype.$axios

function setAuthorizationHeader (accessToken) {
  if (hasString(accessToken)) {
    axios.defaults.headers = { Authorization: `Bearer ${accessToken}` }
  } else {
    delete axios.defaults.headers.Authorization
  }
}

// Revive access token from cache.
const accessToken = LocalStorage.getItem('accessToken') || ''
setAuthorizationHeader(accessToken)

// Vuex module.
const stateData = {
  accessToken,
  user: LocalStorage.getItem('user') || {}
}

const getters = {
  accessToken: state => state.accessToken,
  hasAccessToken: state => hasString(state.accessToken),
  user: state => state.user,
  userPermissions: state => state.user.userPermissions
}

const mutations = {
  replaceAccessToken (state, accessToken = '') {
    setAuthorizationHeader(accessToken)
    LocalStorage.set('accessToken', accessToken)
    state.accessToken = accessToken
  },

  replaceUser (state, user = {}) {
    LocalStorage.set('user', user)
    state.user = user
  }
}

const actions = {
  clear ({ commit }) {
    commit('replaceAccessToken')
    commit('replaceUser')
  },

  async callback ({ commit }, { code, state } = {}) {
    try {
      const { data } = await axios.get('/auth/callback', {
        params: { code, state }
      })

      commit('replaceAccessToken', data.accessToken)
      return data
    } catch (error) {
      commit('replaceAccessToken')
      throw error
    }
  },

  async getUser ({ commit }) {
    try {
      const { data } = await axios.get('/users/me')

      commit('replaceUser', data.user)
      return data
    } catch (error) {
      commit('replaceUser')
      throw error
    }
  },

  async login (context, { url } = {}) {
    const { data } = await axios.get('/auth/login', {
      params: { url }
    })

    return data.loginUrl
  },

  async logout ({ commit }, { url } = {}) {
    const { data } = await axios.get('/auth/logout', {
      params: { url }
    })

    return data.logoutUrl
  },

  async refresh ({ commit, getters }) {
    try {
      const { data } = await axios.get('/auth/refresh')
  
      commit('replaceAccessToken', data.accessToken)
      return data
    } catch (error) {
      commit('replaceAccessToken')
      throw error
    }
  },

  setAccessToken ({ commit }, accessToken) {
    commit('replaceAccessToken', accessToken)
  },

  setUser ({ commit }, user) {
    commit('replaceUser', user)
  }
}

export default {
  namespaced: true,

  state: stateData,
  getters,
  mutations,
  actions
}
