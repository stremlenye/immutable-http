### Immutable-http

[![npm version](https://badge.fury.io/js/immutable-http.svg)](http://badge.fury.io/js/immutable-http)

Http client with pretty simple chaining API

#### Usage

```
var result = new Http().withUrl('http://any_api.com')
                        .withMethod('GET')
                        .withHeader('Content-Type','application/json')
                        .withBody({some:data})
                        .withResponseType('json')
                        .exec();
```

```
result = {
  status: int,
  response: [obj|string],
  text:string /*
              * String response representation to support https://github.com/driverdan/node-XMLHttpRequest
              */
  headers: string
}
```

Response type options could be obtained from XMLHttp [specs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

#### Build
Using [Babel](https://babeljs.io)
```
babel src/immutable-http.es6 --out-file lib/immutable-http.js
```

#### Tests
Run
```
node server
```

then
```
npm test
```
Built on [Jest](http://facebook.github.io/jest/)
