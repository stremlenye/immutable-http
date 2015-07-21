import { deprecate } from 'core-decorators'
import exec from './exec'
import validate from './validate'

const defaultBodyProcessor = b => b

/**
 * Http request object.
 * Expose chainable API
 */
export default class Http {
  constructor (url = null,
      method = null, headers = new Map(), body = null, responseType = null,
      dynamicSegments = new Map(), queryParams = new Map(),
      bodyProcessor = defaultBodyProcessor) {
    const internals = {
      url, method, headers, body, responseType, dynamicSegments, queryParams,
      bodyProcessor
    }

    /**
     * Url getter
     * @returns {String} URL
     */
    this.url = () => {
      return internals.url
    }

    /**
     * HTTP method getter
     * @returns {String} HTTP method
     */
    this.method = () => {
      return internals.method
    }

    /**
     * HTTP headers getter
     * @returns {Object} object of key-value pairs representing HTTP headers
     */
    this.headers = () => {
      return internals.headers
    }

    /**
     * Body getter
     * @returns {Object} request body
     */
    this.body = () => {
      return internals.body
    }

    /**
     * Response type getter
     * @returns {String} response type
     */
    this.responseType = () => {
      return internals.responseType
    }

    /**
     * Dynamic segments getter
     * @returns {Object} object of key-value pairs <segment_name>:<value>
     */
    this.dynamicSegments = () => {
      return internals.dynamicSegments
    }

    /**
     * Query params getter
     * @returns {Object} object of key-value pairs <param_name>:<value>
     */
    this.queryParams = () => {
      return internals.queryParams
    }

    /**
     * Body processor function
     * @returns {function} Preprocessor function
     */
    this.bodyProcessor = () => {
      return internals.bodyProcessor
    }
  }

  /**
   * Adds URL information to HTTP request model
   * @param {string} url - URL
   * @returns {Object} Http object
   */
  @deprecate
  withUrl (url) {
    return new Http(url, this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds HTTP method information to request model
   * @param {string} method - HTTP method
   * @returns {Object} Http object
   */
  @deprecate
  withMethod (method) {
    return new Http(this.url(), method,
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds header to request model
   * @param {String} header - valid header key
   * @param {String} value - valid header value
   * @returns {Object} Http object
   */
  @deprecate
  withHeader (header, value) {
    const headers = new Map(this.headers()).set(header, value)
    return new Http(this.url(), this.method(),
      headers, this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds body to request model
   * @param {Object} body - request payload
   * @returns {Object} Http object
   */
  @deprecate
  withBody (body) {
    return new Http(this.url(), this.method(),
      this.headers(), body, this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
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
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), responseType, this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds dynamic segment value
   * @param {String} segment - segment key
   * @param {String} value - segment value
   * @returns {Object} Http object
   */
  @deprecate
  withDynamicSegment (segment, value) {
    const dynamicSegments = new Map(this.dynamicSegments()).set(segment, value)
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), dynamicSegments,
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds query string param
   * @param {String} name - param key
   * @param {String} value - param value
   * @returns {Object} Http object
   */
  @deprecate
  withParam (name, value) {
    const queryParams = new Map(this.queryParams()).set(name, value)
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      queryParams, this.bodyProcessor())
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   * @param {func} bodyProcessor - f(x) => valid_http_body
   * @returns {Object} Http object
   */
  @deprecate
  withBodyProccessor (bodyProcessor) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), bodyProcessor)
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
    validate(this)
    return exec(this)
  }
}
