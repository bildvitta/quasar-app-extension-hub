export default {
  /**
   * @type {boolean=true} hasAsteroid - usado caso tenha extensão @bildvitta/asteroid instalada na aplicação.
   */
  hasAsteroid: true,

  /**
   * @type {string='Forbidden'} forbiddenRouteName - usado para definir o nome da rota da pagina de erro 404 (Forbidden)
   */
  forbiddenRouteName: 'Forbidden',

  /**
   * @type {'vuex'|'pinia'} storeAdapter - usado para definir qual store esta utilizando na aplicação "vuex" ou "pinia"
   */
  storeAdapter: 'vuex',

  development: {
    localhost: {
      /**
       * @type {boolean=true} useAutomaticLogin - usado para definir se o login automático sera feito
       */
      useAutomaticLogin: true,

      /**
       * @type {'temporary'|'development'} environment - flag para definir o ambiente
       */
      environment: 'development',

      /**
       * @type {string} url - url do ambiente a ser acessado
       */
      url: ''
    },

    preview: {
      /**
       * @type {boolean=true} useAutomaticLogin - usado para definir se o login automático sera feito
       */
      useAutomaticLogin: true,

      /**
       * @type {'temporary'|'development'} environment - flag para definir o ambiente
       */
      environment: '',

      /**
       * @type {string} url - url do ambiente a ser acessado
       */
      url: ''
    }
  },

  /**
   * @type {object} defaultFilters - usado para deixar dinâmico e personalizável o filtro padrão salvo no storage.
   */
  defaultFilters: {}
}
