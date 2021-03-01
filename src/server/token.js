const jwt = require('jsonwebtoken')
const verifyJwt = require('express-jwt')

const testSecret = 'this-is-a-test-secret'

module.exports = {
  getIssuer,
  createToken,
  getTokenDecoder
}

function getIssuer (getUserByName) {
  if (!process.env.JWT_SECRET) throw new Error('Authenticare needs a JWT_SECRET environment variable.  Add it to your .env file or wherever you keep your environment variables.')
  return function (req, res) {
    return getUserByName(req.body.username)
      .then(user => {
        const token = createToken(user)
        res.json({
          message: 'Authentication successful.',
          token
        })
        return null
      })
  }
}

function getTokenDecoder (throwNoTokenError = true) {
  return (req, res, next) => {
    verifyJwt({
      secret: getSecret,
      algorithms: ['HS256'],
      credentialsRequired: throwNoTokenError
    })(req, res, next)
  }
}

function createToken (
  user,
  secret = process.env.JWT_SECRET,
  expiresIn = process.env.JWT_EXPIRE_TIME || '1d'
) {
  const token = { ...user }
  delete token.hash
  return jwt.sign(token, secret, { expiresIn })
}

function getSecret (req, payload, done) {
  const secret = process.env.JWT_SECRET || testSecret
  if (secret === testSecret) {
    // eslint-disable-next-line no-console
    // console.warn('ATTENTION: Using the JWT Test secret')
  }
  done(null, secret)
}
