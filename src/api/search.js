import { jsonp } from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export const getHotKey = () => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1
  })
  options.name = 'getHotKey'

  return jsonp(url, data, options)
}

export const search = (query, page, zhida, perpage) => {
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
