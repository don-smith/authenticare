const sendEmail = require('./sendEmail')

module.exports = {
  sendPasswordResetEmail
}

function sendPasswordResetEmail (user, token) {
  return sendEmail(user.email, token)
    .then(() => {
      return null
    })
}
