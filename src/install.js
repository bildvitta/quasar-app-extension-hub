module.exports = function (api) {
  api.onExitLog('A extensão Hub foi instalada. 😍')

  // adicionar arquivo de configuração da sdk do hub.
  api.renderFile(
    // caminho do arquivo importado
    './templates/hub.config.js',
    'hub.config.js'
  )
}
