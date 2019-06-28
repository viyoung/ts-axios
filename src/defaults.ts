import { AxiosRequestConfig } from './types'


const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        comon: {
            Accept: 'application/json,text/pain,*/*'
        }
    }
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