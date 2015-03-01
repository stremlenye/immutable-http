"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

var Http = (function () {
  function Http() {
    var url = arguments[0] === undefined ? null : arguments[0];
    var method = arguments[1] === undefined ? null : arguments[1];
    var headers = arguments[2] === undefined ? null : arguments[2];
    var body = arguments[3] === undefined ? null : arguments[3];
    var responseType = arguments[4] === undefined ? null : arguments[4];

    _classCallCheck(this, Http);

    var _url = url;

    this.url = function () {
      return _url;
    };

    var _method = method;

    this.method = function () {
      return _method;
    };

    var _headers = headers;

    this.headers = function () {
      return _headers;
    };

    var _body = body;

    this.body = function () {
      return _body;
    };

    var _responseType = responseType;

    this.responseType = function () {
      return _responseType;
    };

    return this;
  }

  _prototypeProperties(Http, null, {
    withUrl: {

      /**
       * Adds URL information to HTTP request model
       * Returns new request model
       */

      value: function withUrl(url) {
        return new Http(url, this.method(), this.headers(), this.body(), this.responseType());
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
        return new Http(this.url(), method, this.headers(), this.body(), this.responseType());
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
        var tuple = {};
        tuple[header] = value;
        var headers = this.headers() ? this.headers() : [];
        headers.push(tuple);
        return new Http(this.url(), this.method(), headers, this.body(), this.responseType());
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
        return new Http(this.url(), this.method(), this.headers(), body, this.responseType());
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

      value: function withResponseType(responseType) {
        return new Http(this.url(), this.method(), this.headers(), this.body(), responseType);
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
  validateUrl(http.url());
  validateMethod(http.method());
  validateHeaders(http.headers());
  validateResponseType(http.responseType());
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
  switch (http.method()) {
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

    xmlhttp.open("GET", http.url(), true);
    addHeaders(xmlhttp, http.headers());
    setResponseType(xmlhttp, http.responseType());

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

    xmlhttp.open(http.method, http.url(), true);
    addHeaders(xmlhttp, http.headers());
    setResponseType(xmlhttp, http.responseType());

    xmlhttp.send(http.body());
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

module.exports = Http;
