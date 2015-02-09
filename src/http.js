/*
 * HTTP client
 */

/*jslint node: true */
'use strict';

var Promise = require('promise');

/**
 * HTTP request model
 */
var Http = function(request) {
  if (request) {
    return clone(request, new Http());
  }
  return this;
};

/**
 * Clones object
 */
function clone(obj, target) {
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
    if (!target)
      copy = {};
    else
      copy = target;
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }

  throw new Error("Unable to copy obj! Its type isn't supported.");
}

/**
 * Adds URL information to HTTP request model
 * Returns new request model
 */
Http.prototype.withUrl = function(url) {
  var request = new Http(this);
  request.url = url;
  return request;
};

/**
 * Adds HTTP method information to request model
 * Returns new request model
 */
Http.prototype.withMethod = function(method) {
  var request = new Http(this);
  request.method = method;
  return request;
};

/**
 * Adds header to request model
 * Returns new request model
 */
Http.prototype.withHeader = function(header, value) {
  var request = new Http(this);
  var tuple = {};
  tuple[header] = value;
  request.headers = (request.headers ? request.headers : []);
  request.headers.push(tuple);
  return request;
};

/**
 * Adds body to request model
 * Returns new request model
 */
Http.prototype.withBody = function(body) {
  var request = new Http(this);
  request.body = body;
  return request;
};

/**
 * Sets response content type
 * Proper values could be obtained form XmlHttpRequest specification
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#Properties
 */
Http.prototype.withResponseType = function(type) {
  var request = new Http(this);
  request.responseType = type;
  return request;
};

/**
 * Executes HTTP request
 */
Http.prototype.exec = function() {
  validate(this);
  return exec(this);
};

/**
 * Validate HTTP request model
 */
function validate(http) {
  validateUrl(http.url);
  validateMethod(http.method);
  validateHeaders(http.headers);
  validateResponseType(http.responseType);
}

/**
 * Basicly validate url
 */
function validateUrl(url) {
  if (!url) {
    throw "Url is not specified";
  }
  if (typeof(url) != 'string') {
    throw "Url should be type of string";
  }
}

/**
 * Validate HTTP method
 */
function validateMethod(method) {
  if (!method) {
    throw "HTTP method is not specified";
  }
  if (typeof(method) !== 'string') {
    throw "HTTP method should be type of string";
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
    throw "Http method '" + method + "' is not supported";
  }
}

/**
 * Validate headers
 */
function validateHeaders(headers) {
  if (!headers) {
    return;
  }
  if (Array.isArray(headers) == false) {
    throw 'Accidentally headers array was damaged';
  }
  headers.forEach(validateHeader);
}

/**
 * Validate header
 */
function validateHeader(header) {
  for (var key in header) {
    if (typeof(header[key]) != 'string') {
      throw "Header '" + key + "' value should be string";
    }
  }
}

function validateResponseType(type) {
  switch (type) {
    case '':
    case 'arraybuffer':
    case 'blob':
    case 'document':
    case 'text':
    case 'json':
      return;
  }
  throw "Response content type '" + type + "' is not currently supported";
}

/**
 * Executes validated http request
 */
function exec(http) {
  switch (http.method) {
    case 'GET':
      return get(http);

    case 'POST':
      return post(http);

    case 'PUT':
      return put(http);

    case 'DELETE':
      return del(http);

    default:
      throw "Method '" + http.method + "' is not supported";
  }
}

/**
 * Executes GET request
 */
function get(http) {
  return new Promise(function(fulfill, reject) {
    var xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    );

    xmlhttp.open('GET', http.url, true);
    addHeaders(xmlhttp, http.headers);
    setResponseType(xmlhttp, http.responseType);

    xmlhttp.send(null);
  });
}

/**
 * Executes POST request
 */
function post(http) {
  return submit(http);
}

/**
 * Executes PUT request
 */
function put(http) {
  return submit(http);
}

/**
 * Executes DELETE request
 */
function del(http) {
  return submit(http);
}

/**
 * Executes any submit type request
 */
function submit(http) {
  return new Promise(function(fulfill, reject) {
    var xmlhttp = getXmlHttp(
      onSucceed.bind(this, fulfill, http),
      onFailed.bind(this, reject, http)
    );

    xmlhttp.open(http.method, http.url, true);
    addHeaders(xmlhttp, http.headers);
    setResponseType(xmlhttp, http.responseType);

    xmlhttp.send(http.body);
  });
}

/**
 * Adds headers to xmlhttp object
 */
function addHeaders(xmlhttp, headers) {
  if (!headers) return;
  headers.forEach(function(header) {
    for (var key in header) {
      xmlhttp.setRequestHeader(key, header[key]);
    }
  });
  return xmlhttp;
}

function setResponseType(xmlhttp, responseType) {
  if(!responseType) return;
  xmlhttp.responseType = responseType;
  return xmlhttp;
}

/**
 * Executes if xmlhttp request succeed
 */
function onSucceed(fulfill, http, xmlhttp) {
  fulfill({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
}

/**
 * Executes if xmlhttp request failed
 */
function onFailed(reject, http, xmlhttp) {
  reject({
    status: xmlhttp.status,
    response: xmlhttp.response,
    headers: xmlhttp.getAllResponseHeaders()
  });
}

/**
 * Cunstructs XmlHttpRequest object
 */
var getXmlHttp = function(fulfill, reject) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
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
function isStatusOkLike(statusCode) {
  var delta = statusCode - 200;
  var isOk = delta >= 0;
  return isOk && delta < 100;
}

module.exports = Http;
