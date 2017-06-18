import { stringify } from 'query-string'
import axios from 'axios'

// encapsulate the request method
export function getIqiyiResponse (api, params = {}) {
  const instance = axios.create({
    baseURL: baseURL,
    params: commonParams,
    paramsSerializer: params => {
      return stringify(params)
    }
  })

  instance.interceptors.request.use(config => {
    const api = config.url.substr(config.url.lastIndexOf('/') + 1)
    switch (api) {
      case 'search':
        config.params = Object.assign(config.params, privateParam.search)
        break
      case 'recommend':
        break
      case 'channel':
        config.params = Object.assign(config.params, privateParam.channel)
        break
    }
    return config
  }, error => {
    return Promise.reject(error)
  })

  instance.interceptors.response.use(response => {
    response = response.data
    return response
  }, error => {
    return Promise.reject(error)
  })

  return instance.get(api, {
    params: params
  })
}

const baseURL = 'http://iface.qiyi.com/openapi/batch/'

const commonParams = {
  app_k: 'f0f6c3ee5709615310c0f053dc9c65f2',
  app_v: 8.4,
  app_t: 0,
  platform_id: 12,
  dev_os: '10.3.1',
  dev_ua: 'iPhone9,3',
  dev_hw: '{"cpu":0,"gpu":"","mem":"50.4MB"}',
  net_sts: 1,
  scrn_sts: 1,
  scrn_res: '1334*750',
  scrn_dpi: 153600,
  qyid: '87390BD2-DACE-497B-9CD4-2FD14354B2A4',
  secure_v: 1,
  secure_p: 'iPhone',
  core: 1,
  req_sn: Date.now(),
  req_times: 1
}

const privateParam = {
  channel: {
    version: '1.0'
  },
  recommend: {
  },
  search: {
    from: 'mobile_list',
    version: 7.5
  }
}

