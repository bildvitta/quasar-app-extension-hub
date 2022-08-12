import { LocalStorage } from 'quasar'
import setAuthorizationHeader from './set-authorization-header.js'
import getState from './get-state.js'

// mutations functions
export function replaceAccessToken ({ accessToken = '', isPinia }) {
  setAuthorizationHeader(accessToken)
  LocalStorage.set('accessToken', accessToken)

  const state = getState.call(this, { isPinia, resource: 'hub' })
  state.accessToken = accessToken
}

export function replaceUser ({ user = {}, isPinia }) {
  LocalStorage.set('user', user)

  const state = getState.call(this, { isPinia, resource: 'hub' })
  state.user = user

  postMessage('updateUser', { user })
}
