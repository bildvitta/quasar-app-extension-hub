import { useCanWrapper, Can, CanAny } from '@bildvitta/composables'
import { useStore } from 'vuex'

/**
 * @returns {{
 *  can: import('@bildvitta/composables').Can,
 *  canAny: import('@bildvitta/composables').CanAny
 * }}
 */
export default function () {
  const store = useStore().state.hub.user

  return useCanWrapper({ store })
}
