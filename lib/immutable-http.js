"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

var Http = (function () {
  function Http(httpRequest) {
    _classCallCheck(this, Http);

    this.url = null;
    this.method = null;
    this.headers = null;
    this.body = null;
    this.responseType = null;

    if (httpRequest) {
      return clone(httpRequest, new Http());
    }
    return this;
  }

  _prototypeProperties(Http, null, {
    getUrl: {
      value: function getUrl() {
        return this.url;
      },
      writable: true,
      configurable: true
    },
    getMethod: {
      value: function getMethod() {
        return method;
      },
      writable: true,
      configurable: true
    },
    getHeaders: {
      value: function getHeaders() {
        return headers;
      },
      writable: true,
      configurable: true
    },
    getBody: {
      value: function getBody() {
        return body;
      },
      writable: true,
      configurable: true
    },
    getResponseType: {
      value: function getResponseType() {
        return responseType;
      },
      writable: true,
      configurable: true
    },
    withUrl: {

      /**
       * Adds URL information to HTTP request model
       * Returns new request model
       */

      value: function withUrl(url) {
        var request = new Http(this);
        request.url = url;
        return request;
      },
      writable: true,
      configurable: true
    },
    withMethod: {

      /**
       * Adds HTTP method information to request model
       * Returns new request model
       */

      value: function withMethod(method) {
        var request = new Http(this);
        request.method = method;
        return request;
      },
      writable: true,
      configurable: true
    },
    withHeader: {

      /**
       * Adds header to request model
       * Returns new request model
       */

      value: function withHeader(header, value) {
        var request = new Http(this);
        var tuple = {};
        tuple[header] = value;
        request.headers = request.headers ? request.headers : [];
        request.headers.push(tuple);
        return request;
      },
      writable: true,
      configurable: true
    },
    withBody: {

      /**
       * Adds body to request model
       * Returns new request model
       */

      value: function withBody(body) {
        var request = new Http(this);
        request.body = body;
        return request;
      },
      writable: true,
      configurable: true
    },
    withResponseType: {

      /**
       * Sets response content type
       * Proper values could be obtained form XmlHttpRequest specification
       * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
       */

      value: function withResponseType(type) {
        var request = new Http(this);
        request.responseType = type;
        return request;
      },
      writable: true,
      configurable: true
    },
    exec: {

      /**
       * Executes HTTP request
       */

      value: (function (_exec) {
        var _execWrapper = function exec() {
          return _exec.apply(this, arguments);
        };

        _execWrapper.toString = function () {
          return _exec.toString();
        };

        return _execWrapper;
      })(function () {
        validate(this);
        return exec(this);
      }),
      writable: true,
      configurable: true
    }
  });

  return Http;
})();

/**
 * Validate HTTP request model
 */
var validate = function (http) {
  validateUrl(http.url);
  validateMethod(http.method);
  validateHeaders(http.headers);
  validateResponseType(http.responseType);
};

/**
 * Basicly validate url
 */
var validateUrl = function (url) {
  if (!url) {
    throw "Url is not specified";
  }
  if (typeof url != "string") {
    throw "Url should be type of string";
  }
};

/**
 * Validate HTTP method
 */
var validateMethod = function (method) {
  if (!method) {
    throw "HTTP method is not specified";
  }
  if (typeof method !== "string") {
    throw "HTTP method should be type of string";
  }
  var supported = false;
  switch (method) {
    case "GET":
    case "POST":
    case "PUT":
    case "DELETE":
      supported = true;
  }
  if (supported == false) {
    throw "Http method  " + method + " is not supported";
  }
};

/**
 * Validate headers
 */
var validateHeaders = function (headers) {
  if (!headers) {
    return;
  }
  if (Array.isArray(headers) == false) {
    throw "Accidentally headers array was damaged";
  }
  headers.forEach(validateHeader);
};

/**
 * Validate header
 */
var validateHeader = function (header) {
  for (var key in header) {
    if (typeof header[key] != "string") {
      throw "Header " + key + " value should be string";
    }
  }
};

var validateResponseType = function (type) {
  switch (type) {
    case "":
    case "arraybuffer":
    case "blob":
    case "document":
    case "text":
    case "json":
      return;
  }
  throw "Response content type " + type + " is not currently supported";
};

/**
 * Executes validated http request
 */
var exec = function (http) {
  switch (http.method) {
    case "GET":
      return get(http);

    case "POST":
      return post(http);

    case "PUT":
      return put(http);

    case "DELETE":
      return del(http);

    default:
      throw "Method " + http.method + " is not supported";
  }
};

/**
 * Executes GET request
 */
var get = function (http) {
  return new Promise(function (fulfill, reject) {
    var xmlhttp = getXmlHttp(onSucceed.bind(undefined, fulfill, http), onFailed.bind(undefined, reject, http));

    xmlhttp.open("GET", http.url, true);
    addHeaders(xmlhttp, http.headers);
    setResponseType(xmlhttp, http.responseType);

    xmlhttp.send(null);
  });
};

/**
 * Executes POST request
 */
var post = function (http) {
  return submit(http);
};

/**
 * Executes PUT request
 */
var put = function (http) {
  return submit(http);
};

/**
 * Executes DELETE request
 */
var del = function (http) {
  return submit(http);
};

/**
 * Executes any submit type request
 */
var submit = function (http) {
  return new Promise(function (fulfill, reject) {
    var xmlhttp = getXmlHttp(onSucceed.bind(undefined, fulfill, http), onFailed.bind(undefined, reject, http));

    xmlhttp.open(http.method, http.url, true);
    addHeaders(xmlhttp, http.headers);
    setResponseType(xmlhttp, http.responseType);

    xmlhttp.send(http.body);
  });
};

/**
 * Adds headers to xmlhttp object
 */
var addHeaders = function (xmlhttp, headers) {
  if (!headers) return;
  headers.forEach(function (header) {
    for (var key in header) {
      xmlhttp.setRequestHeader(key, header[key]);
    }
  });
  return xmlhttp;
};

var setResponseType = function (xmlhttp, responseType) {
  if (!responseType) return;
  xmlhttp.responseType = responseType;
  return xmlhttp;
};

/**
 * Executes if xmlhttp request succeed
 */
var onSucceed = function (fulfill, http, xmlhttp) {
  fulfill({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Executes if xmlhttp request failed
 */
var onFailed = function (reject, http, xmlhttp) {
  reject({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Cunstructs XmlHttpRequest object
 */
var getXmlHttp = function (fulfill, reject) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState != 4) return;
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
var isStatusOkLike = function (statusCode) {
  var delta = statusCode - 200;
  var isOk = delta >= 0;
  return isOk && delta < 100;
};

/**
 * Clones object
 */
var clone = function (obj, target) {
  var copy;

  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    if (!target) copy = {};else copy = target;
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
};

module.exports = Http;
