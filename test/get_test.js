/*global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http GET', () => {
  describe('Deprecated API', () => {
    it('execute simple get request', () => {
      const client = (new Http()).withMethod('GET')
        .withUrl('http://localhost:3000')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('some_get_info')
      }, reason => {
        throw reason
      })
    })

    it('execute get request with dynamic segments in the url', () => {
      const client = (new Http()).withMethod('GET')
        .withUrl('http://localhost:3000/:some_segment')
        .withDynamicSegment('some_segment', 'test')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('some_get_info')
      }, reason => {
        throw reason
      })
    })

    it('execute get request with query params', () => {
      const client = (new Http()).withMethod('GET')
        .withUrl('http://localhost:3000/query')
        .withParam('ping', 'pong')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('{"ping":"pong"}')
      }, reason => {
        throw reason
      })
    })
  })

  describe('Current API', () => {
    it('execute simple get request', () => {
      const client = (new Http()).method('GET')
        .url('http://localhost:3000')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('some_get_info')
      }, reason => {
        throw reason
      })
    })

    it('execute get request with dynamic segments in the url', () => {
      const client = (new Http()).method('GET')
        .url('http://localhost:3000/:some_segment')
        .segment('some_segment', 'test')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('some_get_info')
      }, reason => {
        throw reason
      })
    })

    it('execute get request with query params', () => {
      const client = (new Http()).withMethod('GET')
        .url('http://localhost:3000/query')
        .query('ping', 'pong')
      return client.exec().then(data => {
        expect(data.status).to.equal(200)
        expect(data.response).to.equal('{"ping":"pong"}')
      }, reason => {
        throw reason
      })
    })
  })
})
