#Immutable Java Script http client

Http client with pretty simple chaining API

####Usage

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
  headers: string
}
```

Response type options could be obtained from XMLHttp [specs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)

####Build
Using [Babel](https://babeljs.io)
```
sudo babel src/immutable-http.es6 --out-file lib/immutable-http.js
```

####Tests
Built on [Jest](http://facebook.github.io/jest/)
```
npm test
```
