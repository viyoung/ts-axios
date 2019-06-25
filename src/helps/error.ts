import { AxiosRequestConfig, AxiosResponse } from '../types/index'
import { request } from 'https'

export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    resquest?: any,
    response?: AxiosResponse
  ) {
    super(message)
    this.config = config
    this.code = code
    this.request = resquest
    this.response = response
    this.isAxiosError = true
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  resquest?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
