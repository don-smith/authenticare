const express = require('express')

const hash = require('./hash')
const token = require('./token')
const {
  registerUrl,
  signInUrl,
  resetPasswordUrl,
  isValidEmail
} = require('../shared')

const DATABASE_ERROR = 'DATABASE_ERROR'
const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
const USERNAME_UNAVAILABLE = 'USERNAME_UNAVAILABLE'
const START_RESET_PASSWORD = 'START_RESET_PASSWORD'
// const FINISH_RESET_PASSWORD = 'FINISH_RESET_PASSWORD'

module.exports = {
  applyAuthRoutes
}

// TODO: Refactor this function
function applyAuthRoutes (router, functions) {
  const issueToken = token.getIssuer(functions.getUserByName)

  router.use(express.json())
  router.post(resetPasswordUrl, startResetPassword)
  router.post(`${resetPasswordUrl}/:token`, finishResetPassword)
  router.post(registerUrl, register, issueToken)
  router.post(signInUrl, signIn, issueToken)

  function startResetPassword (req, res, next) {
    const emailAddress = req.body.email
    // verify email address is valid
    if (!emailAddress || !isValidEmail(emailAddress)) {
      throw new Error('Email address is not valid')
    }

    // verify req.body.email is registered
    functions.getUserByEmail(emailAddress)
      .then(user => {
        // ensure a user was returned
        if (!user) throw new Error('Could not find user with that email address')

        // create reset token
        const passwordToken = token.createToken(user)
        return { user, passwordToken }
      })
      .then(({ user, passwordToken }) => {
        // save reset token to db
        // eslint-disable-next-line promise/no-nesting
        return functions.savePasswordToken(user, passwordToken)
          .then(() => ({ user, passwordToken }))
      })
      .then(({ user, passwordToken }) => {
        // send email to user
        return functions.sendPasswordResetEmail(user, passwordToken)
      })
      .then(() => {
        res.sendStatus(200)
        return null
      })
      .catch(err => {
        return res.status(500).json({
          errorType: START_RESET_PASSWORD,
          message: err.message
        })
      })
  }

  function finishResetPassword (req, res, next) {
    // verify req.params.token
    // ensure reset token hasn't expired
    // find and remove token in reset_tokens table
    // update the users password
  }

  function register (req, res, next) {
    functions.userExists(req.body.username)
      .then(exists => {
        if (exists) {
          return res.status(400).json({
            errorType: USERNAME_UNAVAILABLE
          })
        }
        // eslint-disable-next-line
        return functions.createUser(req.body).then(() => next())
      })
      .catch(err => {
        res.status(500).json({
          errorType: DATABASE_ERROR,
          error: err.message
        })
      })
  }

  function signIn (req, res, next) {
    functions.getUserByName(req.body.username)
      .then(user => {
        if (user) return user
        throw new Error(INVALID_CREDENTIALS)
      })
      .then(user => {
        return user && hash.verify(user.hash, req.body.password)
      })
      .then(isValid => {
        // eslint-disable-next-line promise/no-callback-in-promise
        if (isValid) return next()
        throw new Error(INVALID_CREDENTIALS)
      })
      .catch(err => {
        if (err.message === INVALID_CREDENTIALS) {
          return res.status(400).json({
            errorType: INVALID_CREDENTIALS
          })
        }

        res.status(500).json({
          errorType: DATABASE_ERROR,
          error: err.message
        })
      })
  }
}
