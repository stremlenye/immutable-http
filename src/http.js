import { deprecate } from 'core-decorators'
import exec from './exec'
import validate from './validate'

const defaultBodyProcessor = b => b

const defaultParams = {
  url: null,
  method: null,
  headers: new Map(),
  body: null,
  responseType: null,
  dynamicSegments: new Map(),
  queryParams: new Map(),
  bodyProcessor: defaultBodyProcessor
}

class Internals {
  constructor (params) {
    Object.entries(params)
      .map(([key, value]) =>
        Object.defineProperty(this, key, {
          get: () => value,
          enumerable: true,
          configurable: true
        }))
  }
}

/**
 * Http request object.
 * Expose chainable API
 */
export default class Http {
  constructor (params = defaultParams) {
    const internals = new Internals(params)
    this.internals = () => internals
  }

  /**
   * Adds URL information to HTTP request model
   * @param {string} url - URL
   * @returns {Object} Http object
   */
  @deprecate
  withUrl (url) {
    return this.url(url)
  }

  /**
   * Adds URL information to HTTP request model
   * @param {string} url - URL
   * @returns {Object} Http object
   */
  url (url) {
    return new Http(Object.assign({}, this.internals(), { url }))
  }

  /**
   * Adds HTTP method information to request model
   * @param {string} method - HTTP method
   * @returns {Object} Http object
   */
  @deprecate
  withMethod (method) {
    return this.method(method)
  }

  /**
   * Adds HTTP method information to request model
   * @param {string} method - HTTP method
   * @returns {Object} Http object
   */
  method (method) {
    return new Http(Object.assign({}, this.internals(), { method }))
  }

  /**
   * Adds header to request model
   * @param {String} header - valid header key
   * @param {String} value - valid header value
   * @returns {Object} Http object
   */
  @deprecate
  withHeader (header, value) {
    return this.header(header, value)
  }

  /**
   * Adds header to request model
   * @param {String} header - valid header key
   * @param {String} value - valid header value
   * @returns {Object} Http object
   */
  header (header, value) {
    const headers = new Map(this.internals().headers).set(header, value)
    return new Http(Object.assign({}, this.internals(), { headers }))
  }

  /**
   * Adds body to request model
   * @param {Object} body - request payload
   * @returns {Object} Http object
   */
  @deprecate
  withBody (body) {
    return this.body(body)
  }

  /**
   * Adds body to request model
   * @param {Object} body - request payload
   * @returns {Object} Http object
   */
  body (body) {
    return new Http(Object.assign({}, this.internals(), { body }))
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @param {String} responseType - Proper values could be obtained form
   * XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @returns {Object} Http object
   */
  @deprecate
  withResponseType (responseType) {
    return this.responseType(responseType)
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @param {String} responseType - Proper values could be obtained form
   * XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @returns {Object} Http object
   */
  responseType (responseType) {
    return new Http(Object.assign({}, this.internals(), { responseType }))
  }

  /**
   * Adds dynamic segment value
   * @param {String} segment - segment key
   * @param {String} value - segment value
   * @returns {Object} Http object
   */
  @deprecate
  withDynamicSegment (segment, value) {
    return this.segment(segment, value)
  }

  /**
   * Adds dynamic segment value
   * @param {String} segment - segment key
   * @param {String} value - segment value
   * @returns {Object} Http object
   */
  segment (segment, value) {
    const dynamicSegments
      = new Map(this.internals().dynamicSegments).set(segment, value)
    return new Http(Object.assign({}, this.internals(), { dynamicSegments }))
  }

  /**
   * Adds query string param
   * @param {String} name - param key
   * @param {String} value - param value
   * @returns {Object} Http object
   */
  @deprecate
  withParam (name, value) {
    return this.query(name, value)
  }

  /**
   * Adds query string param
   * @param {String} name - param key
   * @param {String} value - param value
   * @returns {Object} Http object
   */
  query (name, value) {
    const queryParams = new Map(this.internals().queryParams).set(name, value)
    return new Http(Object.assign({}, this.internals(), { queryParams }))
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   * @param {func} bodyProcessor - f(x) => valid_http_body
   * @returns {Object} Http object
   */
  @deprecate
  withBodyProccessor (bodyProcessor) {
    return this.bodyProcessor(bodyProcessor)
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   * @param {func} bodyProcessor - f(x) => valid_http_body
   * @returns {Object} Http object
   */
  bodyProcessor (bodyProcessor) {
    return new Http(Object.assign({}, this.internals(), { bodyProcessor }))
  }

  /**
   * Sets response type to 'json'
   * @returns {Object} Http object
   */
  @deprecate
  withJsonResponse () {
    return this.withResponseType('json')
  }

  /**
   * Predifine body sringification and Content-Type attribute.
   * @returns {Object} Http object
   */
  @deprecate
  withJsonBody () {
    return this.withHeader('Content-Type', 'application/json')
    .withBodyProccessor(JSON.stringify)
  }

  /**
   * Executes HTTP request
   * @returns {Object} - Promise
   */
  exec () {
    validate(this.internals())
    return exec(this.internals())
  }
}