jest.autoMockOff();

describe('Http DELETE', function () {
  pit("execute simple delete request", function () {
    var Http = require('../src/immutable-http');

    var obj = {some:'body'};
    var body = JSON.stringify(obj); /* Hack to make https://github.com/driverdan/node-XMLHttpRequest work
                                    * Take a look to this issue https://github.com/driverdan/node-XMLHttpRequest/issues/43
                                    */

    var client = (new Http()).withMethod('DELETE')
      .withUrl('http://localhost:3000:some_segment')
      .withDynamicSegment('some_segment', 'test')
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
