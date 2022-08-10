export default (isPinia, ...args) => args[isPinia ? 0 : 1] || {}
