import type HttpStatusCode from '../enums/HttpStatusCode'

export default class Exception extends Error {
  readonly code: HttpStatusCode | HttpStatusCode.INTERNAL_SERVER_ERROR
  constructor (message: string, code: HttpStatusCode) {
    super(message)
    this.code = code
  }
}
