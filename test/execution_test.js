/* global describe:true it:true */

import { expect } from 'chai'
import Http from '../src'

describe('Http GET', () => {
  describe('API', () => {
    it('execute simple get request without query', (done) => {
      const url = 'http://localhost:3000/:some_segment'
      const method = 'GET'
      const executor = (u, m, headers, responseType) => new Promise(() => {
        try {
          expect(u).to.equal('http://localhost:3000/test')
          expect(m).to.equal(method)
          expect(headers).to.eql([
            ['Content-Type', 'application/json;charset=UTF-8'],
            ['Accept', 'application/json']
          ])
          expect(responseType).to.be.equal('json')
        } catch (e) {
          done(e)
        } finally {
          done()
        }
      })
      const client = (new Http()).method(method)
        .executor(executor)
        .url(url)
        .segment('some_segment', 'test')
        .header('Content-Type', 'application/json;charset=UTF-8')
        .header('Accept', 'application/json')
        .responseType('json')
        .responseProcessor(response => {
          switch (response.code) {
            case '404':
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
      const executor = (u, m, headers, responseType, body) => new Promise(() => {
        try {
          expect(u).to.equal('http://localhost:3000/test?ping=pong')
          expect(m).to.equal(method)
          expect(headers).to.eql([
            ['Content-Type', 'application/json;charset=UTF-8'],
            ['Accept', 'application/json']
          ])
          expect(responseType).to.be.equal('json')
          expect(body).to.be.equal(JSON.stringify(obj))
        } catch (e) {
          done(e)
        } finally {
          done()
        }
      })
      const client = (new Http()).method(method)
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
            case '404':
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
