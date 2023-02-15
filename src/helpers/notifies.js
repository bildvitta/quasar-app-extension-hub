import handleProcess from './handle-process.js'
import { Notify } from 'quasar'

const hasAsteroid = handleProcess(() => process.env.HAS_ASTEROID, true)

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
    return import('asteroid').then(({ NotifyError }) => {
      return NotifyError ? NotifyError?.(message) : Notify.create({ ...notifyConfig, message })
    })
  }

  return Notify.create({ ...notifyConfig, message, classes: 'qas-notification--error' })
}
