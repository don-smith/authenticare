const express = require('express')
const { applyAuthRoutes } = require('authenticare/server')

const {
  createUser,
  userExists,
  getUserByName,
  getUserByEmail
} = require('../db/users')

const { sendPasswordResetEmail } = require('../email')
const { savePasswordToken } = require('../db/passwordTokens')

const router = express.Router()

applyAuthRoutes(router, {
  createUser,
  userExists,
  getUserByName,
  getUserByEmail,
  savePasswordToken,
  sendPasswordResetEmail
})

module.exports = router
