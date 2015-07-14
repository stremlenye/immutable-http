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
  return aggregator
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

export default exec
