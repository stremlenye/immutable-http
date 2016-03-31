const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE']
const validTypes = [null, '', 'arraybuffer', 'blob', 'document', 'text', 'json']

/**
 * Validate HTTP method
 * @param {String} method – HTTP method
 * @return {String} error
 */
function validateMethod (method) {
  if (!method) {
    return `HTTP method is not specified`
  }
  if (typeof method !== 'string') {
    return `HTTP method should be type of string`
  }
  if (supportedMethods.indexOf(method.toUpperCase()) < 0) {
    return `Http method ${method} is not supported`
  }
}

/**
 * Basicly validate url
 * @param {String} url – URL
 * @return {String} error
 */
function validateUrl (url) {
  if (!url) {
    return `Url is not specified`
  }
  if (typeof url !== 'string') {
    return `Url should be type of string`
  }
}

/**
 * Validate header to all parts be strings
 * @param {String} key – Header key
 * @param {String} value – Header value
 * @return {String} error
 */
function validateHeader (key, value) {
  if (typeof key !== 'string' || typeof value !== 'string')
    return `Parts of header ${key}:${value} must be strings`
}

/**
 * Validate headers
 * @param {Object} headers – headers
 * @return {Array} error
 */
function validateHeaders (headers) {
  const aggr = []
  for (let [key, value] of headers)
    aggr.push(validateHeader(key, value))
  return aggr
}

/**
 * Validates response type
 * @param {string} type - response type
 * @return {String} error
 */
function validateResponseType (type) {
  if (validTypes.indexOf(type) < 0)
    return `Response content type ${type} is not supported`
}

/**
 * @ignore
 * Validate HTTP request model
 * @param {String} url – url
 * @param {String} method – HTTP method
 * @param {Map} headers – HTTP headers
 * @param {String} responseType – response type
 * @return {Array} array of errors
 */
function validate (url, method, headers, responseType) {
  return [validateUrl(url),
    validateMethod(method),
    validateResponseType(responseType)]
    .concat(validateHeaders(headers)).filter(_ => !!_)
}

export default validate
