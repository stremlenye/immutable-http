/*global describe:true it:true */
import { expect } from 'chai'
import Http from '../src/immutable-http'

describe('Http POST', () => {
  it('execute simple post request', () => {
    const obj = {some: 'body'}

    const client = (new Http()).withMethod('POST')
      .withUrl('http://localhost:3000')
      .withHeader('Content-Type', 'application/json')
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

  it('execute post request with dinamic segment', () => {
    const obj = {some: 'body'}

    const client = (new Http()).withMethod('POST')
      .withUrl('http://localhost:3000/:some_segment')
      .withDynamicSegment('some_segment', 'test')
      .withHeader('Content-Type', 'application/json')
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
