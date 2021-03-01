const connection = require('./connection')

module.exports = {
  savePasswordToken
}

function savePasswordToken (user, token, db = connection) {
  const { email } = user
  return db('password_tokens').insert({ email, token })
}
