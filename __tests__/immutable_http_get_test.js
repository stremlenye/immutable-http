jest.autoMockOff();

describe('Http GET', function() {
  pit("execute simple get request", function() {
    var Http = require('../src/immutable-http');
    var client = (new Http()).withMethod('GET').withUrl('http://localhost:3000');
    return client.exec().then(function(data) {
      expect(data.status).toBe(200);
      expect(data.response).toBe("some_get_info");
    }, function(reason) {
      throw reason;
    });
  });

  pit("execute get request with dynamic segments in the url", function() {
    var Http = require('../src/immutable-http');
    var client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000/:some_segment')
      .withDynamicSegment('some_segment', 'test');
    return client.exec().then(function(data) {
      expect(data.status).toBe(200);
      expect(data.response).toBe("some_get_info");
    }, function(reason) {
      throw reason.status;
    });
  });

  pit("execute get request with query params", function() {
    var Http = require('../src/immutable-http');
    var client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000')
      .withParam('ping','pong');
    return client.exec().then(function(data) {
      expect(data.status).toBe(200);
      expect(data.response).toBe("ping=pong");
    }, function(reason) {
      throw reason;
    });
  });
});
