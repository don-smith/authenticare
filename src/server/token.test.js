/* eslint-disable jest/no-done-callback */

beforeEach(() => jest.resetModules())

describe('token', () => {
  it('getIssuer returns a token issuer middleware function', done => {
    jest.mock('jsonwebtoken', () => ({
      sign: () => 'test-token'
    }))

    const token = require('./token')

    expect.assertions(3)

    const req = {
      body: {
        username: 'test-user'
      }
    }

    const res = {
      json: ({ token, message }) => {
        expect(token).toBe('test-token')
        expect(message).toBe('Authentication successful.')
        done()
      }
    }

    const getUserByName = username => {
      expect(username).toBe(req.body.username)
      return Promise.resolve({
        id: 1,
        username: username
      })
    }

    token.getIssuer(getUserByName)(req, res)
  })

  it('getIssuer returns a token with a defined expiration time', (done) => {
    expect.assertions(1)
    jest.mock('jsonwebtoken', () => ({
      sign: (token, secret, expires) => {
        return {
          token,
          secret,
          expires
        }
      }
    }))

    const jwtExpireTime = '5h'
    process.env.JWT_EXPIRE_TIME = jwtExpireTime
    const token = require('./token')
    const res = {
      json: ({ token }) => {
        expect(token.expires.expiresIn).toBe(jwtExpireTime)
        delete process.env.JWT_EXPIRE_TIME
        done()
      }
    }

    const getUserByName = () => {
      return Promise.resolve()
    }

    token.getIssuer(getUserByName)({ body: {} }, res)
  })

  it('getIssuer returns a token with a default expiration time', (done) => {
    expect.assertions(1)
    jest.mock('jsonwebtoken', () => ({
      sign: (token, secret, expires) => {
        return {
          token,
          secret,
          expires
        }
      }
    }))

    const token = require('./token')
    const res = {
      json: ({ token }) => {
        expect(token.expires.expiresIn).toBe('1d')
        done()
      }
    }

    const getUserByName = () => {
      return Promise.resolve({})
    }

    token.getIssuer(getUserByName)({ body: {} }, res)
  })

  it('default expiration time is 1 day', () => {
    jest.mock('jsonwebtoken', () => ({
      sign: (token, secret, expires) => {
        return {
          token,
          secret,
          expires
        }
      }
    }))

    const token = require('./token')

    const testToken = token.createToken({}, 'test-secret')

    expect(testToken.expires.expiresIn).toBe('1d')
  })

  it('createToken returns a signed token', () => {
    jest.mock('jsonwebtoken', () => ({
      sign: () => 'test-token'
    }))

    const token = require('./token')

    const testToken = token.createToken({}, 'test-secret')

    expect(testToken).toBe('test-token') // from the mock at the top of the file
  })

  it('getTokenDecoder invokes the express-jwt middleware function', () => {
    // TODO: I'm not thrilled with this test. What is it _really_ testing?
    expect.assertions(5)

    jest.mock('express-jwt', () => {
      return ({ secret }) => {
        expect(typeof secret).toBe('function')

        return (req, res, next) => {
          expect(req).toBe('req')
          expect(res).toBe('res')
          expect(next).toBe('next')
        }
      }
    })

    const tokenDecoder = require('./token').getTokenDecoder()
    expect(typeof tokenDecoder).toBe('function')

    tokenDecoder('req', 'res', 'next')
  })
})
