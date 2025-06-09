import fs from 'fs'

export default async function (api) {
  const hubConfigPath = 'hub.config.js'

  // verifica se existe o arquivo "hub.config.js" na raiz do projeto
  const hasHubConfigFile = fs.existsSync(hubConfigPath)

  // caminho do arquivo "hub.config.js"
  const aliasPath = hasHubConfigFile
    ? api.resolve.app(hubConfigPath)
    : api.resolve.src('./templates/hub.config.js')

  // importa o arquivo "hub.config.js"
  const { default: hubConfig } = await import(aliasPath)

  api.extendQuasarConf(quasar => {
    // Boot
    const boots = []

    api.compatibleWith('axios', '>=0.21.1')

    const quasarVersion = api.getPackageVersion('quasar')
    const [quasarMajorVersion] = quasarVersion.split('.')

    const isLatestQuasar = Number(quasarMajorVersion) === 2
    const isPinia = api.hasPackage('pinia')
    const usePinia = isPinia && isLatestQuasar
		console.log("TCL: isPinia", { isPinia, usePinia, isLatestQuasar })

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

    boots.forEach(boot => {
      quasar.boot.push(`~@bildvitta/quasar-app-extension-hub/src/boot/${boot}.js`)
    })

    // Plugins
    const plugins = [
      'LocalStorage',
      'Notify'
    ]

    plugins.forEach(plugin => quasar.framework.plugins.push(plugin))

    console.log("TCL: api.hasWebpack", api.hasWebpack)
      // Transpilação de arquivos!
    if (api.hasWebpack) {
      const transpileTarget = (
        quasar.build.webpackTranspileDependencies || // q/app-webpack >= v4
        quasar.build.transpileDependencies // q/app-webpack v3
      )
      console.log("TCL: quasar.build.transpileDependencies", quasar.build)

      console.log("TCL: transpileTarget", transpileTarget)
      transpileTarget.push(/quasar-app-extension-hub[\\/]src[\\/]boot/)
    }
  })

  const alias = {
    hub: api.resolve.app('node_modules/@bildvitta/quasar-app-extension-hub/src/globals'),
    hubConfig: aliasPath
  }

  if (api.hasVite) {
    api.compatibleWith('@quasar/app-vite', '^2.0.0')

    api.extendViteConf(viteConf => {
      Object.assign(viteConf.resolve.alias, alias)

      // optimizeDeps (necessário para funcionamento do QasMap)
      viteConf.optimizeDeps = viteConf.optimizeDeps || {}
      viteConf.optimizeDeps.include = viteConf.optimizeDeps.include || []
      viteConf.optimizeDeps.include.push(...[
        'humps'
      ])
    })

    return
  }

  console.log("TCL: api.extendWebpack", api.extendWebpack)

  api.extendWebpack(webpack => Object.assign(webpack.resolve.alias, alias))
}
