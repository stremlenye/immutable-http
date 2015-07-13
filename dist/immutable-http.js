/*
 * Immutable HTTP client object
 */

/*jshint esnext: true */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _promise = require('promise');

var _promise2 = _interopRequireDefault(_promise);

var Http = (function () {
  function Http() {
    var url = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var method = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var headers = arguments.length <= 2 || arguments[2] === undefined ? new Map() : arguments[2];
    var body = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
    var responseType = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    var dynamicSegments = arguments.length <= 5 || arguments[5] === undefined ? new Map() : arguments[5];
    var queryParams = arguments.length <= 6 || arguments[6] === undefined ? new Map() : arguments[6];
    var bodyProcessor = arguments.length <= 7 || arguments[7] === undefined ? function (b) {
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

  _createClass(Http, [{
    key: 'withUrl',

    /**
     * Adds URL information to HTTP request model
     * Returns new request model
     */
    value: function withUrl(url) {
      return new Http(url, this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withMethod',

    /**
     * Adds HTTP method information to request model
     * Returns new request model
     */
    value: function withMethod(method) {
      return new Http(this.url(), method, this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withHeader',

    /**
     * Adds header to request model
     * Returns new request model
     */
    value: function withHeader(header, value) {
      var headers = new Map(this.headers()).set(header, value);
      return new Http(this.url(), this.method(), headers, this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withBody',

    /**
     * Adds body to request model
     * Returns new request model
     */
    value: function withBody(body) {
      return new Http(this.url(), this.method(), this.headers(), body, this.responseType(), this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withResponseType',

    /**
     * Sets response content type
     * Proper values could be obtained form XmlHttpRequest specification
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
     */
    value: function withResponseType(responseType) {
      return new Http(this.url(), this.method(), this.headers(), this.body(), responseType, this.dynamicSegments(), this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withDynamicSegment',

    /**
     * Adds dynamic segment value
     */
    value: function withDynamicSegment(segment, value) {
      var dynamicSegments = new Map(this.dynamicSegments()).set(segment, value);
      return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), dynamicSegments, this.queryParams(), this.bodyProcessor());
    }
  }, {
    key: 'withParam',

    /**
     * Adds query string param
     */
    value: function withParam(name, value) {
      var queryParams = new Map(this.queryParams()).set(name, value);
      return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), queryParams, this.bodyProcessor());
    }
  }, {
    key: 'withBodyProccessor',

    /**
     * Sets the function which gets the body object as a parameter
     * which result would be used as a request body
     */
    value: function withBodyProccessor(bodyProcessor) {
      return new Http(this.url(), this.method(), this.headers(), this.body(), this.responseType(), this.dynamicSegments(), this.queryParams(), bodyProcessor);
    }
  }, {
    key: 'withJsonResponse',

    /**
     * Sets response type to 'json'
     */
    value: function withJsonResponse() {
      return this.withResponseType('json');
    }
  }, {
    key: 'withJsonBody',

    /**
     * Predifine body sringification and Content-Type attribute.
     */
    value: function withJsonBody() {
      return this.withHeader('Content-Type', 'application/json').withBodyProccessor(JSON.stringify);
    }
  }, {
    key: 'exec',

    /**
     * Executes HTTP request
     */
    value: (function (_exec) {
      function exec() {
        return _exec.apply(this, arguments);
      }

      exec.toString = function () {
        return _exec.toString();
      };

      return exec;
    })(function () {
      validate(this);
      return exec(this);
    })
  }]);

  return Http;
})();

/**
 * Validate HTTP request model
 */
var validate = function validate(http) {
  validateUrl(http.url());
  validateMethod(http.method());
  validateHeaders(http.headers());
  validateResponseType(http.responseType());
};

/**
 * Basicly validate url
 */
var validateUrl = function validateUrl(url) {
  if (!url) {
    throw 'Url is not specified';
  }
  if (typeof url != 'string') {
    throw 'Url should be type of string';
  }
};

/**
 * Validate HTTP method
 */
var validateMethod = function validateMethod(method) {
  if (!method) {
    throw 'HTTP method is not specified';
  }
  if (typeof method !== 'string') {
    throw 'HTTP method should be type of string';
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
    throw 'Http method  ' + method + ' is not supported';
  }
};

/**
 * Validate headers
 */
var validateHeaders = function validateHeaders(headers) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = headers.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2);

      var key = _step$value[0];
      var value = _step$value[1];

      if (typeof key != 'string') {
        throw 'Header key should be string';
      }
      if (typeof value != 'string') {
        throw 'Header ' + key + ' value should be string';
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

var validateResponseType = function validateResponseType(type) {
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
  throw 'Response content type ' + type + ' is not currently supported';
};

/**
 * Executes validated http request
 */
var exec = function exec(http) {
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
      throw 'Method ' + http.method + ' is not supported';
  }
};

/**
 * Executes GET request
 */
var get = function get(http) {
  return new _promise2['default'](function (fulfill, reject) {
    var xmlhttp = getXmlHttp(onSucceed.bind(undefined, fulfill, http), onFailed.bind(undefined, reject, http));

    var url = mixinDynamicSegmentsValues(http.url(), http.dynamicSegments());
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
var post = function post(http) {
  return submit(http);
};

/**
 * Executes PUT request
 */
var put = function put(http) {
  return submit(http);
};

/**
 * Executes DELETE request
 */
var del = function del(http) {
  return submit(http);
};

/**
 * Executes any submit type request
 */
var submit = function submit(http) {
  return new _promise2['default'](function (fulfill, reject) {
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
var mixinDynamicSegmentsValues = function mixinDynamicSegmentsValues(url, dynamicSegments) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = dynamicSegments.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _step2$value = _slicedToArray(_step2.value, 2);

      var key = _step2$value[0];
      var value = _step2$value[1];

      url = url.replace(':' + key, value);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return url;
};

/**
 * Adds query params string to url
 */
var addQueryParams = function addQueryParams(url, queryParams) {
  if (queryParams.size == 0) return url;
  var chanks = [queryParams.lenght];
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = queryParams.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var _step3$value = _slicedToArray(_step3.value, 2);

      var key = _step3$value[0];
      var value = _step3$value[1];

      chanks.push(key + '=' + value);
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return url + '?' + chanks.join('&');
};

/**
 * Adds headers to xmlhttp object
 */
var addHeaders = function addHeaders(xmlhttp, headers) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = headers.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var _step4$value = _slicedToArray(_step4.value, 2);

      var key = _step4$value[0];
      var value = _step4$value[1];

      xmlhttp.setRequestHeader(key, value);
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4['return']) {
        _iterator4['return']();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return xmlhttp;
};

var setResponseType = function setResponseType(xmlhttp, responseType) {
  if (!responseType) return;
  xmlhttp.responseType = responseType;
  return xmlhttp;
};

/**
 * Executes if xmlhttp request succeed
 */
var onSucceed = function onSucceed(fulfill, http, xmlhttp) {
  fulfill({
    status: xmlhttp.status,
    response: http.responseType() ? xmlhttp.response : xmlhttp.responseText,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Executes if xmlhttp request failed
 */
var onFailed = function onFailed(reject, http, xmlhttp) {
  reject({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
};

/**
 * Cunstructs XmlHttpRequest object
 */
var getXmlHttp = function getXmlHttp(fulfill, reject) {
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
var isStatusOkLike = function isStatusOkLike(statusCode) {
  var delta = statusCode - 200;
  var isOk = delta >= 0;
  return isOk && delta < 100;
};

exports['default'] = Http;
module.exports = exports['default'];
