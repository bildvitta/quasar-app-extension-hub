import hubStore from '../store/pinia-hub-store.js'

import { useAppCanWrapper } from '@bildvitta/composables'

/**
 * @desc Composable base para permissionamento de tela v2.
 *
 * ```js
 * const {
 *  can,
 *  canList,
 *  canCreate,
 *  canByPermission,
 *  canEdit,
 *  canDelete,
 *  canShow
 * } = useAppCan()
 *
 * can('users', { action: 'dashboard' })
 * can({ users: { action: 'dashboard' } })
 *
 * canList('users')
 * canList(['users', 'approvals'])
 *
 * canCreate('users')
 * canCreate(['users', 'approvals'])
 *
 * canByPermission('users', { company: 'company1', action: 'dashboard' })
 * canByPermission({ users: { company: ['company1', 'company2'], action: 'dashboard' } })
 *
 * canEdit('users', { company: ['company1', 'company2'] })
 * canEdit({ users: { company: 'company1' } })
 *
 * canDelete('users', { company: 'company1' })
 * canDelete({ users: { company: ['company1', 'company2'] } })
 *
 * canShow('users', { company: 'company1' })
 * canShow({ users: { company: ['company1', 'company2'] } })
 * ```
 */
export default function () {
  return useAppCanWrapper({ store: hubStore().user })
}
