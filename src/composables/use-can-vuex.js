import { useCanWrapper } from '@bildvitta/composables'
import { useStore } from 'vuex'

/**
 * @desc Composable base para permissionamento de tela
 *
 * @example
 * ```js
 * const { can, canAny } = useCan({ store })
 *
 * can('users.list') // true | false
 * can('companies.list', 'companies') // true | false
 *
 * canAny(['users.list', 'users.show']) // true | false
 * canAny(['companies.list', 'companies.delete'], 'companies') // true | false
 * ```
 */
export default function () {
  return useCanWrapper({ store: useStore().state.hub.user })
}
