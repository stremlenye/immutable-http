const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE']

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
  if (supportedMethods.indexOf(method) < 0) {
    throw `Http method  ${method} is not supported`
  }
}

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
 * Validate header to all parts be strings
 * @param {Object} headers – headers
 */
function validateHeader ({ key, value }) {
  console.log(kye);
  console.log(value);
  if (typeof (key) !== 'string' || typeof (value) !== 'string')
    throw new Error('Headers must be strings')
}

/**
 * Validate headers
 * @param {Object} headers – headers
 */
function validateHeaders (headers) {
  for (let header of headers.entries()) {
    console.log(header);
    validateHeader(header)
  }
}

const validTypes = ['', 'arraybuffer', 'blob', 'document', 'text', 'json']

/**
 * Validates response type
 * @param {string} type - response type
 */
function validateResponseType (type) {
  if (type === null || validTypes.indexOf(type) >= 0)
    return
  throw `Response content type ${type} is not currently supported`
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
