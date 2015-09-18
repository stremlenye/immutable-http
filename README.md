### Immutable-http

[![npm version](https://badge.fury.io/js/immutable-http.svg)](http://badge.fury.io/js/immutable-http)

__Http client with pretty simple chaining API__

[Docs](http://stremlenye.github.io/immutable-http/)

#### Usage

```js
import executor from 'third-party-executor'

var result = new Http().url('http://any_api.com/:id')
                        .executor(executor)
                        .method('GET')
                        .header('Content-Type','application/json')
                        .body({some:data})
                        .responseType('json')
                        .segment('id',123)
                        .query('filter','some_filter') // Adds query section for the url like '?filter=some_filter'
                        .exec(); // returns Promise
```
`executor` is just a function with signature
```scala
f(url: String, method: String, headers:Array[Tuple[String, String]], responseType: String, body: Any): Promise
```
It allows you to have your own favorite HTTP library under the hood and be able to test your code with mocked `executor` without any hacks.
[Executor implementation example](https://github.com/stremlenye/simple-immutablehttp-executor)

#### Build

```
npm run dist
```

#### Tests
Run

```
npm test
```
