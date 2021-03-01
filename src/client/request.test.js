import * as auth from './auth'
import request from './request'
import { signInUrl } from '../shared/endpoints'

jest.mock('./auth')

describe('the request function', () => {
  it('returns the token when successful', () => {
    expect.assertions(2)
    const mockToken = 'test-token'
    const mockMessage = 'Authentication successful'
    const user = {
      username: 'testuser',
      password: 'testpassword'
    }

    auth.saveAuthToken.mockImplementation((token) => ({
      token: token,
      message: mockMessage
    }))

    function mockConsume () {
      return Promise.resolve({ body: { token: mockToken } })
    }

    return request(signInUrl, user, mockConsume)
      .then(res => {
        expect(res.token).toBe(mockToken)
        expect(res.message).toBe(mockMessage)
        return null
      })
  })

  it('ensures the request has the right headers', () => {
    expect.assertions(3)
    const mockToken = 'test-token'
    const mockMessage = 'Authentication successful'
    const user = {
      username: 'testuser',
      password: 'testpassword'
    }

    auth.saveAuthToken.mockImplementation((token) => ({
      token: token,
      message: mockMessage
    }))

    function mockConsume (endpoint, headers) {
      expect(headers.Accept).toBe('application/json')
      expect(headers['Content-Type']).toBe('application/json')
      return Promise.resolve({ body: { token: mockToken } })
    }

    return request(signInUrl, user, mockConsume)
      .then(res => {
        expect(res).toBeTruthy()
        return null
      })
  })

  it('requires a data object', () => {
    expect.assertions(1) // in case the catch isn't reached

    // Intentionally not passing the 2nd parameter to request()
    return request(signInUrl)
      .then(() => { return null /* should not get here */ })
      .catch(err => {
        expect(err.message).toMatch('Data parameter is required')
      })
  })

  it('requires the data parameter have a username property', () => {
    expect.assertions(1) // in case the catch isn't reached

    // Intentionally passing an empty object as the 2nd parameter
    return request(signInUrl, {})
      .then(() => { return null /* should not get here */ })
      .catch(err => {
        expect(err.message).toMatch('must have either a username or email property')
      })
  })
})
