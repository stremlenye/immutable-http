### Immutable-http

[![npm version](https://badge.fury.io/js/immutable-http.svg)](http://badge.fury.io/js/immutable-http)

Http client with pretty simple chaining API

#### Usage

```
var result = new Http().withUrl('http://any_api.com/:id')
                        .withMethod('GET')
                        .withHeader('Content-Type','application/json')
                        .withBody({some:data})
                        .withResponseType('json')
                        .withDynamicSegment('id',123)
                        .withParam('filter','some_filter') // Adds query section to the url like '?filter=some_filter'
                        .exec();
```

```
result = Promise({
  status: int,
  response: [obj|string],
  headers: string
}, {
  status: int,
  response: [obj|string],
  headers: string
})
```

Response type options could be obtained from XMLHttp [specs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

#### Build
Using [Babel](https://babeljs.io)
```
babel --modules common src/immutable-http.es6 --out-file lib/immutable-http.js
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
