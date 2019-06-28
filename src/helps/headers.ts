import { isPlainObject, deepMerge } from './util'
import { Method } from '../types';

function normalizeHeaderName(headers: any, normalzedName: string): void {
  if (!headers) {
    return
  }

  Object.keys(headers).forEach(name => {
    if (name !== normalzedName && name.toUpperCase() === normalzedName.toUpperCase()) {
      headers[normalzedName] = headers[name]
      delete headers[name]
    }
  })
}

export function processHeaders(headers: any, data: any): any {
  normalizeHeaderName(headers, 'Content-Type')
  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;chartset=utf-8'
    }
  }
  return headers
}

export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) return parsed
  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLocaleLowerCase()
    if (!key) return
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })
  return parsed
}

export function flattenHeaders(headers: any, method: Method): any {
  if (!headers) {
    return
  }
  headers = deepMerge(headers.common, headers[method], headers)
  const methodToDelete = ['delete', 'get', 'heade', 'options', 'post', 'put', 'patch', 'common']
  methodToDelete.forEach((method) => {
    delete headers[method]
  })
  return headers
}
