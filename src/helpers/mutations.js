import { LocalStorage } from 'quasar'
import setAuthorizationHeader from './set-authorization-header.js'
import { getStateFromAction } from '@bildvitta/store-adapter'
import postMessage from './post-message.js'

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

  setDefaultFiltersInStorage(user)

  /**
   * Se existe a propriedade "currentMainCompany" no usuário, então é feito uma busca
   * no array de "companyLinksOptions" para encontrar o valor correspondente e setar
   * como valor padrão para o filtro de empresa, caso não encontre ou então não exista a
   * propriedade "currentMainCompany", então é setado o primeiro valor do array de "companyLinksOptions".
   */
  function setDefaultFiltersInStorage (user) {
    const defaultFiltersFromStorage = LocalStorage.getItem('defaultFilters') || {}

    const firstCompanyLinkOptionValue = user.companyLinksOptions.at(0)?.value

    const defaultCompany = user.currentMainCompany
      ? user.companyLinksOptions.find(({ value }) => value === user.currentMainCompany)?.value || firstCompanyLinkOptionValue
      : firstCompanyLinkOptionValue

    LocalStorage.set('defaultFilters', {
      ...defaultFiltersFromStorage,
      company: defaultCompany
    })
  }
}
