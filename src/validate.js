import option from 'option'

const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE']
const validTypes = [null, '', 'arraybuffer', 'blob', 'document', 'text', 'json']

/**
 * Validate HTTP method
 * @param {String} method – HTTP method
 * @return {String} error
 */
function validateMethod (method) {
  if (!method) {
    return option.some('HTTP method is not specified')
  }
  if (typeof method !== 'string') {
    return option.some('HTTP method should be type of string')
  }
  if (supportedMethods.indexOf(method.toUpperCase()) < 0) {
    return option.some(`Http method ${method} is not supported`)
  }
  return option.none
}

/**
 * Basicly validate url
 * @param {String} url – URL
 * @return {String} error
 */
function validateUrl (url) {
  if (!url) {
    return option.some('Url is not specified')
  }
  if (typeof url !== 'string') {
    return option.some('Url should be type of string')
  }
  return option.none
}

/**
 * Validate header to all parts be strings
 * @param {String} key – Header key
 * @param {String} value – Header value
 * @return {String} error
 */
function validateHeader (key, value) {
  if (typeof key !== 'string' || typeof value !== 'string')
    return option.some(`Parts of header ${key}:${value} must be strings`)
  return option.none
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
    return option.some(`Response content type ${type} is not supported`)
  return option.none
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
    .concat(validateHeaders(headers)).filter(_ => _.isSome()).map(_ => _.value())
}

export default validate
