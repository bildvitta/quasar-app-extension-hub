import { LocalStorage } from 'quasar'
import setAuthorizationHeader from './set-authorization-header.js'
import { getStateFromAction } from '@bildvitta/store-adapter'

// mutations functions
export function replaceAccessToken ({ accessToken = '', isPinia }) {
  setAuthorizationHeader(accessToken)
  LocalStorage.set('accessToken', accessToken)

  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })
  state.accessToken = accessToken
}

export function replaceUser ({ user = {}, isPinia }) {
  LocalStorage.set('user', user)

  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })
  state.user = user

  postMessage('updateUser', { user })
}
