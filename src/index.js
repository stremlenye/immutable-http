import { deprecate } from 'core-decorators'
import validate from './validate'
import { addQueryParams, mixinDynamicSegmentsValues } from './utils/url'

const identity = x => x

const defaultParams = {
  executor: null,
  url: null,
  method: null,
  headers: [],
  body: null,
  responseType: null,
  dynamicSegments: [],
  queryParams: [],
  bodyProcessor: identity,
  responseProcessor: identity
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
 * @typedef {[key: string, value: string]} Tuple
 */

 /**
  * @typedef {Object} HttpRequestParams
  * @property {string} url resource url
  * @property {string} method HTTP method,
  * @property {Tuple[]} headers array of HTTP headers key-value pairs
  * @property {Object} body request payload
  * @property {string} responseType response type
  * @property {Tuple[]} dynamicSegments key-value array of replacements for the provided url
  * @property {Tuple[]} queryParams key-value array of url params
  * @property {function(x: Object): Object} bodyProcessor map body function
  * @property {function(x: Object): Object} responseProcessor map response function
  * @property {function(url: string, method: string, headers: string[], responseType: string, body: Object): Promise} executor performs HTTP request and returns Promise,
  */

//executor: function(url: string, method: string, headers: string[], responseType: string, body: Object): Promise,
//bodyProcessor: function(x: Object): Object, responseProcessor: function(x: Object): Object

/**
 * Http request object.
 * Expose chainable API
 */
export default class Http {

  /**
   * @param {HttpRequestParams} params - HTTP request params
   */
  constructor (params = defaultParams) {
    const internals = new Internals(params)
    /**
     * @ignore
     */
    this.internals = () => internals
  }

  /**
   * Set the middleware that will perform the request
   * @param {function(url: string, method: string, headers: string[], responseType: string, body: Object): Promise} executor -
   * function which performs the request asynchroniously and returns Promise back
   * @returns {Object} Http object
   */
  executor (executor) {
    return new Http(Object.assign({}, this.internals(), { executor }))
  }

  /**
   * Adds URL information to HTTP request model
   * @param {string} url - URL
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
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
   * @deprecated since version 0.2.0
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
   * @param {string} header - valid header key
   * @param {string} value - valid header value
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
   */
  @deprecate
  withHeader (header, value) {
    return this.header(header, value)
  }

  /**
   * Adds header to request model
   * @param {string} header - valid header key
   * @param {string} value - valid header value
   * @returns {Object} Http object
   */
  header (header, value) {
    const headers = this.internals().headers.concat([[header, value]])
    return new Http(Object.assign({}, this.internals(), { headers }))
  }

  /**
   * Adds body to request model
   * @param {Object} body - request payload
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
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
   * @param {string} responseType - Proper values could be obtained form
   * XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
   */
  @deprecate
  withResponseType (responseType) {
    return this.responseType(responseType)
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @param {string} responseType - Proper values could be obtained form
   * XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @returns {Object} Http object
   */
  responseType (responseType) {
    return new Http(Object.assign({}, this.internals(), { responseType }))
  }

  /**
   * Adds dynamic segment value
   * @param {string} segment - segment key
   * @param {string} value - segment value
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
   */
  @deprecate
  withDynamicSegment (segment, value) {
    return this.segment(segment, value)
  }

  /**
   * Adds dynamic segment value
   * @param {string} segment - segment key
   * @param {string} value - segment value
   * @returns {Object} Http object
   */
  segment (segment, value) {
    const dynamicSegments
      = this.internals().dynamicSegments.concat([[segment, value]])
    return new Http(Object.assign({}, this.internals(), { dynamicSegments }))
  }

  /**
   * Adds query string param
   * @param {string} name - param key
   * @param {string} value - param value
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
   */
  @deprecate
  withParam (name, value) {
    return this.query(name, value)
  }

  /**
   * Adds query string param
   * @param {string} name - param key
   * @param {string} value - param value
   * @returns {Object} Http object
   */
  query (name, value) {
    const queryParams = this.internals().queryParams.concat([[name, value]])
    return new Http(Object.assign({}, this.internals(), { queryParams }))
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   * @param {function(x: Object): Object } bodyProcessor - f(x) => valid_http_body
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
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
   * Sets the function which gets the response and produces another value
   * Useful for default HTTP error handling
   *
   * @example
   * response => {
   *  switch(response.code) {
   *    case "404":
   *      return { message: 'Resource not found' }
   *  }
   *}
   *
   * @param {func} responseProcessor - f(x) => y
   * @returns {Object} Http object
   */
  responseProcessor (responseProcessor) {
    return new Http(Object.assign({}, this.internals(), { responseProcessor }))
  }

  /**
   * Sets response type to 'json'
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
   */
  @deprecate
  withJsonResponse () {
    return this.withResponseType('json')
  }

  /**
   * Predifine body sringification and Content-Type attribute.
   * @returns {Object} Http object
   * @deprecated since version 0.2.0
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
    const {
      url, method, headers, responseType, dynamicSegments, queryParams, body,
      bodyProcessor, responseProcessor, executor
    } = this.internals()
    if (!executor) {
      throw new Error('executor was not set')
    }
    const errors = validate(url, method, headers, responseType)
    if (errors.length !== 0)
      throw new Error(errors.join('\n'))
    const urlWithDynamicSegments
      = mixinDynamicSegmentsValues(url, dynamicSegments)
    const fullUrl = addQueryParams(urlWithDynamicSegments, queryParams)
    return executor(
      fullUrl, method, headers, responseType, bodyProcessor(body)
    ).then(responseProcessor)
  }
}
