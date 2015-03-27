/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

import Promise from 'promise';

class Http {
  constructor(url = null, method = null,
    headers = new Map(), body = null,
    responseType = null, dynamicSegments = new Map(),
    queryParams = new Map(),
    bodyProcessor = b => {return b;}){

    const _url = url;

    this.url = () => {
      return _url;
    };

    const _method = method;

    this.method = () => {
      return _method;
    };

    const _headers = headers;

    this.headers = () => {
      return _headers;
    };

    const _body = body;

    this.body = () => {
      return _body;
    };

    const _responseType = responseType;

    this.responseType = () => {
      return _responseType;
    };

    const _dynamicSegments = dynamicSegments;

    this.dynamicSegments = () => {
      return _dynamicSegments;
    };

    const _queryParams = queryParams;

    this.queryParams = () => {
      return _queryParams;
    };

    const _bodyProcessor = bodyProcessor;

   this.bodyProcessor = () => {
     return _bodyProcessor;
   };

    return this;
  }

  /**
   * Adds URL information to HTTP request model
   * Returns new request model
   */
  withUrl(url) {
    return new Http(url, this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Adds HTTP method information to request model
   * Returns new request model
   */
  withMethod(method) {
    return new Http(this.url(), method,
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Adds header to request model
   * Returns new request model
   */
  withHeader(header, value) {
    var headers = new Map(this.headers()).set(header, value);
    return new Http(this.url(), this.method(),
      headers, this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Adds body to request model
   * Returns new request model
   */
  withBody(body) {
    return new Http(this.url(), this.method(),
      this.headers(), body, this.responseType(), this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   */
  withResponseType(responseType) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), responseType, this.dynamicSegments(),
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Adds dynamic segment value
   */
  withDynamicSegment(segment, value) {
    var dynamicSegments = new Map(this.dynamicSegments()).set(segment, value);
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), dynamicSegments,
      this.queryParams(), this.bodyProcessor());
  }

  /**
   * Adds query string param
   */
  withParam(name, value) {
    var queryParams = new Map(this.queryParams()).set(name,value);
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      queryParams, this.bodyProcessor());
  }

  /**
   * Sets the function which gets the body object as a parameter
   * which result would be used as a request body
   */
  withBodyProccessor(bodyProcessor) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments(),
      this.queryParams(), bodyProcessor);
  }

  /**
   * Sets response type to 'json'
   */
  withJsonResponse() {
    return this.withResponseType('json');
  }

  /**
   * Predifine body sringification and Content-Type attribute.
   */
  withJsonBody() {
    return this.withHeader('Content-Type', 'application/json')
    .withBodyProccessor(JSON.stringify);
  }

  /**
   * Executes HTTP request
   */
  exec() {
    validate(this);
    return exec(this);
  }
}

/**
 * Validate HTTP request model
 */
var validate = http => {
  validateUrl(http.url());
  validateMethod(http.method());
  validateHeaders(http.headers());
  validateResponseType(http.responseType());
};

/**
 * Basicly validate url
 */
var validateUrl = url => {
  if (!url) {
    throw `Url is not specified`;
  }
  if (typeof(url) != 'string') {
    throw `Url should be type of string`;
  }
};

/**
 * Validate HTTP method
 */
var validateMethod = method => {
  if (!method) {
    throw `HTTP method is not specified`;
  }
  if (typeof(method) !== 'string') {
    throw `HTTP method should be type of string`;
  }
  var supported = false;
  switch (method) {
    case 'GET':
    case 'POST':
    case 'PUT':
    case 'DELETE':
      supported = true;
  }
  if (supported == false) {
    throw `Http method  ${method} is not supported`;
  }
};

/**
 * Validate headers
 */
var validateHeaders = headers => {
  for(let [key, value] of headers.entries()){
    if(typeof(key) != 'string'){
      throw `Header key should be string`;
    }
    if(typeof(value) != 'string'){
      throw `Header ${key} value should be string`;
    }
  }
};

var validateResponseType = type => {
  //if(!type) return; //support for not defined response content type.
  switch (type) {
    case null:
    case '':
    case 'arraybuffer':
    case 'blob':
    case 'document':
    case 'text':
    case 'json':
      return;
  }
  throw `Response content type ${type} is not currently supported`;
};

/**
 * Executes validated http request
 */
var exec = (http) => {
  switch (http.method()) {
    case 'GET':
      return get(http);

    case 'POST':
      return post(http);

    case 'PUT':
      return put(http);

    case 'DELETE':
      return del(http);

    default:
      throw `Method ${http.method} is not supported`;
  }
};

/**
 * Executes GET request
 */
var get = http => {
  return new Promise((fulfill, reject) => {
    var xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    );

    let url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments());
    url = addQueryParams(url, http.queryParams());

    xmlhttp.open('GET', url, true);
    addHeaders(xmlhttp, http.headers());
    setResponseType(xmlhttp, http.responseType());

    xmlhttp.send(null);
  });
};

/**
 * Executes POST request
 */
var post = http => {
  return submit(http);
};

/**
 * Executes PUT request
 */
var put = http => {
  return submit(http);
};

/**
 * Executes DELETE request
 */
var del = http => {
  return submit(http);
};

/**
 * Executes any submit type request
 */
var submit = http => {
  return new Promise((fulfill, reject) => {
    var xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    );

    let url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments());
    url = addQueryParams(url, http.queryParams());

    xmlhttp.open(http.method(), url, true);
    addHeaders(xmlhttp, http.headers());
    setResponseType(xmlhttp, http.responseType());
    var body = http.bodyProcessor()(http.body());
    xmlhttp.send(body);
  });
};

/**
 * Mixins dynamic segments replacing the `:segment_name` parts with provide values
 */
var mixinDynamicSegmentsValues = (url, dynamicSegments) => {
  for(let [key,value] of dynamicSegments.entries()){
    url = url.replace(`:${key}`, value);
  }
  return url;
};

/**
 * Adds query params string to url
 */
var addQueryParams = (url, queryParams) => {
  if(queryParams.size == 0)
    return url;
  var chanks = [queryParams.lenght];
  for(let [key,value] of queryParams.entries()){
    chanks.push(`${key}=${value}`);
  }
  return url + '?' + chanks.join('&');
};

/**
 * Adds headers to xmlhttp object
 */
var addHeaders = (xmlhttp, headers) => {
  for(let [key,value] of headers.entries()){
      xmlhttp.setRequestHeader(key, value);
  }
  return xmlhttp;
};

var setResponseType = (xmlhttp, responseType) => {
  if(!responseType) return;
  xmlhttp.responseType = responseType;
  return xmlhttp;
};

/**
 * Executes if xmlhttp request succeed
 */
var onSucceed = (fulfill, http, xmlhttp) => {
  fulfill({
    status: xmlhttp.status,
    response: http.responseType()? xmlhttp.response: xmlhttp.responseText,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Executes if xmlhttp request failed
 */
var onFailed = (reject, http, xmlhttp) => {
  reject({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Cunstructs XmlHttpRequest object
 */
var getXmlHttp = (fulfill, reject) => {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState != 4)
      return;
    if (isStatusOkLike(xmlhttp.status)) {
      fulfill(xmlhttp);
    } else {
      reject(xmlhttp);
    }
  };
  return xmlhttp;
};

/**
 * Checks if status code is in range 200…299 to enshure response is in Ok state
 */
var isStatusOkLike = statusCode => {
  var delta = statusCode - 200;
  var isOk = delta >= 0;
  return isOk && delta < 100;
};

export default Http;
