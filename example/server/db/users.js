const connection = require('./connection')
const { generateHash } = require('authenticare/server')

module.exports = {
  createUser,
  userExists,
  getUserByName,
  getUserByEmail
}

function createUser (user, db = connection) {
  return userExists(user.username, db)
    .then(exists => {
      if (exists) {
        throw new Error('User exists')
      }
      return null
    })
    .then(() => generateHash(user.password))
    .then(passwordHash => {
      return db('users').insert({
        email: user.email,
        username: user.username,
        hash: passwordHash
      })
    })
}

function userExists (username, db = connection) {
  return db('users')
    .count('id as n')
    .where('username', username)
    .then(count => {
      return count[0].n > 0
    })
}

function getUserByName (username, db = connection) {
  return db('users')
    .select()
    .where('username', username)
    .first()
}

function getUserByEmail (email, db = connection) {
  return db('users')
    .select()
    .where('email', email)
    .first()
}
