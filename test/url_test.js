/* global describe:true it:true */
import { expect } from 'chai'
import { addQueryParams } from '../src/utils/url'

describe('addQueryParams', () => {
  it('combines url string with query params', () => {
    const url = 'http://localhost'
    const queryParams = [['ping', 'pong'], ['foo', 'bar']]
    const result = addQueryParams(url, queryParams)
    expect(result).to.equal('http://localhost?ping=pong&foo=bar')
  })
  it('returns url itself if queryParams is empty', () => {
    const url = 'http://localhost'
    const queryParams = []
    const result = addQueryParams(url, queryParams)
    expect(result).to.equal('http://localhost')
  })
})
