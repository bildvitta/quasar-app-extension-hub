module.exports = function (api) {
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
    // Adiciona um "alias" chamado "hub" para a aplicação, necessário quando usar pinia
    const hub = 'node_modules/@bildvitta/quasar-app-extension-hub/src/hub.js'

    webpack.resolve.alias = {
      ...webpack.resolve.alias,

      hub: api.resolve.app(hub)
    }
  })
}
