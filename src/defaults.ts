import { AxiosRequestConfig } from './types'
import { processHeaders } from './helps/headers'
import { transformRequest, transformResponse } from './helps/data'


const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        comon: {
            Accept: 'application/json,text/pain,*/*'
        }
    },
    transformRequest: [function (data: any, headers: any): any {
        processHeaders(headers, data)
        return transformRequest(data)
    }],
    transformRespons: [
        function (data: any): any {
            return transformResponse(data)
        }
    ],
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN'
}

const methodNoData = ['delete', 'get', 'head', 'options']
methodNoData.forEach((method) => {
    defaults.headers[method] = {}
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach((method) => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults