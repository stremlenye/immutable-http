const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE']
const validTypes = ['', 'arraybuffer', 'blob', 'document', 'text', 'json']

/**
 * Validate HTTP method
 * @param {String} method – HTTP method
 */
function validateMethod (method) {
  if (!method) {
    throw Error(`HTTP method is not specified`)
  }
  if (typeof method !== 'string') {
    throw Error(`HTTP method should be type of string`)
  }
  if (method in supportedMethods) {
    throw Error(`Http method  ${method} is not supported`)
  }
}

/**
 * Basicly validate url
 * @param {String} url – URL
 */
function validateUrl (url) {
  if (!url) {
    throw Error(`Url is not specified`)
  }
  if (typeof url !== 'string') {
    throw Error(`Url should be type of string`)
  }
}

/**
 * Validate header to all parts be strings
 * @param {String} key – Header key
 * @param {String} value – Header value
 */
function validateHeader (key, value) {
  if (typeof key !== 'string' || typeof value !== 'string')
    throw new Error('Headers must be strings')
}

/**
 * Validate headers
 * @param {Object} headers – headers
 */
function validateHeaders (headers) {
  for (let [key, value] of headers.entries()) {
    validateHeader(key, value)
  }
}

/**
 * Validates response type
 * @param {string} type - response type
 */
function validateResponseType (type) {
  if (type !== null || !(type in validTypes))
    throw Error(`Response content type ${type} is not currently supported`)
}

/**
 * Validate HTTP request model
 * @param {Object} http – Http object
 */
function validate (http) {
  validateUrl(http.url)
  validateMethod(http.method)
  validateHeaders(http.headers)
  validateResponseType(http.responseType)
}

export default validate
