require('dotenv').config()

const express = require('express')
const request = require('supertest')

const endpoints = require('../shared/endpoints')

const functions = {
  getUserByName: () => Promise.resolve({
    id: 1,
    other: 'value',
    hash: 'test-hash',
    username: 'test-user'
  }),
  userExists: () => Promise.resolve(false),
  createUser: () => Promise.resolve()
}

process.env.JWT_SECRET = 'test-jwt-secret'

describe('applyAuthRoutes', () => {
  beforeEach(() => jest.resetModules())

  it('creates an operational /auth/register route', () => {
    const { applyAuthRoutes } = require('./routes')

    const server = express()
    server.use(express.json())
    const router = express.Router()
    server.use('/', router)

    applyAuthRoutes(router, functions)

    return request(server)
      .post(endpoints.registerUrl)
      .expect(200)
      .send({
        username: 'test-user',
        password: 'test-password'
      })
      .then(res => {
        expect(res.body.message).toMatch('successful')
        expect(res.body.token).toHaveLength(189)

        const request = {
          headers: { authorization: `Bearer ${res.body.token}` }
        }
        const response = {}
        const verifyJwt = require('express-jwt')
        verifyJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] })(
          request,
          response,
          (err) => {
            if (err) console.error(err)
            expect(request.user.id).toBe(1)
            expect(request.user.other).toBe('value')
            expect(request.user.username).toBe('test-user')
          })
        return null
      })
  })

  it('creates an operational /auth/signin route', () => {
    jest.mock('./hash', () => {
      return {
        verify: () => Promise.resolve(true)
      }
    })
    const { applyAuthRoutes } = require('./routes')

    const server = express()
    server.use(express.json())
    const router = express.Router()
    server.use('/', router)

    applyAuthRoutes(router, functions)

    return request(server)
      .post(endpoints.signInUrl)
      .expect(200)
      .send({
        username: 'test-user',
        password: 'test-password'
      })
      .then(res => {
        expect(res.body.message).toMatch('successful')
        expect(res.body.token).toHaveLength(189)
        return null
      })
  })

  describe('/auth/register', () => {
    it('returns status 400 if the username is already being used', () => {
      const { applyAuthRoutes } = require('./routes')

      const server = express()
      server.use(express.json())
      const router = express.Router()
      server.use('/', router)

      functions.userExists = () => Promise.resolve(true)
      applyAuthRoutes(router, functions)

      return request(server)
        .post(endpoints.registerUrl)
        .expect(400)
        .send({})
        .then(res => {
          expect(res.body.errorType).toMatch('USERNAME_UNAVAILABLE')
          return null
        })
    })

    it('returns status 500 if there is a database error', () => {
      const { applyAuthRoutes } = require('./routes')

      const server = express()
      server.use(express.json())
      const router = express.Router()
      server.use('/', router)

      functions.userExists = () => Promise.reject(new Error())
      applyAuthRoutes(router, functions)

      return request(server)
        .post(endpoints.registerUrl)
        .expect(500)
        .send({})
        .then(res => {
          expect(res.body.errorType).toMatch('DATABASE_ERROR')
          return null
        })
    })
  })

  describe('/auth/signin', () => {
    it('returns a status 400 if no user is returned from the database', () => {
      const { applyAuthRoutes } = require('./routes')

      const server = express()
      server.use(express.json())
      const router = express.Router()
      server.use('/', router)

      functions.getUserByName = () => Promise.resolve(null)
      applyAuthRoutes(router, functions)

      return request(server)
        .post(endpoints.signInUrl)
        .expect(400)
        .send({})
        .then(res => {
          expect(res.body.errorType).toMatch('INVALID_CREDENTIALS')
          return null
        })
    })

    it('returns a status 400 if the password and hash do not match', () => {
      jest.mock('./hash', () => {
        return {
          verify: () => Promise.resolve(false)
        }
      })
      const { applyAuthRoutes } = require('./routes')

      const server = express()
      server.use(express.json())
      const router = express.Router()
      server.use('/', router)

      applyAuthRoutes(router, functions)

      return request(server)
        .post(endpoints.signInUrl)
        .expect(400)
        .send({})
        .then(res => {
          expect(res.body.errorType).toMatch('INVALID_CREDENTIALS')
          return null
        })
    })
  })
})
