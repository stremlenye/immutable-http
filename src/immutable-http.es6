/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

var Promise = require('promise');

class Http {
  constructor(url = null, method = null,
    headers = [], body = null,
    responseType = null, dynamicSegments = []){

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

    return this;
  }

  /**
   * Adds URL information to HTTP request model
   * Returns new request model
   */
  withUrl(url) {
    return new Http(url, this.method(),
      this.headers(), this.body(), this.responseType(), this.dynamicSegments());
  }

  /**
   * Adds HTTP method information to request model
   * Returns new request model
   */
  withMethod(method) {
    return new Http(this.url(), method,
      this.headers(), this.body(), this.responseType(), this.dynamicSegments());
  }

  /**
   * Adds header to request model
   * Returns new request model
   */
  withHeader(header, value) {
    var tuple = {};
    tuple[header] = value;
    var headers = this.headers().concat([tuple]);
    return new Http(this.url(), this.method(),
      headers, this.body(), this.responseType(), this.dynamicSegments());
  }

  /**
   * Adds body to request model
   * Returns new request model
   */
  withBody(body) {
    return new Http(this.url(), this.method(),
      this.headers(), body, this.responseType(), this.dynamicSegments());
  }

  /**
   * Sets response content type
   * Proper values could be obtained form XmlHttpRequest specification
   * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
   */
  withResponseType(responseType) {
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), responseType, this.dynamicSegments());
  }

  withDynamicSegment(segment, value) {
    var tuple = {};
    tuple[segment] = value;
    var dynamicSegments = this.dynamicSegments().concat([tuple]);
    return new Http(this.url(), this.method(),
      this.headers(), this.body(), this.responseType(), dynamicSegments);
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
  if (!headers) {
    return;
  }
  if (Array.isArray(headers) == false) {
    throw `Accidentally headers array was damaged`;
  }
  headers.forEach(validateHeader);
};

/**
 * Validate header
 */
var validateHeader = header => {
  for (var key in header) {
    if (typeof(header[key]) != 'string') {
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

    xmlhttp.open(http.method(), http.url(), true);
    addHeaders(xmlhttp, http.headers());
    setResponseType(xmlhttp, http.responseType());

    xmlhttp.send(http.body());
  });
};

/**
 * Mixins dynamic segments replacing the `:segment_name` parts with provide values
 */
var mixinDynamicSegmentsValues = (url, dynamicSegments) =>{
  dynamicSegments.forEach(segment => {
    for (var key in segment) {
      url = url.replace(`:${key}`, segment[key]);
    }
  });
  return url;
};

/**
 * Adds headers to xmlhttp object
 */
var addHeaders = (xmlhttp, headers) => {
  if (!headers) return;
  headers.forEach(header => {
    for (var key in header) {
      xmlhttp.setRequestHeader(key, header[key]);
    }
  });
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
    text: xmlhttp.responseText,
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

module.exports = Http;
