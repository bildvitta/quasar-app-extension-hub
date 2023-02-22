import { Notify } from 'quasar'
import hubConfig from '../shared/default-hub-config.js'

const { hasAsteroid } = hubConfig

// custom config but same as config from asteroid
export const notifyConfig = {
  color: 'grey-9',
  progress: true,
  closeBtn: 'x',
  position: 'top',
  caption: true,
  timeout: 4000
}

export const notifyError = message => {
  if (!hasAsteroid) {
    return import('asteroid').then(({ NotifyError }) => NotifyError?.(message))
  }

  return Notify.create({ ...notifyConfig, message, classes: 'qas-notification--error' })
}
