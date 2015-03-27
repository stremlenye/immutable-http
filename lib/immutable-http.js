"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

var Promise = _interopRequire(require("promise"));

var Http = (function () {
  function Http() {
    var url = arguments[0] === undefined ? null : arguments[0];
    var method = arguments[1] === undefined ? null : arguments[1];
    var headers = arguments[2] === undefined ? new Map() : arguments[2];
    var body = arguments[3] === undefined ? null : arguments[3];
    var responseType = arguments[4] === undefined ? null : arguments[4];
    var dynamicSegments = arguments[5] === undefined ? new Map() : arguments[5];
    var queryParams = arguments[6] === undefined ? new Map() : arguments[6];
    var bodyProcessor = arguments[7] === undefined ? function (b) {
      return b;
    } : arguments[7];

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

    var _dynamicSegments = dynamicSegments;

    this.dynamicSegments = function () {
      return _dynamicSegments;
    };

    var _queryParams = queryParams;

    this.queryParams = function () {
      return _queryParams;
    };

    var _bodyProcessor = bodyProcessor;

    this.bodyProcessor = function () {
      return _bodyProcessor;
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
        return new Http(url, this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
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
        return new Http(this.url(), method, this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
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
        var headers = new Map(this.headers()).set(header, value);
        return new Http(this.url(), this.method(), headers, this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
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
        return new Http(this.url(), this.method(), this.headers(), body, this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
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
        return new Http(this.url(), this.method(), this.headers(), this.body(), responseType, this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
      },
      writable: true,
      configurable: true
    },
    withDynamicSegment: {

      /**
       * Adds dynamic segment value
       */

      value: function withDynamicSegment(segment, value) {
        var dynamicSegments = new Map(this.dynamicSegments()).set(segment, value);
        return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), dynamicSegments, this.queryParams(), this.bodyProcessor());
      },
      writable: true,
      configurable: true
    },
    withParam: {

      /**
       * Adds query string param
       */

      value: function withParam(name, value) {
        var queryParams = new Map(this.queryParams()).set(name, value);
        return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), queryParams, this.bodyProcessor());
      },
      writable: true,
      configurable: true
    },
    withBodyProccessor: {

      /**
       * Sets the function which gets the body object as a parameter
       * which result would be used as a request body
       */

      value: function withBodyProccessor(bodyProcessor) {
        return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), bodyProcessor);
      },
      writable: true,
      configurable: true
    },
    withJsonResponse: {

      /**
       * Sets response type to 'json'
       */

      value: function withJsonResponse() {
        return this.withResponseType("json");
      },
      writable: true,
      configurable: true
    },
    withJsonBody: {

      /**
       * Predifine body sringification and Content-Type attribute.
       */

      value: function withJsonBody() {
        return this.withHeader("Content-Type", "application/json").withBodyProccessor(JSON.stringify);
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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      if (typeof key != "string") {
        throw "Header key should be string";
      }
      if (typeof value != "string") {
        throw "Header " + key + " value should be string";
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var validateResponseType = function (type) {
  //if(!type) return; //support for not defined response content type.
  switch (type) {
    case null:
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

    var url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments());
    url = addQueryParams(url, http.queryParams());

    xmlhttp.open("GET", url, true);
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

    var url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments());
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
var mixinDynamicSegmentsValues = function (url, dynamicSegments) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = dynamicSegments.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      url = url.replace(":" + key, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return url;
};

/**
 * Adds query params string to url
 */
var addQueryParams = function (url, queryParams) {
  if (queryParams.size == 0) return url;
  var chanks = [queryParams.lenght];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = queryParams.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      chanks.push("" + key + "=" + value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return url + "?" + chanks.join("&");
};

/**
 * Adds headers to xmlhttp object
 */
var addHeaders = function (xmlhttp, headers) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      xmlhttp.setRequestHeader(key, value);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"]) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

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
    response: http.responseType() ? xmlhttp.response : xmlhttp.responseText,
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
