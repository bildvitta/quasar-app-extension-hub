module.exports = function (api) {
  const hubConfigPath = 'hub.config.js'
  const fs = require('fs')

  api.extendQuasarConf(quasar => {
    // Boot
    const boots = []

    api.compatibleWith('axios', '>=0.21.1')

    const quasarVersion = api.getPackageVersion('quasar')
    const [quasarMajorVersion] = quasarVersion.split('.')

    const isLatestQuasar = Number(quasarMajorVersion) === 2
    const isPinia = api.hasPackage('pinia')
    const usePinia = isPinia && isLatestQuasar

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
    console.log(fs.existsSync(hubConfigPath), '>>> achoi?')
    // Adiciona um "alias" chamado "hub" para a aplicação, necessário quando usar pinia
    const hub = 'node_modules/@bildvitta/quasar-app-extension-hub/src/hub.js'

    const hasHubConfigFile = fs.existsSync(hubConfigPath)
    const aliasPath = hasHubConfigFile
      ? api.resolve.app(hubConfigPath)
      : api.resolve.src('./templates/hub.config.js')

    webpack.resolve.alias = {
      ...webpack.resolve.alias,

      hub: api.resolve.app(hub),
      hubConfig: aliasPath
    }
  })
}
