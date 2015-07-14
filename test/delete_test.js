/*global describe:true it:true */
import { expect } from 'chai'
import Http from '../src'

describe('Http DELETE', () => {
  it('execute simple delete request', () => {
    const obj = { some: 'body' }

    const client = (new Http()).withMethod('DELETE')
      .withUrl('http://localhost:3000/:some_segment')
      .withDynamicSegment('some_segment', 'test')
      .withHeader('Content-Type', 'application/jsoncharset=UTF-8')
      .withHeader('Accept', 'application/json')
      .withResponseType('json')
      .withBodyProccessor(JSON.stringify)
      .withBody(obj)

    return client.exec().then(data => {
      expect(data.status).to.equal(200)
      expect(data.text).to.equal(obj)
    }, reason => {
      throw reason
    })
  })
})
