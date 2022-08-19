export default (type, payload) => window.postMessage({ type, ...payload })
