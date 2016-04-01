/**
 * @ignore
 * Mixins dynamic segments replacing the `:segment_name` parts with provide
 * values
 * @param {String} url – URL
 * @param {Object} dynamicSegments – dynamic segments
 * @returns {String} – URL
 */
export function mixinDynamicSegmentsValues (url, dynamicSegments) {
  return dynamicSegments.reduce((aggr, [key, value]) =>
    aggr.replace(`:${key}`, value), url)
}

/**
 * @ignore
 * Adds query params string to url
 * @param {string} url – URL
 * @param {Array} queryParams – query params
 * @returns {String} – URL
 */
export function addQueryParams (url, queryParams) {
  const chanks = queryParams.map(([key, value]) => `${key}=${value}`)
  return url + (chanks.length !== 0 ? '?' + chanks.join('&') : '')
}
