import { LocalStorage } from 'quasar'
import setAuthorizationHeader from './set-authorization-header.js'
import { getStateFromAction } from '@bildvitta/store-adapter'
import postMessage from './post-message.js'
import { camelize } from 'humps'
import hubConfig from 'hubConfig'

// mutations functions
export function replaceAccessToken ({ accessToken = '', isPinia }) {
  setAuthorizationHeader(accessToken)
  LocalStorage.set('accessToken', accessToken)

  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })
  state.accessToken = accessToken
}

export function replaceUser ({ user = {}, isPinia }) {
  const state = getStateFromAction.call(this, { isPinia, resource: 'hub' })

  for (const key in user.companyPermissions) {
    user.companyPermissions[key] = user.companyPermissions[key].map(permission => {
      return camelize(permission)
    })
  }

  LocalStorage.set('user', user)

  state.user = user

  postMessage('updateUser', { user })

  setDefaultFiltersInStorage(user)

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

    // Objeto passado no hubConfig, no qual a chave representa a chave que vem do /me e e o valor, a chave que vai salvar no storage.
    const { defaultFilters: defaultFiltersConfig = {} } = hubConfig

    const defaultFilters = {}
    
    // Loopa as chaves recebidas de configuração e seta o primeiro item como default.
    for (const key in defaultFiltersConfig) {
      defaultFilters[defaultFiltersConfig[key]] = user[key]?.at(0)?.value
    }

    LocalStorage.set('defaultFilters', {
      ...defaultFilters,
      ...defaultFiltersFromStorage,
      company: defaultCompany
    })
  }
}
