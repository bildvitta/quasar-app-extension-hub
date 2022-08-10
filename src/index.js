// import handleProcess from ''
// const handleProcess = require('./helpers/handle-process.js')

module.exports = function (api) {
  api.extendQuasarConf(quasar => {
    // Boot
    const boots = [
      // 'auth',
      'can'
    ]

    api.compatibleWith('axios', '>=0.21.1')

    // const storeAdapter = handleProcess(() => process.env.STORE_ADAPTER, 'vuex')
    console.log(quasar.build.env.STORE_ADAPTER, '>>> process.env.STORE_ADAPTER')
    const isPinia = process.env.STORE_ADAPTER === 'pinia'

    boots.push(
      isPinia ? 'auth-pinia' : 'auth-vuex'
    )

    boots.forEach(boot => quasar.boot.push(`~@bildvitta/quasar-app-extension-hub/src/boot/${boot}.js`))

    // Plugins
    const plugins = [
      'LocalStorage'
    ]
  
    plugins.forEach(plugin => quasar.framework.plugins.push(plugin))

    // Transpile dependencies
    quasar.build.transpileDependencies.push(/quasar-app-extension-hub[\\/]src[\\/]boot/)
  })
}
