/*global describe:true it:true expect:true*/

import Http from '../src/immutable-http'

describe('Http GET', () => {
  it('execute simple get request', done => {
    const client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000')
    return client.exec().then(data => {
      done()
      expect(data.status).toBe(200)
      expect(data.response).toBe('some_get_info')
    }, reason => {
      done()
      throw reason
    })
  })

  it('execute get request with dynamic segments in the url', (done) => {
    const client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000/:some_segment')
      .withDynamicSegment('some_segment', 'test')
    return client.exec().then(data => {
      done()
      expect(data.status).toBe(200)
      expect(data.response).toBe('some_get_info')
    }, reason => {
      done()
      throw reason.status
    })
  })

  it('execute get request with query params', (done) => {
    const client = (new Http()).withMethod('GET')
      .withUrl('http://localhost:3000/query')
      .withParam('ping', 'pong')
    return client.exec().then(data => {
      done()
      expect(data.status).toBe(200)
      expect(data.response).toBe('{"ping":"pong"}')
    }, reason => {
      done()
      throw reason
    })
  })
})
