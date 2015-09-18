/**
 * Adds headers to xmlhttp object
 * @param {Object} xmlhttp – XMLHttpRequest
 * @param {Object} headers – HTTP headers key-value collection
 * @returns {Object} – XMLHttpRequest
 */
function addHeaders (xmlhttp, headers) {
  for (let [key, value] of headers) {
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
 * Process response
 * @param {callback} callback - callback
 * @param {String} responseType – XMLHttpRequest
 * @returns {function} f(xmlhttp)
 */
function onResponse (callback, responseType) {
  return xmlhttp => callback({
    status: xmlhttp.status,
    response: responseType ? xmlhttp.response : xmlhttp.responseText,
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
 * Executes any submit type request
 * @param {String} url – URL
 * @param {String} method – HTTP method
 * @param {Array} headers – Array of tuples of headers
 * @param {String} responseType – response content type
 * @param {String} body – stringified request body
 * @returns {Object} - Promise
 */
function submit (url, method, headers, responseType, body) {
  return new Promise((fulfill, reject) => {
    const xmlhttp = getXmlHttp(
      onResponse(fulfill, responseType),
      onResponse(reject, responseType)
    )

    xmlhttp.open(method, url, true)
    setResponseType(xmlhttp, responseType)
    addHeaders(xmlhttp, headers)
    xmlhttp.send(body)
  })
}

/**
 * Executes GET request
 * @param {String} url – URL
 * @param {String} method – HTTP method
 * @param {Array} headers – Array of tuples of headers
 * @param {String} responseType – response content type
 * @param {String} body – stringified request body
 * @returns {Object} - Promise
 */
function get (url, method, headers, responseType) {
  return new Promise((fulfill, reject) => {
    const xmlhttp = getXmlHttp(
      onResponse(fulfill, responseType),
      onResponse(reject, responseType)
    )

    xmlhttp.open('GET', url, true)
    addHeaders(xmlhttp, headers)
    setResponseType(xmlhttp, responseType)

    xmlhttp.send(null)
  })
}

const methodsHandlerMap = {
  GET: get,
  POST: submit,
  PUT: submit,
  DELETE: submit
}

/**
 * Executes validated http request
 * @param {String} url – URL
 * @param {String} method – HTTP method
 * @param {Array} headers – Array of tuples of headers
 * @param {String} responseType – response content type
 * @param {String} body – stringified request body
 * @returns {Object} – Promise
 */
function exec (url, method, headers, responseType, body) {
  const handler = methodsHandlerMap[method]
  if (!handler)
    throw Error(`Method ${method} is not supported`)
  return handler(url, method, headers, responseType, body)
}

export default exec
