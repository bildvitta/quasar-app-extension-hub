module.exports = {
  hasAsteroid: true, // usado caso tenha extensão @bildvitta/asteroid instalada na aplicação
  forbiddenRouteName: 'Forbidden', // usado para definir o nome da rota da pagina de erro 404 (Forbidden)
  storeAdapter: 'vuex', // usado para definir qual store esta utilizando na aplicação "vuex" ou "pinia"
  development: { // ambiente de desenvolvimento
    localhost: {
      useAutomaticLogin: true, // usado para definir se o login automático sera feito
      environment: 'development', // flag para definir o ambiente
      url: '' // url do ambiente a ser acessado
    },

    preview: {
      useAutomaticLogin: true, // usado para definir se o login automático sera feito
      environment: 'temporary', // flag para definir o ambiente
      url: '' // url do ambiente a ser acessado
    }
  },
  defaultFilters: {} // usado para deixar dinâmico e personalizável o filtro padrão salvo no storage.
}
