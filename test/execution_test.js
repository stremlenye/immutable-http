/* global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http GET', () => {
  describe('Deprecated API', () => {
    it('execute simple get request', (done) => {
      const url = 'http://localhost:3000/:some_segment'
      const method = 'POST'
      const obj = {some: 'body'}
      const executor = (u, m, headers, responseType, body) => new Promise(_ => {
        try {
          expect(u).to.equal('http://localhost:3000/test?ping=pong')
          expect(m).to.equal(method)
          expect(headers).to.eql([
            ['Content-Type', 'application/json;charset=UTF-8'],
            ['Accept', 'application/json']
          ])
          expect(responseType).to.be.equal('json')
          expect(body).to.be.equal(JSON.stringify(obj))
        } catch(e) {
          done(e)
        } finally {
          done()
        }
      })
      const client = (new Http()).withMethod(method)
        .executor(executor)
        .withUrl(url)
        .withDynamicSegment('some_segment', 'test')
        .withParam('ping', 'pong')
        .withHeader('Content-Type', 'application/json;charset=UTF-8')
        .withHeader('Accept', 'application/json')
        .withResponseType('json')
        .withBodyProccessor(JSON.stringify)
        .withBody(obj)
      return client.exec()
    })
  })

  describe('Current API', () => {
    it('execute simple get request without query', (done) => {
      const url = 'http://localhost:3000/:some_segment'
      const method = 'GET'
      const executor = (u, m, headers, responseType, body) => new Promise(_ => {
        try {
          expect(u).to.equal('http://localhost:3000/test')
          expect(m).to.equal(method)
          expect(headers).to.eql([
            ['Content-Type', 'application/json;charset=UTF-8'],
            ['Accept', 'application/json']
          ])
          expect(responseType).to.be.equal('json')
        } catch(e) {
          done(e)
        } finally {
          done()
        }
      })
      const client = (new Http()).withMethod(method)
        .executor(executor)
        .url(url)
        .segment('some_segment', 'test')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .responseType('json')
        .responseProcessor(response => {
          switch (response.code) {
            case "404":
              return { message: 'Resource not found' }
            default:
              return response
          }
        })
      return client.exec()
    })

    it('execute simple post request', (done) => {
      const url = 'http://localhost:3000/:some_segment'
      const method = 'POST'
      const obj = {some: 'body'}
      const executor = (u, m, headers, responseType, body) => new Promise(_ =>{
        try {
          expect(u).to.equal('http://localhost:3000/test?ping=pong')
          expect(m).to.equal(method)
          expect(headers).to.eql([
            ['Content-Type', 'application/json;charset=UTF-8'],
            ['Accept', 'application/json']
          ])
          expect(responseType).to.be.equal('json')
          expect(body).to.be.equal(JSON.stringify(obj))
        } catch(e) {
          done(e)
        } finally {
          done()
        }
      })
      const client = (new Http()).withMethod(method)
        .executor(executor)
        .url(url)
        .segment('some_segment', 'test')
        .query('ping', 'pong')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .responseType('json')
        .bodyProcessor(JSON.stringify)
        .responseProcessor(response => {
          switch (response.code) {
            case "404":
              return { message: 'Resource not found' }
            default:
              return response
          }
        })
        .body(obj)
      return client.exec()
    })
  })
})
