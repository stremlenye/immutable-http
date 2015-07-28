### Immutable-http

[![npm version](https://badge.fury.io/js/immutable-http.svg)](http://badge.fury.io/js/immutable-http)

Http client with pretty simple chaining API

#### Usage

```
var result = new Http().url('http://any_api.com/:id')
                        .method('GET')
                        .header('Content-Type','application/json')
                        .body({some:data})
                        .responseType('json')
                        .segment('id',123)
                        .query('filter','some_filter') // Adds query section for the url like '?filter=some_filter'
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

```
npm run dist
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
