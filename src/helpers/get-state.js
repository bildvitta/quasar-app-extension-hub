/**
 * @example getState.call(this, { isPinia: true })
 * @example getState.call(this, { isPinia: false, resource: 'users' })
 */
export default function (params = {}) {
  const { isPinia, resource } = params

  return isPinia ? this : this.state?.[resource]
}
