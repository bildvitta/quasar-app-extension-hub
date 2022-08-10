function _getStateOrGetters ({ entity, key, model }) {
  if (this.$piniaStore) {
    return this.$piniaStore[entity]?.[key]
  }

  return this.$store.getters[model][`${entity}/${key}}`]
}

/**
 * Função para retornar "action" do pinia ou vuex
 *
 * @param {entity} string - entidade da store que deseja
 * @param {key} string - chave com o nome da action que deseja
 * @param {object} payload - payload da action
 *
 * @example getAction.call(this, { entity: 'users', key: 'destroy', payload: { id: 'meu-id' } })
 */
function getAction ({ entity, key, payload }) {
  if (this.$piniaStore) {
    return this.$piniaStore[entity]?.[key](payload)
  }

  return this.$store.dispatch(`${entity}/${key}}`, payload)
}

/**
 * Função para retornar "getter" do pinia ou vuex
 *
 * @param {entity} string - entidade da store que deseja
 * @param {key} string - chave com o nome do getter que deseja
 *
 * @example getGetter.call(this, { entity: 'users', key: 'byId')('meu-id')
 */
function getGetter ({ entity, key }) {
  return _getStateOrGetters.call(this, ({ key, entity, model: 'getters' }))
}

/**
 * Função para retornar "state" do pinia ou vuex
 *
 * @param {entity} string - entidade da store que deseja
 * @param {key} string - chave com o nome do state que deseja
 *
 * @example getState.call(this, { entity: 'users', key: 'list')
 */
function getState ({ entity, key }) {
  return _getStateOrGetters.call(this, { key, entity, model: 'state' })
}

export {
  getAction,
  getGetter,
  getState
}
