const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = function sendEmail (email, token) {
  const msgOptions = {
    personalizations: [
      {
        to: [{ email }],
        dynamic_template_data: { token },
        subject: 'Reset password for Authenticare example'
      }
    ],
    from: {
      name: 'Authenticare Example',
      email: 'admin@authenticare.eda.nz'
    },
    reply_to: {
      name: 'Authenticare Example',
      email: 'reply@authenticare.eda.nz'
    },
    template_id: 'd-59311f22b7b44b099c48c18d0fef0cfa'
  }

  return sgMail
    .send(msgOptions)
    .then(() => {
      console.info(`Email sent to ${email}`)
      return null
    })
    .catch((error) => {
      console.error(JSON.stringify(error, null, 2))
    })
}
