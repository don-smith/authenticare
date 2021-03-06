const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })
require('core-js/stable')
const request = require('supertest')

const server = require('../server')
const db = require('../db/fruits') // the mock

jest.mock('../db/users')
jest.mock('../db/fruits')

beforeEach(() => {
  db.reset()
})

describe('GET /', () => {
  it('returns all the fruits', () => {
    return request(server)
      .get('/api/v1/fruits')
      .then(res => {
        expect(res.body.fruits).toHaveLength(3)
        return null
      })
  })
})

describe('POST /', () => {
  it('adds a new fruit', () => {
    return getTestToken(server)
      .then(token => {
        return request(server)
          .post('/api/v1/fruits')
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'durian', calories: 26 })
      })
      .then(res => {
        expect(res.body.fruits).toHaveLength(4)
        return null
      })
  })
})

describe('PUT /', () => {
  it('updates a fruit', () => {
    const newName = 'durian'

    return getTestToken(server)
      .then(token => {
        return request(server)
          .put('/api/v1/fruits')
          .set('Authorization', `Bearer ${token}`)
          .send({ id: 3, name: newName, calories: 26 })
      })
      .then(res => {
        expect(res.body.fruits[2].name).toBe(newName)
        return null
      })
  })
})

describe('DELETE /:id', () => {
  it('deletes the fruit', () => {
    return getTestToken(server)
      .then(token => {
        return request(server)
          .delete('/api/v1/fruits/1')
          .set('Authorization', `Bearer ${token}`)
      })
      .then(res => {
        expect(res.body.fruits).toHaveLength(2)
        return null
      })
  })
})

function getTestToken (srv) {
  return request(srv)
    .post('/api/v1/auth/signin')
    .send({ username: 'jess', password: 'jess' })
    .then(res => res.body.token)
}
