import { LocalStorage } from 'quasar'
import setAuthorizationHeader from './set-authorization-header.js'
import { getStateFromAction } from '@bildvitta/store-adapter'
import postMessage from './post-message.js'
import { camelize } from 'humps'

// mutations functions
export function replaceAccessToken ({ accessToken = '', isPinia }) {
  setAuthorizationHeader(accessToken)
  LocalStorage.set('accessToken', accessToken)

  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })
  state.accessToken = accessToken
}

export function replaceUser ({ user = {}, isPinia }) {
  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })

  const _user = user

  for (const key in _user.companyPermissions) {
    _user.companyPermissions[key] = _user.companyPermissions[key].map(permission => {
      return camelize(permission)
    })
  }

  LocalStorage.set('user', _user)

  state.user = _user

  postMessage('updateUser', { user: _user })

  setDefaultFiltersInStorage(_user)

  /**
   * Se existe a propriedade "currentMainCompany" no usuário, então é feito uma busca
   * no array de "companyLinksOptions" para encontrar o valor correspondente e setar
   * como valor padrão para o filtro de empresa, caso não encontre ou então não exista a
   * propriedade "currentMainCompany", então é setado o primeiro valor do array de "companyLinksOptions".
   */
  function setDefaultFiltersInStorage (user = {}) {
    const defaultFiltersFromStorage = LocalStorage.getItem('defaultFilters') || {}

    const firstCompanyLinkOptionValue = user.companyLinksOptions?.at(0)?.value

    const defaultCompany = user.currentMainCompany
      ? user.companyLinksOptions.find(({ value }) => value === user.currentMainCompany)?.value || firstCompanyLinkOptionValue
      : firstCompanyLinkOptionValue

    LocalStorage.set('defaultFilters', {
      ...defaultFiltersFromStorage,
      company: defaultCompany
    })
  }
}
