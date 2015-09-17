/* global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http POST', () => {
  describe('Deprecated API', () => {
    it('execute simple post request', () => {
      const obj = {some: 'body'}

      const client = (new Http()).withMethod('POST')
        .withUrl('http://localhost:3000')
        .withHeader('Content-Type', 'application/json;charset=UTF-8')
        .withHeader('Accept', 'application/json')
        .withResponseType('json')
        .withBodyProccessor(JSON.stringify)
        .withBody(obj)

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })

    it('execute post request with dinamic segment', () => {
      const obj = {some: 'body'}

      const client = (new Http()).withMethod('POST')
        .withUrl('http://localhost:3000/:some_segment')
        .withDynamicSegment('some_segment', 'test')
        .withHeader('Content-Type', 'application/json;charset=UTF-8')
        .withHeader('Accept', 'application/json')
        .withResponseType('json')
        .withBodyProccessor(JSON.stringify)
        .withBody(obj)

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })
  })

  describe('Current API', () => {
    it('execute simple post request', () => {
      const obj = {some: 'body'}

      const client = (new Http()).method('POST')
        .url('http://localhost:3000')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .responseType('json')
        .bodyProcessor(JSON.stringify)
        .body(obj)

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })

    it('execute post request with dinamic segment', () => {
      const obj = {some: 'body'}

      const client = (new Http()).method('POST')
        .url('http://localhost:3000/:some_segment')
        .segment('some_segment', 'test')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .responseType('json')
        .bodyProcessor(JSON.stringify)
        .body(obj)

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.deep.equal(obj)
      }, reason => {
        throw reason
      })
    })
  })
})
