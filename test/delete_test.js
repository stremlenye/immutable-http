/*global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http DELETE', () => {
  describe('Deprecated API', () => {
    it('execute simple delete request', () => {
      const client = (new Http()).withMethod('DELETE')
        .withUrl('http://localhost:3000/')

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
      }, reason => {
        throw reason
      })
    })
  })

  describe('Current API', () => {
    it('execute simple delete request', () => {
      const client = (new Http()).method('DELETE')
        .url('http://localhost:3000/')

      return client.exec().then(data => {
        expect(data.status).to.equal(200)
      }, reason => {
        throw reason
      })
    })
  })
})
