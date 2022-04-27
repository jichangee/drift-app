import axios from 'axios'
import { message } from 'antd'
import Cookies from 'js-cookie'
import { DRIFT_TOKEN } from '@/lib/hooks/use-signed-in'

const request = axios.create({
  baseURL: 'http://localhost:3000'
})

const errorHandler = ({ response }) => {
  const data = response.data
  if (data.error) {
    message.error(data.error)
  } else if (data.message) {
    message.info(data.message)
  }
  return Promise.reject()
}

request.interceptors.request.use(config => {
  if (Cookies.get(DRIFT_TOKEN) && !config.headers['authorization']) {
    config.headers['authorization'] = 'Bearer ' + Cookies.get(DRIFT_TOKEN)
  }
  return config
})

request.interceptors.response.use(response => {
  console.log('response', response)
  if (response.status >= 200 && response.status < 300) {
    return response.data
  }
  return Promise.reject()
}, errorHandler)

export default request