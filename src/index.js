module.exports = function (api) {
  const hubConfigPath = 'hub.config.js'
  const fs = require('fs')

  // verifica se existe o arquivo "hub.config.js" na raiz do projeto
  const hasHubConfigFile = fs.existsSync(hubConfigPath)

  // caminho do arquivo "hub.config.js"
  const aliasPath = hasHubConfigFile
    ? api.resolve.app(hubConfigPath)
    : api.resolve.src('./templates/hub.config.js')

  // importa o arquivo "hub.config.js"
  const hubConfig = require(aliasPath)

  api.extendQuasarConf(quasar => {
    // Boot
    const boots = []

    api.compatibleWith('axios', '>=0.21.1')

    const quasarVersion = api.getPackageVersion('quasar')
    const [quasarMajorVersion] = quasarVersion.split('.')

    const isLatestQuasar = Number(quasarMajorVersion) === 2
    const isPinia = api.hasPackage('pinia')
    const usePinia = isPinia && isLatestQuasar

    /**
     * Adiciona o boot de login de desenvolvimento apenas se:
     * - O ambiente for diferente de produção.
     * - Conter a extensão do asteroid.
     * - Estiver utilizando a versão "2" do Quasar.
     */
    if (
      process.env.ENVIRONMENT !== 'production' &&
      hubConfig?.hasAsteroid &&
      isLatestQuasar
    ) {
      boots.push('auth-dev-login')
    }

    boots.push(usePinia ? 'auth-pinia' : 'auth-vuex')

    console.log(
      `Hub está utilizando adapter store: ${usePinia ? 'pinia' : 'vuex'}`
    )

    boots.forEach(boot => {
      quasar.boot.push(`~@bildvitta/quasar-app-extension-hub/src/boot/${boot}.js`)
    })

    // Plugins
    const plugins = [
      'LocalStorage',
      'Notify'
    ]

    plugins.forEach(plugin => quasar.framework.plugins.push(plugin))

    // Transpile dependencies
    quasar.build.transpileDependencies.push(/quasar-app-extension-hub[\\/]src[\\/]boot/)
  })

  api.extendWebpack(webpack => {
    // Adiciona um "alias" chamado "hub" para a aplicação, necessário quando usar pinia
    const hub = 'node_modules/@bildvitta/quasar-app-extension-hub/src/globals'

    webpack.resolve.alias = {
      ...webpack.resolve.alias,

      hub: api.resolve.app(hub),
      hubConfig: aliasPath
    }
  })
}
