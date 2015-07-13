/**
 * Immutable HTTP client object
 */

import Promise from 'promise'

/**
 * Basicly validate url
 * @param {String} url – URL
 */
function validateUrl (url) {
  if (!url) {
    throw `Url is not specified`
  }
  if (typeof (url) !== 'string') {
    throw `Url should be type of string`
  }
}

/**
 * Validate HTTP method
 * @param {String} method – HTTP method
 */
function validateMethod (method) {
  if (!method) {
    throw `HTTP method is not specified`
  }
  if (typeof (method) !== 'string') {
    throw `HTTP method should be type of string`
  }
  let supported = false
  switch (method) {
    case 'GET':
    case 'POST':
    case 'PUT':
    case 'DELETE':
      supported = true
      break
    default:
      supported = false
  }
  if (supported === false) {
    throw `Http method  ${method} is not supported`
  }
}

/**
 * Validate headers
 * @param {Object} headers – headers
 */
function validateHeaders (headers) {
  for (let [key, value] of headers.entries()) {
    if (typeof (key) !== 'string') {
      throw `Header key should be string`
    }
    if (typeof (value) !== 'string') {
      throw `Header ${key} value should be string`
    }
  }
}

/**
 * Validates response type
 * @param {string} type - response type
 */
function validateResponseType (type) {
  switch (type) {
    case null:
    case '':
    case 'arraybuffer':
    case 'blob':
    case 'document':
    case 'text':
    case 'json':
      return
    default:
      throw `Response content type ${type} is not currently supported`
  }
}

/**
 * Validate HTTP request model
 * @param {Object} http – Http object
 */
function validate (http) {
  validateUrl(http.url())
  validateMethod(http.method())
  validateHeaders(http.headers())
  validateResponseType(http.responseType())
}

/**
 * Mixins dynamic segments replacing the `:segment_name` parts with provide
 * values
 * @param {String} url – URL
 * @param {Object} dynamicSegments – dynamic segments
 * @returns {String} – URL
 */
function mixinDynamicSegmentsValues (url, dynamicSegments) {
  let aggregator = url
  for (let [key, value] of dynamicSegments.entries()) {
    aggregator = aggregator.replace(`:${key}`, value)
  }
  return url
}

/**
 * Adds query params string to url
 * @param {string} url – URL
 * @param {Array} queryParams – query params
 * @returns {String} – URL
 */
function addQueryParams (url, queryParams) {
  if (queryParams.size === 0)
    return url
  const chanks = [queryParams.lenght]
  for (let [key, value] of queryParams.entries()) {
    chanks.push(`${key}=${value}`)
  }
  return url + '?' + chanks.join('&')
}

/**
 * Adds headers to xmlhttp object
 * @param {Object} xmlhttp – XMLHttpRequest
 * @param {Object} headers – HTTP headers key-value collection
 * @returns {Object} – XMLHttpRequest
 */
function addHeaders (xmlhttp, headers) {
  for (let [key, value] of headers.entries()) {
    xmlhttp.setRequestHeader(key, value)
  }
  return xmlhttp
}

/**
 * Sets XMLHttpRequest response type
 * @param {Object} xmlhttp – XMLHttpRequest
 * @param {String} responseType – response type
 * @returns {Object} – XMLHttpRequest
 */
function setResponseType (xmlhttp, responseType) {
  if (!responseType) return xmlhttp
  xmlhttp.responseType = responseType
  return xmlhttp
}

/**
 * Executes if xmlhttp request succeed
 * @param {fulfillCallback} fulfill – fulfill callback
 * @param {Object} http – HTTP object
 * @param {Object} xmlhttp – XMLHttpRequest
 */
function onSucceed (fulfill, http, xmlhttp) {
  fulfill({
    status: xmlhttp.status,
    response: http.responseType() ? xmlhttp.response : xmlhttp.responseText,
    headers: xmlhttp.getAllResponseHeaders()
  })
}

/**
 * Executes if xmlhttp request failed
 * @param {rejectCallback} reject - reject
 * @param {Object} http – HTTP object
 * @param {Object} xmlhttp – XMLHttpRequest
 */
function onFailed (reject, http, xmlhttp) {
  reject({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  })
}

/**
 * Checks if status code is in range 200…299 to enshure response is in Ok state
 * @param {Number} statusCode - HTTP status code
 * @return {Boolean} true id status OK-like
 */
function isStatusOkLike (statusCode) {
  const delta = statusCode - 200
  const isOk = delta >= 0
  return isOk && delta < 100
}

/**
 * Cunstructs XmlHttpRequest object
 * @param {fulfillCallback} fulfill – fulfill callback
 * @param {rejectCallback} reject – reject callback
 * @returns {Object} XMLHttpRequest – XMLHttpRequest
 */
function getXmlHttp (fulfill, reject) {
  const xmlhttp = new XMLHttpRequest()
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState !== 4)
      return
    if (isStatusOkLike(xmlhttp.status)) {
      fulfill(xmlhttp)
    } else {
      reject(xmlhttp)
    }
  }
  return xmlhttp
}

/**
 * Executes validated http request
 * @param {Object} http – HTTP object
 * @returns {Object} – Promise
 */
function exec (http) {
  switch (http.method()) {
    case 'GET':
      return get(http)
    case 'POST':
      return post(http)
    case 'PUT':
      return put(http)
    case 'DELETE':
      return del(http)
    default:
      throw `Method ${http.method} is not supported`
  }
}

/**
 * Executes any submit type request
 * @param {Object} http – HTTP object
 * @returns {Object} - Promise
 */
function submit (http) {
  return new Promise((fulfill, reject) => {
    const xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    )

    let url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments())
    url = addQueryParams(url, http.queryParams())

    xmlhttp.open(http.method(), url, true)
    addHeaders(xmlhttp, http.headers())
    setResponseType(xmlhttp, http.responseType())
    const body = http.bodyProcessor()(http.body())
    xmlhttp.send(body)
  })
}

/**
 * Executes GET request
 * @param {Object} http – HTTP object
 * @returns {Object} - Promise
 */
function get (http) {
  return new Promise((fulfill, reject) => {
    const xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    )

    let url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments())
    url = addQueryParams(url, http.queryParams())

    xmlhttp.open('GET', url, true)
    addHeaders(xmlhttp, http.headers())
    setResponseType(xmlhttp, http.responseType())

    xmlhttp.send(null)
  })
}

/**
 * Executes POST request
 * @param {Object} http – HTTP object
 * @returns {Object} - Promise
 */
function post (http) {
  return submit(http)
}

/**
 * Executes PUT request
 * @param {Object} http – HTTP object
 * @returns {Object} - Promise
 */
function put (http) {
  return submit(http)
}

/**
 * Executes DELETE request
 * @param {Object} http – HTTP object
 * @returns {Object} - Promise
 */
function del (http) {
  return submit(http)
}

const defaultBodyProcessor = b => b

class Http {
  constructor (url = null,
      method = null, headers = new Map(), body = null, responseType = null,
      dynamicSegments = new Map(), queryParams = new Map(),
      bodyProcessor = defaultBodyProcessor) {
    this.url = () => {
      return url
    }

    this.method = () => {
      return method
    }

    this.headers = () => {
      return headers
    }

    this.body = () => {
      return body
    }

    this.responseType = () => {
      return responseType
    }

    this.dynamicSegments = () => {
      return dynamicSegments
    }

    this.queryParams = () => {
      return queryParams
    }

    this.bodyProcessor = () => {
      return bodyProcessor
    }

    return this
  }

  /**
   * Adds URL information to HTTP request model
   * @param {string} url – URL
   * @returns {Object} Http object
   */
  withUrl (url) {
    return new Http(url, this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds HTTP method information to request model
   * @param {string} method – HTTP method
   * @returns {Object} Http object
   */
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
  withHeader (header, value) {
    const headers = new Map(this.headers()).set(header, value)
    return new Http(this.url(), this.method(),
      headers, this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds body to request model
   * @param {Object} body – request payload
   * @returns {Object} Http object
   */
  withBody (body) {
    return new Http(this.url(), this.method(),
      this.headers(), body, this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @param {String} responseType – Proper values could be obtained form
   * XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   * @returns {Object} Http object
   */
  withResponseType (responseType) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), responseType, this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds dynamic segment value
   * @param {String} segment – segment key
   * @param {String} value – segment value
   * @returns {Object} Http object
   */
  withDynamicSegment (segment, value) {
    const dynamicSegments = new Map(this.dynamicSegments()).set(segment, value)
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), dynamicSegments,
      this.queryParams(), this.bodyProcessor())
  }

  /**
   * Adds query string param
   * @param {String} name – param key
   * @param {String} value – param value
   * @returns {Object} Http object
   */
  withParam (name, value) {
    const queryParams = new Map(this.queryParams()).set(name, value)
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      queryParams, this.bodyProcessor())
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   * @param {func} bodyProcessor – f(x) => valid_http_body
   * @returns {Object} Http object
   */
  withBodyProccessor (bodyProcessor) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), bodyProcessor)
  }

  /**
   * Sets response type to 'json'
   * @returns {Object} Http object
   */
  withJsonResponse () {
    return this.withResponseType('json')
  }

  /**
   * Predifine body sringification and Content-Type attribute.
   * @returns {Object} Http object
   */
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

export default Http
