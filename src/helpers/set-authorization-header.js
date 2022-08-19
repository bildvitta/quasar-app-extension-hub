import axios from 'axios'
import postMessage from './post-message.js'
import { hasString } from './string.js'

export default accessToken => {
  if (hasString(accessToken)) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    postMessage('updateAccessToken', { accessToken })
  } else {
    delete axios.defaults.headers.common.Authorization
  }
}
