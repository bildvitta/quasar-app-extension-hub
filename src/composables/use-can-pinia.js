import { useCanWrapper } from '@bildvitta/composables'
import hubStore from '../store/pinia-hub-store'

export default function () {
  const store = hubStore()

  return useCanWrapper({ store })
}
