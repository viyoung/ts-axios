import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helps/headers'
import { createError } from '../helps/error'
import { isURLSameOrigin } from '../helps/url';
import { isFormData } from '../helps/util'
import cookie from './../helps/cookie'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus,
    } = config

    const request = new XMLHttpRequest()
    request.open(method.toUpperCase(), url!, true)
    configureRequest();
    addEvents();
    processHeaders();
    processCancel();
    request.send(data)

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort();
          reject(reason)
        })
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      if (withCredentials || isURLSameOrigin(url!) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }
      if (auth) {
        headers['Authorization'] = 'Bsaic' + btoa(auth.username + ':' + auth.password)
      }
      Object.keys(headers).forEach(name => {
        if (data === null && name.toLocaleLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      request.onerror = function handleError() {
        reject(createError('network error', config, null, request))
      }
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }
        if (request.status === 0) {
          return
        }
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'econnaborted', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Reqest failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }

  })
}
