/*global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http PUT', () => {
  describe('Deprecated API', () => {
    it('execute simple put request', () => {
      const obj = { some: 'body' }
      const client = (new Http()).withMethod('PUT')
        .withUrl('http://localhost:3000/:some_segment')
        .withDynamicSegment('some_segment', 'test')
        .withHeader('Content-Type', 'application/json;charset=UTF-8')
        .withHeader('Accept', 'application/json')
        .withBodyProccessor(JSON.stringify)
        .withBody(obj)
        .withResponseType('json')

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })
  })

  describe('Current API', () => {
    it('execute simple put request', () => {
      const obj = { some: 'body' }
      const client = (new Http()).method('PUT')
        .url('http://localhost:3000/:some_segment')
        .segment('some_segment', 'test')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .bodyProcessor(JSON.stringify)
        .body(obj)
        .responseType('json')

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })
  })
})
