jest.autoMockOff();

describe('Http', function () {
  pit("execute simple get request", function () {
    var Http = require('../lib/immutable-http');
    var client = (new Http()).withMethod('GET').withUrl('http://localhost:3000');
    return client.exec().then(function (data) {
      expect(data.status).toBe(200);
      expect(data.response).toBe("some_get_info");
    },function (reason) {
      throw reason;
    });
  });

  pit("execute get request with dynamic segments in the url", function () {
    var Http = require('../lib/immutable-http');
    var client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000/:some_segment')
      .withDynamicSegment('some_segment','test');
    return client.exec().then(function (data) {
      expect(data.status).toBe(200);
      expect(data.response).toBe("some_get_info");
    },function (reason) {
      throw reason.status;
    });
  });

  pit("execute simple post request", function () {
    var Http = require('../lib/immutable-http');

    var obj = {some:'body'};
    var body = JSON.stringify(obj); /* Hack to make https://github.com/driverdan/node-XMLHttpRequest work
                                    * Take a look to this issue https://github.com/driverdan/node-XMLHttpRequest/issues/43
                                    */

    var client = (new Http()).withMethod('POST')
      .withUrl('http://localhost:3000')
      .withHeader('Content-Type','application/json')
      .withBody(body)
      .withResponseType('json');

    return client.exec().then(function (data) {
      expect(data.status).toBe(200);
      expect(data.text).toBe(body);
    },function (reason) {
      throw reason;
    });
  });

  pit("execute simple put request", function () {
    var Http = require('../lib/immutable-http');

    var obj = {some:'body'};
    var body = JSON.stringify(obj); /* Hack to make https://github.com/driverdan/node-XMLHttpRequest work
                                    * Take a look to this issue https://github.com/driverdan/node-XMLHttpRequest/issues/43
                                    */

    var client = (new Http()).withMethod('PUT')
      .withUrl('http://localhost:3000')
      .withHeader('Content-Type','application/json')
      .withBody(body)
      .withResponseType('json');

    return client.exec().then(function (data) {
      expect(data.status).toBe(200);
      expect(data.text).toBe(body);
    },function (reason) {
      throw reason;
    });
  });

  pit("execute simple delete request", function () {
    var Http = require('../lib/immutable-http');

    var obj = {some:'body'};
    var body = JSON.stringify(obj); /* Hack to make https://github.com/driverdan/node-XMLHttpRequest work
                                    * Take a look to this issue https://github.com/driverdan/node-XMLHttpRequest/issues/43
                                    */

    var client = (new Http()).withMethod('DELETE')
      .withUrl('http://localhost:3000')
      .withHeader('Content-Type','application/json')
      .withBody(body)
      .withResponseType('json');

    return client.exec().then(function (data) {
      expect(data.status).toBe(200);
      expect(data.text).toBe(body);
    },function (reason) {
      throw reason;
    });
  });
});
