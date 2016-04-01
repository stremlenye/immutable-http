/* global describe:true it:true */
import { expect } from 'chai'
import validate from '../src/validate'

const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE']
const validTypes = [null, '', 'arraybuffer', 'blob', 'document', 'text', 'json']

describe('validate function', () => {
  it('should return nothing if constraints are correct', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set('Authentication', 'Token blah==')
    for (let method of supportedMethods)
      for (let type of validTypes)
        expect(validate(url, method, headers, type)).to.be.empty //eslint-disable-line
  })

  it('should return "HTTP method is not specified" if no method have been"'
    + '"provided', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set('Authentication', 'Token blah==')
    const [type] = validTypes
    expect(validate(url, null, headers, type))
      .to.eql(['HTTP method is not specified'])
  })

  it('should return "HTTP method should be type of string" if method is not '
    + 'type of string', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set('Authentication', 'Token blah==')
    const [type] = validTypes
    expect(validate(url, 1, headers, type))
      .to.eql(['HTTP method should be type of string'])
  })

  it('should return "Http method ${method} is not supported" if method is not "'
    + '"supported', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set('Authentication', 'Token blah==')
    const [type] = validTypes
    expect(validate(url, 'BOOM!', headers, type))
      .to.eql(['Http method BOOM! is not supported'])
  })

  it('should return "Url is not specified" if no url provided', () => {
    const headers = new Map().set('Authentication', 'Token blah==')
    const [method] = supportedMethods
    const [type] = validTypes
    expect(validate(null, method, headers, type))
      .to.eql(['Url is not specified'])
  })

  it('should return "Url should be type of string" if no url provided', () => {
    const headers = new Map().set('Authentication', 'Token blah==')
    const [method] = supportedMethods
    const [type] = validTypes
    expect(validate(1, method, headers, type))
      .to.eql(['Url should be type of string'])
  })

  it('should return "Parts of header ${key}:${value} must be strings" if '
    + 'headers are not of type string', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set(1, 2)
    const [method] = supportedMethods
    const [type] = validTypes
    expect(validate(url, method, headers, type))
      .to.eql(['Parts of header 1:2 must be strings'])
  })

  it('should return "Response content type ${type} is not currently supported" if ', () => {
    const url = 'http://my.com/blah?query=string&another=string'
    const headers = new Map().set('Authentication', 'Token blah==')
    const [method] = supportedMethods
    expect(validate(url, method, headers, 'BOOM!'))
      .to.eql(['Response content type BOOM! is not supported'])
  })
})
