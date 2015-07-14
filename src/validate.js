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

export default validate
