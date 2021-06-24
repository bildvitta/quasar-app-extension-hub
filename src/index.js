module.exports = function (api) {
  api.extendQuasarConf(quasar => {
    // Boot
    const boots = [
      'auth'
    ]

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
