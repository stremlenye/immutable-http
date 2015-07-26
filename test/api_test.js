/*global describe:true it:true */
/*eslint-disable no-unused-expressions  */

import 'babel/polyfill'
import { expect } from 'chai'
import Http from '../src'

describe('API', () => {
  it('has method `url`', () => {
    const http = new Http()
    expect(http.url).to.not.be.undefined
  })

  it('has method `method`', () => {
    const http = new Http()
    expect(http.method).to.not.be.undefined
  })

  it('has method `header`', () => {
    const http = new Http()
    expect(http.header).to.not.be.undefined
  })

  it('has method `body`', () => {
    const http = new Http()
    expect(http.body).to.not.be.undefined
  })

  it('has method `responseType`', () => {
    const http = new Http()
    expect(http.responseType).to.not.be.undefined
  })

  it('has method `segment`', () => {
    const http = new Http()
    expect(http.segment).to.not.be.undefined
  })

  it('has method `query`', () => {
    const http = new Http()
    expect(http.query).to.not.be.undefined
  })

  it('has method `bodyProcessor`', () => {
    const http = new Http()
    expect(http.bodyProcessor).to.not.be.undefined
  })
})
